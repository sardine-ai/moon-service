import dotenv from 'dotenv';
import { Chain } from 'fireblocks-defi-sdk';

const envFound = dotenv.config();
if (envFound.error) {
  console.log(
    "⚠️  Couldn't find .env file  ⚠️ (Using pure environment variables instead)"
  );
}

const CHAIN_TO_ASSET_ID: { [key: string]: string } = {
  [Chain.MAINNET]: 'ETH',
  [Chain.ROPSTEN]: 'ETH_TEST',
  [Chain.GOERLI]: 'ETH_TEST3',
  [Chain.KOVAN]: 'ETH_TEST2',
  [Chain.BSC]: 'BNB_BSC',
  [Chain.BSC_TEST]: 'BNB_TEST',
  [Chain.POLYGON]: 'MATIC_POLYGON',
  [Chain.MUMBAI]: 'MATIC_POLYGON_MUMBAI'
};

export const CHAIN_TO_CHAIN_ID: { [key: string]: number } = {
  [Chain.MAINNET]: 1,
  [Chain.ROPSTEN]: 3,
  [Chain.GOERLI]: 5,
  [Chain.KOVAN]: 42,
  [Chain.BSC]: 56,
  [Chain.BSC_TEST]: 97,
  [Chain.POLYGON]: 137,
  [Chain.MUMBAI]: 80001
};

enum EthChain {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli'
}

enum PolygonChain {
  MUMBAI = 'mumbai',
  MAINNET = 'polygon'
}

enum SolanaChain {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet'
}

const CHAIN_TO_0X_ENDPOINT: { [key: string]: string } = {
  [Chain.MAINNET]: 'https://api.0x.org/',
  [Chain.GOERLI]: 'https://api.0x.org/',
  [Chain.POLYGON]: 'https://polygon.api.0x.org/',
  [Chain.MUMBAI]: 'https://mumbai.api.0x.org/'
};

export interface CryptoConfig {
  sardinePrivateKey: string;
  sardinePublicKey: string;
  ethRPC: string;
  maticRPC: string;
  ethChain: string;
  ethChainId: number;
  ethAssetId: string;
  polygonChain: string;
  polygonChainId: number;
  polygonAssetId: string;
  solanaChain: string;
  openSeaAPIKey: string;
  eth0xSwapEndpoint: string;
  polygon0xSwapEndpoint: string;
  stableCoin: string;
  zeroXApiKey: string;
}

const getCryptoConfig = (): CryptoConfig => {
  const ethChain = process.env.ETH_CHAIN || EthChain.GOERLI;
  const ethChainId = CHAIN_TO_CHAIN_ID[ethChain];
  const ethAssetId = CHAIN_TO_ASSET_ID[ethChain];

  const polygonChain = process.env.POLYGON_CHAIN || PolygonChain.MUMBAI;
  const polygonChainId = CHAIN_TO_CHAIN_ID[polygonChain];
  const polygonAssetId = CHAIN_TO_ASSET_ID[polygonChain];

  const solanaChain = process.env.SOLANA_CHAIN || SolanaChain.DEVNET;
  const openSeaAPIKey = process.env.OPEN_SEA_API_KEY || '';

  const stableCoin = process.env.STABLE_COIN || 'WETH';

  return {
    sardinePrivateKey: process.env.SARDINE_PRIVATE || '',
    sardinePublicKey: process.env.SARDINE_PUBLIC || '',
    ethRPC: process.env.ROOT_RPC || '',
    maticRPC: process.env.MATIC_RPC || '',
    ethChain: ethChain,
    ethChainId: ethChainId,
    ethAssetId: ethAssetId,
    polygonChain: polygonChain,
    polygonChainId: polygonChainId,
    polygonAssetId: polygonAssetId,
    solanaChain: solanaChain,
    openSeaAPIKey: openSeaAPIKey,
    eth0xSwapEndpoint: CHAIN_TO_0X_ENDPOINT[ethChain],
    polygon0xSwapEndpoint: CHAIN_TO_0X_ENDPOINT[polygonChain],
    stableCoin: stableCoin,
    zeroXApiKey: process.env.ZERO_X_API_KEY || ''
  };
};

export default getCryptoConfig;
