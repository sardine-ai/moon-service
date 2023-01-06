import { Operation, TransactionState } from '../../src/types/models';
import { TestOpenSeaClient } from '../../src/clients/opensea';
import { buildBuyNftBundleUninjected } from '../../src/commands/buy-nft';
import {
  buildSwapTransactionFromReceiptUninjected,
  buildZeroXSwapTransactionUninjected,
  getTestZeroXSwapData
} from '../../src/clients/swaps';
import { getTestCryptoConfig } from '../../src/config/crypto-config';
import {
  QuoteBundle,
  quoteBundleUninjected,
  quoteTransactionUninjected
} from '../../src/orchestrators';
import { TestTransactionSubmissionClient } from '../../src/clients/transactions';
import { getTestGasDetails } from '../../src/clients/transactions/gas';
import { updateBundleWithFakeId } from '../utils/test-utils';

describe('Testing Build Buy NFT Bundle', () => {
  const openSea = new TestOpenSeaClient();
  const testCryptoConfig = getTestCryptoConfig();
  const transactionSubmissionClient = new TestTransactionSubmissionClient(
    testCryptoConfig,
    getTestGasDetails
  );
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
  );

  const quoteBundle: QuoteBundle = quoteBundleUninjected(
    transactionSubmissionClient,
    quoteTransaction
  );

  const buildBuyNftBundle = buildBuyNftBundleUninjected(
    openSea,
    quoteBundle,
    buildSwapTransactionFromReceipt
  );

  test('it builds buy nft bundle', async () => {
    let bundle = await buildBuyNftBundle({
      nftId: '1',
      collectionName: 'A fun collection',
      contractAddress: '0xcontractAddress',
      chain: 'goerli',
      recipientAddress: '0xrecipientAddress',
      platform: 'opensea'
    });
    bundle = updateBundleWithFakeId(bundle, '0');
    expect(bundle).toEqual({
      id: '0',
      operation: Operation.BUY_NFT,
      transactions: [
        {
          id: '0',
          bundleId: '0',
          assetCosts: [
            {
              amount: '1',
              assetSymbol: 'WETH',
              decimals: 18
            },
            {
              amount: '-10000',
              assetSymbol: 'ETH',
              decimals: 18
            }
          ],
          callData:
            '0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000003e265e2feb63acba90',
          chain: 'goerli',
          operation: Operation.SWAP_TOKENS,
          order: 0,
          state: TransactionState.CREATED,
          to: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
          value: '0'
        },
        {
          id: '0',
          order: 1,
          assetCosts: [
            {
              amount: '1',
              assetSymbol: 'ETH',
              decimals: 18
            }
          ],
          state: TransactionState.CREATED,
          to: '0xcontractAddress',
          value: '1',
          callData: '0xcallData',
          chain: 'goerli',
          operation: Operation.BUY_NFT,
          bundleId: '0'
        }
      ]
    });
  });
  test('it builds quotes buy nft', async () => {
    let bundle = await buildBuyNftBundle({
      nftId: '1',
      collectionName: 'A fun collection',
      contractAddress: '0xcontractAddress',
      chain: 'goerli',
      recipientAddress: '0xrecipientAddress',
      platform: 'opensea'
    });
    bundle = updateBundleWithFakeId(bundle, '0');
    const quote = await quoteBundle(bundle);
    expect(quote).toEqual({
      totalCosts: [
        {
          amount: '1',
          assetSymbol: 'WETH',
          decimals: 18
        },
        {
          amount: '2.9646277825578994e+21',
          assetSymbol: 'ETH',
          decimals: 18
        }
      ],
      transactionReceipts: [
        {
          assetCosts: [
            {
              amount: '1',
              assetSymbol: 'WETH',
              decimals: 18
            },
            {
              amount: '-10000',
              assetSymbol: 'ETH',
              decimals: 18
            }
          ],
          chain: 'goerli',
          gasCost: '1.4823138912789497e+21',
          operation: Operation.SWAP_TOKENS
        },
        {
          assetCosts: [
            {
              amount: '1',
              assetSymbol: 'ETH',
              decimals: 18
            }
          ],
          chain: 'goerli',
          gasCost: '1.4823138912789497e+21',
          operation: Operation.BUY_NFT
        }
      ]
    });
  });
});
