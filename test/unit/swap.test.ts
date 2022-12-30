import { getTestZeroXSwapData, buildTransactionWithSwapData, ZeroXSwapParams, buildZeroXSwapTransactionUninjected, buildSwapTokensTransactionUninjected } from "../../src/clients/swaps";
import { Operation, TransactionState } from "../../src/types/models";
import { getTestCryptoConfig } from "../../src/config/crypto-config";
import { buildSwapTokensBundleUninjected } from "../../src/commands/swap-tokens";
import { SwapTokensParams } from "../../src/types/requests";
import { updateBundleWithFakeId } from "../utils/test-utils";
import { quoteBundleUninjected, quoteTransactionUninjected } from "../../src/orchestrators";
import { getTestGasDetails } from "../../src/clients/transactions/gas";
import { TestTransactionSubmissionClient } from "../../src/clients/transactions";

describe('Testing Swap Client Logic', () => {
  test('it builds swap transaction from swap data', async() => {
    const swapParams: ZeroXSwapParams = {
      sellToken: "USDC",
      buyToken: "ETH",
      buyAmount: "10000",
      intentOnFilling: false
    }
    const swapData = await getTestZeroXSwapData('', swapParams);
    const transaction = buildTransactionWithSwapData('goerli', swapData, swapParams);
    transaction.id = "0"
    expect(transaction).toEqual({
      id: "0",
      assetCosts: [
        {
          amount: "1",
          assetSymbol: "USDC",
          decimals: 6
        },
        {
          amount: "-10000",
          assetSymbol: "ETH",
          decimals: 18
        }
      ],
      order: -1,
      state: TransactionState.CREATED,
      to: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
      chain: "goerli",
      value: "0",
      operation: Operation.SWAP_TOKENS,
      callData: "0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003e265e2feb63acba90"
    });
  });

  const cryptoConfig = getTestCryptoConfig();
  const transactionSubmissionClient = new TestTransactionSubmissionClient(cryptoConfig, getTestGasDetails);

  const buildSwapTransaction = buildZeroXSwapTransactionUninjected(
    cryptoConfig,
    getTestZeroXSwapData
  );

  const buildSwapTokensTransaction = buildSwapTokensTransactionUninjected(
    true,
    buildSwapTransaction
  );

  const buildSwapTokensBundle = buildSwapTokensBundleUninjected(
    buildSwapTokensTransaction
  );

  const quoteTransaction = quoteTransactionUninjected(
    cryptoConfig,
    getTestGasDetails
  )
  
  const quoteBundle = quoteBundleUninjected(
    transactionSubmissionClient,
    quoteTransaction,
  );

  test('it builds swap bundle', async() => {
    const swapTokensParams: SwapTokensParams = {
      sellToken: "USDC",
      buyToken: "ETH",
      buyAmount: 10000,
      chain: "goerli"
    }

    let bundle = await buildSwapTokensBundle(swapTokensParams);
    bundle = updateBundleWithFakeId(bundle, "0");
    expect(bundle).toEqual({
      id: "0",
      operation: Operation.SWAP_TOKENS,
      transactions: [{
        id: "0",
        bundleId: "0",
        operation: Operation.SWAP_TOKENS,
        assetCosts: [
          {
            amount: "1",
            assetSymbol: "USDC",
            decimals: 6
          },
          {
            amount: "-10000",
            assetSymbol: "ETH",
            decimals: 18
          }
        ],
        order: 0,
        state: TransactionState.CREATED,
        to: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        chain: "goerli",
        value: "0",
        callData: "0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003e265e2feb63acba90"
      }]
    });
  });

  test('it quotes swap bundle', async() => {
    const swapTokensParams: SwapTokensParams = {
      sellToken: "USDC",
      buyToken: "ETH",
      buyAmount: 10000,
      chain: "goerli"
    }

    let bundle = await buildSwapTokensBundle(swapTokensParams);
    bundle = updateBundleWithFakeId(bundle, "0");
    const quote = await quoteBundle(bundle);
    expect(quote).toEqual({
      totalCosts: [
         {
          amount: "1",
          assetSymbol: "USDC",
          decimals: 6,
        },
        {
          amount: "1.4823138912789497e+21",
          assetSymbol: "ETH",
          decimals: 18,
        },
      ],
      transactionReceipts: [
        {
          assetCosts: [
            {
              amount: "1",
              assetSymbol: "USDC",
              decimals: 6,
            },
            {
              amount: "1.4823138912789497e+21",
              assetSymbol: "ETH",
              decimals: 18,
            },
          ],
          chain: "goerli",
          gasCost: "1.4823138912789497e+21",
          operation: Operation.SWAP_TOKENS,
        },
      ],
    });
  });
});