/* eslint-disable @typescript-eslint/no-explicit-any */

import { OpenSeaSDK } from 'opensea-js'
import winston from 'winston';

export interface IOpenSeaClient {
  openSea: OpenSeaSDK;
  ethChain: string;
  polygonChain: string;
}

export class OpenSeaClient implements IOpenSeaClient {
  logger: winston.Logger;
  openSea: OpenSeaSDK;
  ethChain: string;
  polygonChain: string;
  constructor(logger: winston.Logger, ethChain: string, polygonChain: string, openSea: OpenSeaSDK) {
    this.logger = logger;
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