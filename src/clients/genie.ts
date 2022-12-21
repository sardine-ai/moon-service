// Client built for the following api: https://v2.api.genie.xyz/docs/#/Assets/get_walletAssets
import axios from 'axios';
import winston from 'winston';
import { BuyGenieNFTParams, GenieCallDataResponse } from '../types/genie';

const BASE_URL = 'https://v2.api.genie.xyz/';

export interface IGenieClient {
  getCallData(
    buyGenieNFTParams: BuyGenieNFTParams
  ): Promise<GenieCallDataResponse>;
}

export class GenieClient implements IGenieClient {
  logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  async getCallData({
    assetId,
    nftId,
    collectionName,
    marketplace,
    contractAddress,
    recepientAddress
  }: BuyGenieNFTParams): Promise<GenieCallDataResponse> {
    const data = JSON.stringify({
      buy: [
        {
          address: contractAddress,
          amount: 1,
          collectionName: collectionName,
          id: `${contractAddress}-${nftId}`,
          marketplace: marketplace,
          name: `#${nftId}`,
          symbol: assetId,
          tokenId: nftId,
          tokenType: 'ERC721'
        }
      ],
      sender: recepientAddress
    });

    const config = {
      method: 'post',
      url: BASE_URL + 'route',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios(config);
    return response.data;
  }
}
