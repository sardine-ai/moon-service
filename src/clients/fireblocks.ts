/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, CreateTransactionResponse, TransactionArguments } from "fireblocks-sdk";
import { EvmTransaction } from "../types/evmTransaction";
import { formatEther, formatUnits } from "ethers/lib/utils";
import config from '../config';

export interface IFireblocksClient {
  fireblocks: FireblocksSDK;
  ethereumChain: string;
  polygonChain: string;
  sendTransaction(assetId: string, vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse>
  sendEthTransaction(vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse>
  sendPolygonTransaction(vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse>
  getVaultAddress(vaultId: string, assetId: string): Promise<string>
}

export class FireblocksClient implements IFireblocksClient {
  fireblocks: FireblocksSDK;
  ethereumChain: string;
  polygonChain: string;

  constructor(ethereumChain: string, polygonChain: string) {
    this.fireblocks = new FireblocksSDK(config.fireblocksApiSecret, config.fireblocksApiKey, config.fireblocksBaseUrl);
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
  }

  async sendTransaction(assetId: string, vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse> {
    const txArguments: TransactionArguments = {
        operation: TransactionOperation.CONTRACT_CALL,
        assetId: assetId,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId
        },
        gasPrice: transaction.gasPrice != undefined ? formatUnits(transaction.gasPrice.toString(), "gwei") : undefined,
        gasLimit: transaction.gasLimit?.toString(),
        destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            id: "",
            oneTimeAddress: {
                address: <string>transaction.to
            }
        },
        note: transaction.txNote || '',
        amount: formatEther(transaction.amountEth?.toString() || "0"),
        extraParameters: {
            contractCallData: transaction.data
        }
    };
    return this.fireblocks.createTransaction(txArguments);
  }

  async sendEthTransaction(vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse> {
    return this.sendTransaction(this.ethereumChain, vaultAccountId, transaction);
  }

  async sendPolygonTransaction(vaultAccountId: string, transaction: EvmTransaction): Promise<CreateTransactionResponse> {
    return this.sendTransaction(this.polygonChain, vaultAccountId, transaction);
  }

  async getVaultAddress(vaultId: string, assetId: string): Promise<string> {
    const depositAddresses = await this.fireblocks.getDepositAddresses(vaultId, assetId);
    return depositAddresses[0].address;
  }
}