import { Operation, TransactionState } from "../../src/types/models";
import { TestOpenSeaClient } from "../../src/clients/opensea";
import { buildBuyNftBundleUninjected } from "../../src/commands/buy-nft";
import { buildSwapTransactionFromReceiptUninjected, buildZeroXSwapTransactionUninjected, getTestZeroXSwapData } from "../../src/clients/swaps";
import { getTestCryptoConfig } from "../../src/config/crypto-config";
import { QuoteBundle, quoteBundleUninjected, quoteTransactionUninjected } from "../../src/orchestrators";
import { TestTransactionSubmissionClient } from "../../src/clients/transactions";
import logger from "../../src/loaders/logger";
import { getTestGasDetails } from "../../src/clients/transactions/gas";

describe('Testing Build Buy NFT Bundle', () => {
  const openSea = new TestOpenSeaClient();
  const transactionSubmissionClient = new TestTransactionSubmissionClient()
  const cryptoConfig = getTestCryptoConfig();
  const buildSwapTransaction = buildZeroXSwapTransactionUninjected(
    cryptoConfig,
    getTestZeroXSwapData
  );
  
  const buildSwapTransactionFromReceipt =
    buildSwapTransactionFromReceiptUninjected(
      false,
      cryptoConfig,
      buildSwapTransaction
    );

  const quoteTransaction = quoteTransactionUninjected(
    cryptoConfig,
    getTestGasDetails
  )
  
  const quoteBundle: QuoteBundle = quoteBundleUninjected(
    transactionSubmissionClient,
    quoteTransaction,
    logger
  );
  const buildBuyNftBundle = buildBuyNftBundleUninjected(
    openSea,
    quoteBundle,
    buildSwapTransactionFromReceipt
  );;

  test('it builds buy nft bundle', async () => {
    const bundle = await buildBuyNftBundle({
      nftId: "1",
      collectionName: "A fun collection",
      contractAddress: "0xcontractAddress",
      chain: "goerli",
      recipientAddress: "0xrecipientAddress",
      platform: "opensea",
    })
    bundle.id = "0";
    bundle.transactions = bundle.transactions.map(t => {
      t.id = "0"
      t.bundleId = "0"
      return t
    });
    expect(bundle).toEqual({
      id: "0",
      operation: Operation.BUY_NFT,
      transactions: [
        { 
          id: "0",
          bundleId: "0",
          assetCosts: [
            {
              amount: "1",
              assetSymbol: "WETH",
              decimals: 18
            },
            {
              amount: "-10000",
              assetSymbol: "ETH",
              decimals: 18
            }
          ],
          callData: "0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003e265e2feb63acba90",
          chain: "goerli",
          operation: Operation.SWAP_TOKENS,
          order: 0,
          state: TransactionState.CREATED,
          to: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
          value: "0"
        },
        {
          id: "0",
          order: 1,
          state: TransactionState.CREATED,
          to: "0xcontractAddress",
          value: "1",
          callData: "0xcallData",
          chain: "goerli",
          operation: Operation.BUY_NFT,
          bundleId: "0"
        }
      ]
    });
  });
});