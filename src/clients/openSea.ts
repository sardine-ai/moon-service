import { OpenSeaSDK } from 'opensea-js'
import { Seaport } from "@opensea/seaport-js";

export interface IOpenSeaClient {
  openSea: OpenSeaSDK;
  ethereumChain: string;
  polygonChain: string;
}

export class OpenSeaClient implements IOpenSeaClient {
  openSea: OpenSeaSDK;
  ethereumChain: string;
  polygonChain: string;
  constructor(ethereumChain: string, polygonChain: string, openSea: OpenSeaSDK) {
    this.openSea = openSea;
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
  }

  async getOrder(nftId: number, assetContractAddress: string, paymentTokenAddress: string) {
    const order = await this.openSea.api.getOrder({
      side: "ask",
      assetContractAddress: assetContractAddress,
      paymentTokenAddress: paymentTokenAddress
    })
    return order;
  }

  async getNFTCallData(nftId: number, assetContractAddress: string, paymentTokenAddress: string, accountAddress: string, recipientAddress: string) {
    const order = await this.getOrder(nftId, assetContractAddress, paymentTokenAddress);
    const { actions } = await this.openSea.seaport.fulfillOrder({
      order: order.protocolData,
      accountAddress,
      recipientAddress,
    })
    let callData = await actions[0].transactionMethods.buildTransaction();
    return callData;
  }
}