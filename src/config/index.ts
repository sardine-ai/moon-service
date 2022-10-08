import dotenv from 'dotenv';
import { Chain } from "fireblocks-defi-sdk";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const CHAIN_TO_ASSET_ID: {[key: string]: string } = {
  [Chain.MAINNET]: 'ETH',
  [Chain.ROPSTEN]: 'ETH_TEST',
  [Chain.GOERLI]: 'ETH_TEST3',
  [Chain.KOVAN]: 'ETH_TEST2',
  [Chain.BSC]: 'BNB_BSC',
  [Chain.BSC_TEST]: 'BNB_TEST',
  [Chain.POLYGON]: 'MATIC_POLYGON',
  [Chain.MUMBAI]: 'MATIC_POLYGON_MUMBAI',
}

const CHAIN_IDS: {[key: string]: number }  = {
  [Chain.MAINNET]: 1,
  [Chain.ROPSTEN]: 3,
  [Chain.GOERLI]: 5,
  [Chain.KOVAN]: 42,
  [Chain.BSC]: 56,
  [Chain.BSC_TEST]: 97,
  [Chain.POLYGON]: 137,
  [Chain.MUMBAI]: 80001,
}

const ETH_CHAIN_TO_USDC_CONTRACT: {[key: string]: string } = {
  [Chain.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [Chain.ROPSTEN]: '0xFE724a829fdF12F7012365dB98730EEe33742ea2',
}

enum EthChain {
  MAINNET = "mainnet",
  ROPSTEN = "ropsten",
  RINKEBY = "rinkeby",
}

enum PolygonChain {
  MUMBAI = "mumbai",
  MAINNET = "polygon",
}

enum SolanaChain {
  MAINNET = "mainnet-beta",
  DEVNET = "devnet",
}

const ethChain = process.env.ETH_CHAIN || EthChain.ROPSTEN;
const ethChainId = CHAIN_IDS[ethChain];
const ethAssetId = CHAIN_TO_ASSET_ID[ethChain];
const ethUsdcAddress = ETH_CHAIN_TO_USDC_CONTRACT[ethChain];

const polygonChain = process.env.POLYGON_CHAIN || PolygonChain.MUMBAI;
const polygonChainId = CHAIN_IDS[polygonChain];
const polygonAssetId = CHAIN_TO_ASSET_ID[polygonChain];

const solanaChain = process.env.SOLANA_CHAIN || SolanaChain.DEVNET;

const vaultAccountId = process.env.VAULT_ACCOUNT_ID || "";

export default {
  sardinePrivateKey: process.env.SARDINE_PRIVATE || "",
  sardinePublicKey: process.env.SARDINE_PUBLIC || "",
  ethRPC: process.env.ROOT_RPC || "",
  maticRPC: process.env.MATIC_RPC || "",
  fireblocksApiSecret: process.env.FIREBLOCKS_API_SECRET_PATH || "",
  fireblocksApiKey: process.env.FIREBLOCKS_API_KEY || "",
  fireblocksSourceVaultAccount: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT || "",
  fireblocksBaseUrl: process.env.FIREBLOCKS_API_BASE_URL || "",
  ethChain: ethChain,
  ethChainId: ethChainId,
  ethAssetId: ethAssetId,
  ethUsdcAddress: ethUsdcAddress,
  polygonChain: polygonChain,
  polygonChainId: polygonChainId,
  polygonAssetId: polygonAssetId,
  solanaChain: solanaChain,
  vaultAccountId: vaultAccountId,

  port: parseInt(process.env.PORT || "8000", 10),
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/api',
  }
}