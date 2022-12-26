import { CryptoConfig } from '../../config/crypto-config';
import { Operation, Transaction, TransactionState } from '../../types/models';
import { BundleReceiptResponse } from '../../types/models/receipt';
import { v4 as uuidV4 } from 'uuid';
import { getAssetDetails } from '../../utils/crypto-utils';

export type BuildSwapTransaction = (
  bundle: BundleReceiptResponse
) => Promise<Array<Transaction>>;

const get0xSwapData = async (
  baseUrl: string,
  { sellToken, buyToken, buyAmount, intentOnFilling }: Swap0xRequestParams
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
  swapData: Swap0xResponse,
  swapRequest: Swap0xRequestParams
): Transaction => {
  return {
    id: uuidV4(),
    order: -1,
    state: TransactionState.CREATED,
    operation: Operation.SWAP,
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
    gasCost: (Number(swapData.gas) * Number(swapData.gasPrice)).toString(),
    gas: swapData.gas,
    gasPrice: swapData.gasPrice,
    chain: chain,
    to: swapData.to,
    value: swapData.value,
    callData: swapData.data
  };
};

// For now only works on ethereum mainnet
export const buildSwapTransaction0xUninjected =
  (cryptoConfig: CryptoConfig, intentOnFilling: boolean) =>
  async (bundleReceipt: BundleReceiptResponse): Promise<Array<Transaction>> => {
    const transactions =
      (await bundleReceipt.totalCosts
        ?.filter(cost => cost.assetSymbol != cryptoConfig.stableCoin)
        .reduce(async (previousPromise, cost) => {
          const acc = await previousPromise;

          const swap0xRequestParams: Swap0xRequestParams = {
            sellToken: cryptoConfig.stableCoin,
            buyToken: 'ETH',
            buyAmount: cost.amount,
            intentOnFilling: intentOnFilling
          };
          const swapDataResponse = await get0xSwapData(
            cryptoConfig.eth0xSwapEndpoint,
            swap0xRequestParams
          );
          if (!swapDataResponse.ok) {
            return acc;
          }
          const swapData = await swapDataResponse.json();
          acc.push(
            buildTransactionWithSwapData(
              cryptoConfig.ethChain,
              swapData,
              swap0xRequestParams
            )
          );
          return acc;
        }, Promise.resolve([]) as Promise<Array<Transaction>>)) ?? [];

    return transactions;
  };

interface Swap0xRequestParams {
  sellToken: string;
  buyToken: string;
  buyAmount: string;
  intentOnFilling: boolean;
}

interface Swap0xResponse {
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
