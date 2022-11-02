interface AssetToFireblocksAssetId {
  [key: string]: {
    [key: string]: string
  }
}

interface GetFireblocksAssetIdParams {
  chain: string,
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
    "NATIVE": "MATIC_POLYGON_MUMBAI",
    "USDC": "USDC_POLYGON_TEST_2",
    "WETH": "WETH_POLYGON_TEST",
  },
  "polygon": {
    "NATIVE": "MATIC",
    "USDC": "",
    "WETH": "WETH_POLYGON",
  }
}

export const getFireblocksAssetId = ({chain, assetSymbol}: GetFireblocksAssetIdParams): string => {
  return ASSET_TO_FIREBLOCKS_ASSET_ID[chain][assetSymbol || "NATIVE"]
}