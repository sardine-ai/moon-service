/* eslint-disable @typescript-eslint/no-explicit-any */

import { swapUsdcToEthUninjected } from './uniswap';
import { buyClubHouseNFTUninjected } from './clubhouse';
import { buyGenieNFTUninjected } from './genie';
import { buildTransferFundsBundle } from './transfer-funds';
import { handleFireblocksWebhookUninjected } from './fireblocks-webhook';
import { buildSwapTokensBundleUninjected } from './swap-tokens';
import {
  executeBundleUninjected,
  quoteBundleUninjected,
  ExecuteBundle,
  QuoteBundle,
  quoteTransactionUninjected
} from '../orchestrators';
import {
  ITransactionSubmissionClient,
  SelfCustodyClient,
  FireblocksClient,
  TestTransactionSubmissionClient
} from '../clients/transactions';
import { GenieClient } from '../clients/genie';
import getCryptoConfig, { getTestCryptoConfig } from '../config/crypto-config';
import getFireblocksConfig from '../config/fireblocks-config';
import { buildBuyNftBundleUninjected } from './buy-nft';
import { OpenSeaClient } from '../clients/opensea';
import { Network, OpenSeaSDK } from 'opensea-js';
import Web3 from 'web3';
import logger from '../loaders/logger';
import {
  getBundle,
  storeBundle,
  updateTransaction,
  getBundleByTransactionExecutionId
} from '../repositories/prisma-repository';
import {
  commandUninjected,
  quoteCommandUninjected,
  getBundleStatusUninjected
} from './command';
import { notifySubscribers } from '../clients/notifications';
import {
  buildZeroXSwapTransactionUninjected,
  buildSwapTokensTransactionUninjected,
  buildSwapTransactionFromReceiptUninjected,
  getZeroXSwapData
} from '../clients/swaps';
import { getAlchemyGasDetails, getTestGasDetails } from '../clients/transactions/gas';

const cryptoConfig = getCryptoConfig();
const fireblocksConfig = getFireblocksConfig();

let transactionSubmissionClient: ITransactionSubmissionClient;
if (process.argv.length > 2 && process.argv[2] == 'fireblocks') {
  logger.warn('Configured to use Fireblocks to submit transactions');
  transactionSubmissionClient = new FireblocksClient(
    fireblocksConfig,
    cryptoConfig,
    getAlchemyGasDetails
  );
} else if (process.argv.length > 2 && process.argv[2] == 'self') {
  logger.info('Configured to use your personal keys to submit transactions');
  transactionSubmissionClient = new SelfCustodyClient(
    cryptoConfig,
    getAlchemyGasDetails
  );
} else {
  logger.info('Configured to send fake transactions');
  const testCryptoConfig = getTestCryptoConfig()
  transactionSubmissionClient = new TestTransactionSubmissionClient(testCryptoConfig, getTestGasDetails);
}
const genieClient: GenieClient = new GenieClient(logger);

const ethProvider: any = new Web3.providers.HttpProvider(cryptoConfig.ethRPC);
const ethOpenSea = new OpenSeaSDK(ethProvider, {
  networkName: cryptoConfig.ethChain as Network,
  apiKey: cryptoConfig.openSeaAPIKey
});

const openSeaClient: OpenSeaClient = new OpenSeaClient(
  cryptoConfig,
  ethOpenSea
);

const executeBundle: ExecuteBundle = executeBundleUninjected(
  transactionSubmissionClient,
  updateTransaction,
);

const quoteTransaction = quoteTransactionUninjected(
  cryptoConfig,
  getAlchemyGasDetails
);

const quoteBundle: QuoteBundle = quoteBundleUninjected(
  transactionSubmissionClient,
  quoteTransaction,
);

export const swapUsdcToEth = swapUsdcToEthUninjected(
  cryptoConfig,
  transactionSubmissionClient
);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(
  transactionSubmissionClient
);
export const buyGenieNFT = buyGenieNFTUninjected(
  genieClient,
  transactionSubmissionClient,
  cryptoConfig
);

export const transferFunds = commandUninjected(
  buildTransferFundsBundle,
  storeBundle,
  executeBundle
);
export const quoteTransferFunds = quoteCommandUninjected(
  buildTransferFundsBundle,
  quoteBundle
);

const buildSwapTransaction = buildZeroXSwapTransactionUninjected(
  cryptoConfig,
  getZeroXSwapData
);

const buildSwapTransactionFromReceipt =
  buildSwapTransactionFromReceiptUninjected(
    false,
    cryptoConfig,
    buildSwapTransaction
  );

const buildSwapTokensTransaction = buildSwapTokensTransactionUninjected(
  true,
  buildSwapTransaction
);

const buildQuoteSwapTokensTransaction = buildSwapTokensTransactionUninjected(
  false,
  buildSwapTransaction
);

const buildBuyNftBundle = buildBuyNftBundleUninjected(
  openSeaClient,
  quoteBundle,
  buildSwapTransactionFromReceipt
);

export const buyNft = commandUninjected(
  buildBuyNftBundle,
  storeBundle,
  executeBundle
);
export const quoteBuyNft = quoteCommandUninjected(
  buildBuyNftBundle,
  quoteBundle
);

const buildSwapTokensBundle = buildSwapTokensBundleUninjected(
  buildSwapTokensTransaction
);

const buildQuoteSwapTokensBundle = buildSwapTokensBundleUninjected(
  buildQuoteSwapTokensTransaction
);

export const swapTokens = commandUninjected(
  buildSwapTokensBundle,
  storeBundle,
  executeBundle
);
export const quoteSwapTokens = quoteCommandUninjected(
  buildQuoteSwapTokensBundle,
  quoteBundle
);

export const handleFireblocksWebhook = handleFireblocksWebhookUninjected(
  getBundleByTransactionExecutionId,
  updateTransaction,
  notifySubscribers,
  executeBundle
);

export const getBundleStatus = getBundleStatusUninjected(getBundle);
