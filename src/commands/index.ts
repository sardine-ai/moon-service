/* eslint-disable @typescript-eslint/no-explicit-any */

import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { transferFundsUninjected } from "./transferFunds";
import { SelfCustodyClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import getCryptoConfig from "../config/cryptoConfig";
// import getFireblocksConfig from "../config/fireblocksConfig";
import { buySeaportNFTUninjected } from "./seaport";
import { OpenSeaClient } from "../clients/openSea";
import { Network, OpenSeaSDK } from 'opensea-js';
import Logger from "../loaders/logger";
import Web3 from "web3";
import { Erc20 } from "../clients/evm";

const cryptoConfig = getCryptoConfig();
// const fireblocksConfig = getFireblocksConfig();

// const fireblocksClient: FireblocksClient = new FireblocksClient(cryptoConfig.ethChain, cryptoConfig.polygonChain, fireblocksConfig)
const fireblocksClient: SelfCustodyClient = new SelfCustodyClient(cryptoConfig.ethChain, cryptoConfig.polygonChain, cryptoConfig)
const genieClient: GenieClient = new GenieClient();

const provider: any = new Web3.providers.HttpProvider(cryptoConfig.ethRPC);
const openSeaClient: OpenSeaClient = new OpenSeaClient(cryptoConfig.ethChain, cryptoConfig.polygonChain, new OpenSeaSDK(provider, {
  networkName: cryptoConfig.openSeaNetwork as Network,
  apiKey: cryptoConfig.openSeaAPIKey,
}, Logger.info))

const erc20: Erc20 = new Erc20(cryptoConfig);

export const swapUsdcToEth = swapUsdcToEthUninjected(cryptoConfig, fireblocksClient);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(fireblocksClient);
export const buyGenieNFT = buyGenieNFTUninjected(genieClient, fireblocksClient);
export const buySeaportNFT = buySeaportNFTUninjected(openSeaClient, fireblocksClient, cryptoConfig);
export const transferFunds = transferFundsUninjected(erc20, cryptoConfig, fireblocksClient);
