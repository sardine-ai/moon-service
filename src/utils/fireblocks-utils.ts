interface AssetToFireblocksAssetId {
  [key: string]: string
}

const ASSET_TO_FIREBLOCKS_ASSET_ID: AssetToFireblocksAssetId = {
  "goerli": "",
  "mainnet": "ETH",
  "polygon_test": "MATIC_POLYGON_MUMBAI",
  "polygon": "MATIC_POLYGON"
}

export const getFireblocksAssetId = (chain: string): string => {
  return ASSET_TO_FIREBLOCKS_ASSET_ID[chain]
}