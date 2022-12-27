import { CryptoConfig } from '../../config/crypto-config';
import { Operation, Transaction, TransactionState } from '../../types/models';
import { BundleReceiptResponse } from '../../types/models/receipt';
import { v4 as uuidV4 } from 'uuid';
import { getAssetDetails } from '../../utils/crypto-utils';
import { SwapTokensParams } from '../../types/requests';

export type BuildSwapTransaction = (
  bundle: BundleReceiptResponse
) => Promise<Array<Transaction>>;

export type GetZeroXSwapData = (
  baseUrl: string,
  zeroXSwapParams: ZeroXSwapParams
) => Promise<any>;

export const getZeroXSwapData = async (
  baseUrl: string,
  { sellToken, buyToken, buyAmount, intentOnFilling }: ZeroXSwapParams
) => {
  const url = `${baseUrl}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&buyAmount=${buyAmount}&intentOnFilling=${intentOnFilling}`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      '0x-api-key': process.env.ZERO_X_API_KEY || '',
      'Content-Type': 'application/json'
    }
  });
};

const buildTransactionWithSwapData = (
  chain: string,
  swapData: ZeroXSwapResponse,
  swapRequest: ZeroXSwapParams
): Transaction => {
  return {
    id: uuidV4(),
    order: -1,
    state: TransactionState.CREATED,
    operation: Operation.SWAP_TOKENS,
    assetCosts: [
      {
        assetSymbol: swapRequest.sellToken,
        amount: swapData.sellAmount,
        decimals: getAssetDetails(chain, swapRequest.sellToken).decimals
      },
      {
        assetSymbol: swapRequest.buyToken,
        amount: (parseInt(swapData.buyAmount) * -1).toString(),
        decimals: getAssetDetails(chain, swapRequest.buyToken).decimals
      }
    ],
    chain: chain,
    to: swapData.to,
    value: swapData.value,
    callData: swapData.data
  };
};

export type BuildZeroXSwapTransaction = (
  zeroXSwapParams: ZeroXSwapParams
) => Promise<Transaction | null>;

export const buildZeroXSwapTransactionUninjected =
  (cryptoConfig: CryptoConfig, getZeroXSwapData: GetZeroXSwapData) =>
  async (zeroXSwapParams: ZeroXSwapParams) => {
    // On devnet 0X uses contract addresses instead of token symbols
    // if (cryptoConfig.ethChain === "goerli") {
    //   zeroXSwapParams.buyToken = getAssetDetails(
    //     cryptoConfig.ethChain,
    //     zeroXSwapParams.buyToken
    //   ).assetContractAddress;
    //   zeroXSwapParams.sellToken = getAssetDetails(
    //     cryptoConfig.ethChain,
    //     zeroXSwapParams.sellToken
    //   ).assetContractAddress;
    // }

    const swapDataResponse = await getZeroXSwapData(
      cryptoConfig.eth0xSwapEndpoint,
      zeroXSwapParams
    );
    if (!swapDataResponse.ok) {
      return null;
    }
    const swapData = await swapDataResponse.json();
    const transaction = buildTransactionWithSwapData(
      cryptoConfig.ethChain,
      swapData,
      zeroXSwapParams
    );
    return transaction;
  };

// For now only works on ethereum mainnet
export const buildSwapTransactionFromReceiptUninjected =
  (
    intentOnFilling: boolean,
    cryptoConfig: CryptoConfig,
    buildTransaction: BuildZeroXSwapTransaction
  ) =>
  async (bundleReceipt: BundleReceiptResponse): Promise<Array<Transaction>> => {
    const transactions =
      (await bundleReceipt.totalCosts
        ?.filter(cost => cost.assetSymbol != cryptoConfig.stableCoin)
        .reduce(async (previousPromise, cost) => {
          const acc = await previousPromise;

          const zeroXSwapParams: ZeroXSwapParams = {
            sellToken: cryptoConfig.stableCoin,
            buyToken: 'ETH',
            buyAmount: cost.amount,
            intentOnFilling: intentOnFilling
          };

          const transaction = await buildTransaction(zeroXSwapParams);
          if (transaction) {
            acc.push(transaction);
          }
          return acc;
        }, Promise.resolve([]) as Promise<Array<Transaction>>)) ?? [];

    return transactions;
  };

export const buildSwapTokensTransactionUninjected =
  (intentOnFilling: boolean, buildTransaction: BuildZeroXSwapTransaction) =>
  async (params: SwapTokensParams): Promise<Transaction | null> => {
    const zeroXSwapParams: ZeroXSwapParams = {
      sellToken: params.sellToken,
      buyToken: params.buyToken,
      buyAmount: params.buyAmount.toString(),
      intentOnFilling: intentOnFilling
    };
    const transaction = await buildTransaction(zeroXSwapParams);
    return transaction;
  };

interface ZeroXSwapParams {
  sellToken: string;
  buyToken: string;
  buyAmount: string;
  intentOnFilling: boolean;
}

interface ZeroXSwapResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  from: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: {
    name: string;
    proportion: string;
  }[];
  orders: {
    type: number;
    source: string;
    makerToken: string;
    takerToken: string;
    makerAmount: string;
    takerAmount: string;
    fillData: {
      tokenAddressPath: Array<string>;
      router: string;
    };
    fill: {
      input: string;
      output: string;
      adjustedOutput: string;
      gas: number;
    };
  }[];
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string;
}
