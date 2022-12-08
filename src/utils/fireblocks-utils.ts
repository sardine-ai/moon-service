// interface AssetToFireblocksAssetId {
//   [key: string]: {
//     [key: string]: string
//   }
// }

// interface GetFireblocksAssetIdParams {
//   chain: string,
//   assetSymbol?: string
// }

// const ASSET_TO_FIREBLOCKS_ASSET_ID: AssetToFireblocksAssetId = {
//   "goerli": {
//     "goerli": "ETH_TEST3",
//     "NATIVE": "ETH_TEST3",
//     "USDC": "",
//     "WETH": "",
//   },
//   "mainnet": {
//     "NATIVE": "",
//     "USDC": "",
//     "WETH": "",
//   },
//   "polygon_test": {
//     "polygon_test": "MATIC_POLYGON_MUMBAI",
//     "NATIVE": "MATIC_POLYGON_MUMBAI",
//     "USDC": "USDC_POLYGON_TEST_2",
//     "WETH": "WETH_POLYGON_TEST",
//   },
//   "polygon": {
//     "polygon": "polygon",
//     "NATIVE": "MATIC",
//     "USDC": "",
//     "WETH": "WETH_POLYGON",
//   }
// }

// export const getFireblocksAssetId = ({chain, assetSymbol}: GetFireblocksAssetIdParams): string => {
//   const assetId = ASSET_TO_FIREBLOCKS_ASSET_ID[chain][assetSymbol || "NATIVE"]
//   if (assetId) {
//     return assetId
//   }
//   throw new Error(`No Fireblocks Asset Id for Chain: ${chain} and Assey Symbol ${assetSymbol}`);
// }