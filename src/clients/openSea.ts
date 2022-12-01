/* eslint-disable @typescript-eslint/no-explicit-any */

import { v4 as uuidV4 } from "uuid";
import { OpenSeaSDK } from 'opensea-js'
import { BuyNftParams } from '../types/nft';
import winston from 'winston';
import { CryptoConfig } from '../config/crypto-config';
import { Operation, Transaction, TransactionState } from "../types/models";

export interface IOpenSeaClient {
  ethOpenSea: OpenSeaSDK;
}

export class OpenSeaClient implements IOpenSeaClient {
  logger: winston.Logger;
  cryptoConfig: CryptoConfig;
  ethOpenSea: OpenSeaSDK;
  
  constructor(logger: winston.Logger, cryptoConfig: CryptoConfig, ethOpenSea: OpenSeaSDK) {
    this.logger = logger;
    this.cryptoConfig = cryptoConfig;
    this.ethOpenSea = ethOpenSea;
  }

  async getOrder(nftId: string, assetContractAddress: string) {
    console.log("getting order");
    const order = await this.ethOpenSea.api.getOrder({
      side: "ask",
      tokenId: nftId.toString(), 
      assetContractAddress: assetContractAddress
    })
    return order;
  }

  async getFulfillOrderCallData(protocalData: any, accountAddress: string, recipientAddress: string) {
    const { actions } = await this.ethOpenSea.seaport.fulfillOrder({
      order: protocalData,
      accountAddress,
      recipientAddress,
    })
    const callData = await actions[0].transactionMethods.buildTransaction();
    return callData;
  }

  async buildTransaction(buyNftParams: BuyNftParams): Promise<Transaction> {
    const order = await this.getOrder(buyNftParams.nftId, buyNftParams.contractAddress);
    console.log("order", order);
    const callData = await this.getFulfillOrderCallData(
      order.protocolData, 
      this.cryptoConfig.sardinePublicKey, 
      buyNftParams.recipientAddress
    );
    return {
      id: uuidV4(),
      isStarting: false,
      state: TransactionState.CREATED,
      to: callData.to!,
      value: callData.value?.toString(),
      callData: callData.data,
      chain: buyNftParams.chain,
      assetSymbol: buyNftParams.chain,
      operation: Operation.BUY_NFT
    }
  }
}