/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { v4 as uuidV4 } from 'uuid';
import { OpenSeaSDK } from 'opensea-js';
import { BuyNftParams } from '../types/requests/nft';
import { CryptoConfig } from '../config/crypto-config';
import { Operation, Transaction, TransactionState } from '../types/models';
import { NftNotFoundError } from '../types/errors';
import { PopulatedTransaction } from 'ethers';
import { getAssetDetails, getNativeToken } from '../utils/crypto-utils';

export interface IOpenSeaClient {
  ethOpenSea: OpenSeaSDK;
  buildTransaction(params: BuyNftParams): Promise<Transaction>;
}

export class OpenSeaClient implements IOpenSeaClient {
  cryptoConfig: CryptoConfig;
  ethOpenSea: OpenSeaSDK;

  constructor(cryptoConfig: CryptoConfig, ethOpenSea: OpenSeaSDK) {
    this.cryptoConfig = cryptoConfig;
    this.ethOpenSea = ethOpenSea;
  }

  async getOrder(nftId: string, assetContractAddress: string) {
    try {
      const order = await this.ethOpenSea.api.getOrder({
        side: 'ask',
        tokenId: nftId.toString(),
        assetContractAddress: assetContractAddress
      });
      return order;
    } catch (error) {
      throw NftNotFoundError(error);
    }
  }

  async getFulfillOrderCallData(
    protocalData: any,
    accountAddress: string,
    recipientAddress: string
  ): Promise<PopulatedTransaction> {
    try {
      const { actions } = await this.ethOpenSea.seaport.fulfillOrder({
        order: protocalData,
        accountAddress,
        recipientAddress
      });
      const callData = await actions[0].transactionMethods.buildTransaction();
      return callData;
    } catch (error) {
      throw NftNotFoundError(error);
    }
  }

  async buildTransaction(buyNftParams: BuyNftParams): Promise<Transaction> {
    const order = await this.getOrder(
      buyNftParams.nftId,
      buyNftParams.contractAddress
    );
    const callData = await this.getFulfillOrderCallData(
      order.protocolData,
      this.cryptoConfig.sardinePublicKey,
      buyNftParams.recipientAddress
    );
    return {
      id: uuidV4(),
      order: -1,
      assetCosts: [
        {
          assetSymbol: getNativeToken(buyNftParams.chain),
          amount: callData.value?.toString() ?? '0',
          decimals: getAssetDetails(
            buyNftParams.chain,
            getNativeToken(buyNftParams.chain)
          ).decimals
        }
      ],
      state: TransactionState.CREATED,
      to: callData.to!,
      value: callData.value?.toString(),
      callData: callData.data,
      chain: buyNftParams.chain,
      operation: Operation.BUY_NFT
    };
  }
}

export class TestOpenSeaClient implements IOpenSeaClient {
  ethOpenSea: OpenSeaSDK;

  async buildTransaction(buyNftParams: BuyNftParams): Promise<Transaction> {
    return {
      id: '0',
      order: -1,
      assetCosts: [
        {
          assetSymbol: 'ETH',
          amount: '1',
          decimals: 18
        }
      ],
      state: TransactionState.CREATED,
      to: buyNftParams.contractAddress,
      value: '1',
      callData: '0xcallData',
      chain: buyNftParams.chain,
      operation: Operation.BUY_NFT
    };
  }
}
