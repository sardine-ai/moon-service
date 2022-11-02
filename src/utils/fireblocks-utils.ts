import { Erc20Token } from "src/types/evm"

interface AssetToFireblocksAssetId {
  [key: string]: {
    [key: string]: string
  }
}

interface GetFireblocksAssetIdParams {
  assetId: string,
  assetSymbol?: string
}

const ASSET_TO_FIREBLOCKS_ASSET_ID: AssetToFireblocksAssetId = {
  "goerli": {
    "NATIVE": "",
    "USDC": "",
    "WETH": "",
  },
  "mainnet": {
    "NATIVE": "",
    "USDC": "",
    "WETH": "",
  },
  "polygon_test": {
    "NATIVE": "MATIC_TEST",
    "USDC": "USDC_POLYGON_TEST_2",
    "WETH": "WETH_POLYGON_TEST",
  },
  "polygon": {
    "NATIVE": "MATIC",
    "USDC": "",
    "WETH": "WETH_POLYGON",
  }
}

export const getFireblocksAssetId = ({assetId, assetSymbol}: GetFireblocksAssetIdParams): string => {
  return ASSET_TO_FIREBLOCKS_ASSET_ID[assetId][assetSymbol || "NATIVE"]
}