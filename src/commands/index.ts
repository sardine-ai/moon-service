/* eslint-disable @typescript-eslint/no-explicit-any */

import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { transferFundsUninjected } from "./transferFunds";
import { ITransactionSubmissionClient, SelfCustodyClient, FireblocksClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import getCryptoConfig from "../config/cryptoConfig";
import getFireblocksConfig from "../config/fireblocksConfig";
import { buySeaportNFTUninjected } from "./seaport";
import { OpenSeaClient } from "../clients/openSea";
import { Network, OpenSeaSDK } from 'opensea-js';
import Web3 from "web3";
import { Erc20 } from "../clients/evm";
import logger from "../loaders/logger";

const cryptoConfig = getCryptoConfig();
const fireblocksConfig = getFireblocksConfig();

let transactionSubmissionClient: ITransactionSubmissionClient;
if (process.argv.length > 2 && process.argv[2] == "fireblocks") {
  logger.warn("Configured to use Fireblocks to submit transactions")
  transactionSubmissionClient = new FireblocksClient(logger, cryptoConfig.ethChain, cryptoConfig.polygonChain, fireblocksConfig);
} else {
  logger.info("Configured to use your personal keys to submit transactions")
  transactionSubmissionClient = new SelfCustodyClient(logger, cryptoConfig.ethChain, cryptoConfig.polygonChain, cryptoConfig);
}
const genieClient: GenieClient = new GenieClient(logger);

const provider: any = new Web3.providers.HttpProvider(cryptoConfig.ethRPC);
const openSeaClient: OpenSeaClient = new OpenSeaClient(logger, cryptoConfig.ethChain, cryptoConfig.polygonChain, new OpenSeaSDK(provider, {
  networkName: cryptoConfig.openSeaNetwork as Network,
  apiKey: cryptoConfig.openSeaAPIKey,
}, logger.info))

const erc20: Erc20 = new Erc20(logger, cryptoConfig);

export const swapUsdcToEth = swapUsdcToEthUninjected(logger, cryptoConfig, transactionSubmissionClient);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(logger, transactionSubmissionClient);
export const buyGenieNFT = buyGenieNFTUninjected(logger, genieClient, transactionSubmissionClient);
export const buySeaportNFT = buySeaportNFTUninjected(logger, openSeaClient, transactionSubmissionClient, cryptoConfig);
export const transferFunds = transferFundsUninjected(logger, erc20, cryptoConfig, transactionSubmissionClient);
