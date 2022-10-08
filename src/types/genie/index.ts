export interface BuyGenieNFTParams {
  assetId: string,
  nftId: string,
  collectionName: string,
  marketplace: string,
  contractAddress: string,
  recepientAddress: string
}

export interface GenieCallDataResponse {
  valueToSend: string,
  route: [
    {
      action: string,
      marketplace: string,
      amountIn: string,
      assetIn: {
        basePrice: string,
        baseAsset: string,
        ETHPrice: string
      },
      amountOut: string,
      assetOut: {
        address: string,
        amount: string,
        collectionName: string,
        id: string,
        marketplace: string,
        name: string,
        symbol: string,
        tokenId: string,
        tokenType: string,
        priceInfo: {
          basePrice: string,
          baseAsset: string,
          ETHPrice: string
        },
        orderSource: string,
        wyvernOrSeaport: string
      }
    }
  ],
  data: string,
  to: string,
  containsSeaport: true
}