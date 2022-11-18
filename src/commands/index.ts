/* eslint-disable @typescript-eslint/no-explicit-any */

import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { buildTransferFundsBundle } from "./transfer-funds";
import { executeBundleUninjected, ExecuteBundle } from "../clients/transactions/helpers";
import { ITransactionSubmissionClient, SelfCustodyClient, FireblocksClient, TestTransactionSubmissionClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import getCryptoConfig from "../config/crypto-config";
import getFireblocksConfig from "../config/fireblocks-config";
import { buildBuySeaportNftBundleUninjected } from "./seaport";
import { OpenSeaClient } from "../clients/opensea";
import { Network, OpenSeaSDK } from 'opensea-js';
import Web3 from "web3";
import logger from "../loaders/logger";
import { storeBundle, updateTransaction } from "../repositories/prisma-repository";
import { commandUninjected } from "./command";

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

const ethProvider: any = new Web3.providers.HttpProvider(cryptoConfig.ethRPC);
const ethOpenSea = new OpenSeaSDK(ethProvider, {
  networkName: cryptoConfig.openSeaNetwork as Network,
  apiKey: cryptoConfig.openSeaAPIKey,
})

const openSeaClient: OpenSeaClient = new OpenSeaClient(logger, cryptoConfig, ethOpenSea)

const executeBundle: ExecuteBundle = executeBundleUninjected(transactionSubmissionClient, updateTransaction, logger)

export const swapUsdcToEth = swapUsdcToEthUninjected(logger, cryptoConfig, transactionSubmissionClient); 
export const buyClubHouseNFT = buyClubHouseNFTUninjected(logger, transactionSubmissionClient);
export const buyGenieNFT = buyGenieNFTUninjected(logger, genieClient, transactionSubmissionClient, cryptoConfig);

export const transferFunds = commandUninjected(logger, buildTransferFundsBundle, storeBundle, executeBundle); // <----- Every command should look like this

const buildBuyNftBundle = buildBuySeaportNftBundleUninjected(openSeaClient);
export const buyNft = commandUninjected(logger, buildBuyNftBundle, storeBundle, executeBundle); 

