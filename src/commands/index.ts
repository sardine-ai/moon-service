/* eslint-disable @typescript-eslint/no-explicit-any */

import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { transferFundsUninjected } from "./transfer-funds";
import { ITransactionSubmissionClient, SelfCustodyClient, FireblocksClient, executeBundleUninjected, ExecuteBundle, TestTransactionSubmissionClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import getCryptoConfig from "../config/crypto-config";
import getFireblocksConfig from "../config/fireblocks-config";
import { buySeaportNFTUninjected } from "./seaport";
import { OpenSeaClient } from "../clients/opensea";
import { Network, OpenSeaSDK } from 'opensea-js';
import Web3 from "web3";
import logger from "../loaders/logger";
import { storeBundle, updateTransaction } from "../repositories/prisma-repository";

const cryptoConfig = getCryptoConfig();
const fireblocksConfig = getFireblocksConfig()

let transactionSubmissionClient: ITransactionSubmissionClient;
if (process.argv.length > 2 && process.argv[2] == "fireblocks") {
  logger.warn("Configured to use Fireblocks to submit transactions")
  transactionSubmissionClient = new FireblocksClient(logger, fireblocksConfig, cryptoConfig);
} else if (process.argv.length > 2 && process.argv[2] == "self") {
  logger.info("Configured to use your personal keys to submit transactions")
  transactionSubmissionClient = new SelfCustodyClient(logger, cryptoConfig);
} else {
  logger.info("Configured to send fake transactions")
  transactionSubmissionClient = new TestTransactionSubmissionClient(logger);
}
const genieClient: GenieClient = new GenieClient(logger);

const provider: any = new Web3.providers.HttpProvider(cryptoConfig.ethRPC);
const openSeaClient: OpenSeaClient = new OpenSeaClient(logger, cryptoConfig.ethChain, cryptoConfig.polygonChain, new OpenSeaSDK(provider, {
  networkName: cryptoConfig.openSeaNetwork as Network,
  apiKey: cryptoConfig.openSeaAPIKey,
}, logger.info))

const executeBundle: ExecuteBundle = executeBundleUninjected(transactionSubmissionClient, updateTransaction)

export const swapUsdcToEth = swapUsdcToEthUninjected(logger, cryptoConfig, transactionSubmissionClient);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(logger, transactionSubmissionClient);
export const buyGenieNFT = buyGenieNFTUninjected(logger, genieClient, transactionSubmissionClient, cryptoConfig);
export const buySeaportNFT = buySeaportNFTUninjected(logger, openSeaClient, transactionSubmissionClient, cryptoConfig);
export const transferFunds = transferFundsUninjected(logger, storeBundle, executeBundle);
