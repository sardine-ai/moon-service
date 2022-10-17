/* eslint-disable @typescript-eslint/no-explicit-any */

import { OpenSeaSDK } from 'opensea-js'

export interface IOpenSeaClient {
  openSea: OpenSeaSDK;
  ethChain: string;
  polygonChain: string;
}

export class OpenSeaClient implements IOpenSeaClient {
  openSea: OpenSeaSDK;
  ethChain: string;
  polygonChain: string;
  constructor(ethChain: string, polygonChain: string, openSea: OpenSeaSDK) {
    this.openSea = openSea;
    this.ethChain = ethChain;
    this.polygonChain = polygonChain;
  }

  async getOrder(nftId: number, assetContractAddress: string) {
    const order = await this.openSea.api.getOrder({
      side: "ask",
      tokenId: nftId.toString(), 
      assetContractAddress: assetContractAddress
    })
    return order;
  }

  async getFulfillOrderCallData(protocalData: any, accountAddress: string, recipientAddress: string) {
    const { actions } = await this.openSea.seaport.fulfillOrder({
      order: protocalData,
      accountAddress,
      recipientAddress,
    })
    const callData = await actions[0].transactionMethods.buildTransaction();
    return callData;
  }
}