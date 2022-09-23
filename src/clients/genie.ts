// Client built for the following api: https://v2.api.genie.xyz/docs/#/Assets/get_walletAssets
var axios = require('axios');

const BASE_URL = "https://v2.api.genie.xyz/";

export interface IGenieClient {
  getCallData(buyGenieNFTParams: BuyGenieNFTParams): Promise<GenieCallDataResponse>
}

export class GenieClient implements IGenieClient {
  async getCallData({ assetId, nftId, collectionName, marketplace, contractAddress, recepientAddress }: BuyGenieNFTParams): Promise<GenieCallDataResponse> {
    var data = JSON.stringify({
      "buy": [
        {
            "address": contractAddress,
            "amount": 1,
            "collectionName": collectionName,
            "id": `${contractAddress}-${assetId}`,
            "marketplace": marketplace,
            "name": `#${nftId}`,
            "symbol": assetId,
            "tokenId": nftId,
            "tokenType": "ERC721"
        }
      ],
      "sender": recepientAddress
    });
    
    var config = {
      method: 'post',
      url: BASE_URL + 'route',
      headers: { 
        'accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    let response = await axios(config);
    return response;
  }
}

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
