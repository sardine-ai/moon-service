import { CryptoConfig } from '../../config/crypto-config';
import { Operation, Transaction, TransactionState } from '../../types/models';
import { BundleReceiptResponse } from '../../types/models/receipt';
import { v4 as uuidV4 } from 'uuid';
import { getAssetDetails } from '../../utils/crypto-utils';
import { SwapTokensParams } from '../../types/requests';
import { AxiosResponse, AxiosError } from 'axios'; 
import axios from '../../api/axios'; 
import logger from '../../loaders/logger';

export type BuildSwapTransaction = (
  bundle: BundleReceiptResponse
) => Promise<Array<Transaction>>;

export type GetZeroXSwapData = (
  baseUrl: string,
  zeroXSwapParams: ZeroXSwapParams
) => Promise<any>;

export const getZeroXSwapData: GetZeroXSwapData = async (
  baseUrl: string,
  { sellToken, buyToken, buyAmount, intentOnFilling }: ZeroXSwapParams
) => {
  const url = `${baseUrl}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&buyAmount=${buyAmount}&intentOnFilling=${intentOnFilling}`;
  const data = await axios.get(url, {
    headers: {
      '0x-api-key': process.env.ZERO_X_API_KEY || '',
      'Content-Type': 'application/json'
    }
  })
  .then((response: AxiosResponse<ZeroXSwapResponse>) => {
    return response.data
  })
  .catch((reason: AxiosError<any>) => {
    if (reason.response!.status === 400) {
      logger.error(`400 Error calling 0x API: ${reason.message}`)
    } else {  
      logger.error(`500 Error calling 0x API: ${reason.message}`)
    }
    return undefined
  })

  return data;
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
) => Promise<Transaction | undefined>;

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

    const swapData = await getZeroXSwapData(
      cryptoConfig.eth0xSwapEndpoint,
      zeroXSwapParams
    );
    if (swapData) {
      const transaction = buildTransactionWithSwapData(
        cryptoConfig.ethChain,
        swapData,
        zeroXSwapParams
      );
      return transaction;
    }
    return undefined;
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
  async (params: SwapTokensParams): Promise<Transaction | undefined> => {
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

export const getTestZeroXSwapData: GetZeroXSwapData = async (
  _baseUrl: string,
  { sellToken, buyToken, buyAmount, intentOnFilling }: ZeroXSwapParams
) => {
  return {
    "chainId": 1,
    "price": "100000000",
    "guaranteedPrice": "200000000",
    "estimatedPriceImpact": "99.9989",
    "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    "data": "0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003e265e2feb63acba90",
    "value": "0",
    "gas": "111000",
    "estimatedGas": "111000",
    "gasPrice": "24000000000",
    "protocolFee": "0",
    "minimumProtocolFee": "0",
    "buyTokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "sellTokenAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "buyAmount": "10000",
    "sellAmount": "1",
    "sources": [
        {
            "name": "0x",
            "proportion": "0"
        },
        {
            "name": "Uniswap",
            "proportion": "0"
        },
        {
            "name": "Uniswap_V2",
            "proportion": "1"
        },
        {
            "name": "Curve",
            "proportion": "0"
        },
        {
            "name": "Balancer",
            "proportion": "0"
        },
        {
            "name": "Balancer_V2",
            "proportion": "0"
        },
        {
            "name": "Bancor",
            "proportion": "0"
        },
        {
            "name": "BancorV3",
            "proportion": "0"
        },
        {
            "name": "mStable",
            "proportion": "0"
        },
        {
            "name": "SushiSwap",
            "proportion": "0"
        },
        {
            "name": "Shell",
            "proportion": "0"
        },
        {
            "name": "MultiHop",
            "proportion": "0"
        },
        {
            "name": "DODO",
            "proportion": "0"
        },
        {
            "name": "DODO_V2",
            "proportion": "0"
        },
        {
            "name": "CryptoCom",
            "proportion": "0"
        },
        {
            "name": "Lido",
            "proportion": "0"
        },
        {
            "name": "MakerPsm",
            "proportion": "0"
        },
        {
            "name": "KyberDMM",
            "proportion": "0"
        },
        {
            "name": "Component",
            "proportion": "0"
        },
        {
            "name": "Saddle",
            "proportion": "0"
        },
        {
            "name": "Uniswap_V3",
            "proportion": "0"
        },
        {
            "name": "Curve_V2",
            "proportion": "0"
        },
        {
            "name": "ShibaSwap",
            "proportion": "0"
        },
        {
            "name": "Synapse",
            "proportion": "0"
        },
        {
            "name": "Synthetix",
            "proportion": "0"
        },
        {
            "name": "Aave_V2",
            "proportion": "0"
        },
        {
            "name": "Compound",
            "proportion": "0"
        }
    ],
    "orders": [
        {
            "type": 0,
            "source": "Uniswap_V2",
            "makerToken": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "takerToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "makerAmount": "10000",
            "takerAmount": "1",
            "fillData": {
                "tokenAddressPath": [
                    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                ],
                "router": "0xf164fc0ec4e93095b804a4795bbe1e041497b92a"
            },
            "fill": {
                "input": "10000",
                "output": "1",
                "adjustedOutput": "1",
                "gas": 90000
            }
        }
    ],
    "allowanceTarget": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    "decodedUniqueId": "3e265e2feb-1672264336",
    "sellTokenToEthRate": "1183.91868",
    "buyTokenToEthRate": "1",
    "expectedSlippage": "-0.000040488040297340241092659860170274956067918"
  }
};