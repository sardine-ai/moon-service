interface AssetToFireblocksAssetId {
  [key: string]: {
    [key: string]: string
  }
}

interface GetFireblocksAssetIdParams {
  chain: string,
  assetSymbol: string
}

const ASSET_TO_FIREBLOCKS_ASSET_ID: AssetToFireblocksAssetId = {
  "goerli": {
    "ETH": "",
    "USDC": "",
    "WETH": "",
  },
  "mainnet": {
    "ETH": "",
    "USDC": "",
    "WETH": "",
  },
  "polygon_test": {
    "MATIC": "MATIC_POLYGON_MUMBAI",
    "USDC": "USDC_POLYGON_TEST_2",
    "WETH": "WETH_POLYGON_TEST",
  },
  "polygon": {
    "MATIC": "MATIC",
    "USDC": "",
    "WETH": "WETH_POLYGON",
  }
}

export const getFireblocksAssetId = ({chain, assetSymbol}: GetFireblocksAssetIdParams): string => {
  return ASSET_TO_FIREBLOCKS_ASSET_ID[chain][assetSymbol]
}