/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionArguments } from "fireblocks-sdk";
import { EvmTransaction } from "../types/evmTransaction";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { FireblocksConfig } from "../config/fireblocksConfig";
import { CryptoConfig } from "../config/cryptoConfig";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";

export interface ITransactionSubmissionClient {
  ethereumChain: string;
  polygonChain: string;

  sendTransaction(assetId: string, transaction: EvmTransaction): Promise<any>
  sendEthTransaction(transaction: EvmTransaction): Promise<any>
  sendPolygonTransaction(transaction: EvmTransaction): Promise<any>
  getFromAddress(assetId: string): Promise<string> | string
  getNonce(accountAddress: string): Promise<number>
}

export class FireblocksClient implements ITransactionSubmissionClient {
  fireblocks: FireblocksSDK;
  ethereumChain: string;
  polygonChain: string;
  config: FireblocksConfig;

  constructor(ethereumChain: string, polygonChain: string, config: FireblocksConfig) {
    this.fireblocks = new FireblocksSDK(config.fireblocksApiSecret, config.fireblocksApiKey, config.fireblocksBaseUrl);
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
    this.config = config;
  }
  getNonce(_accountAddress: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async sendTransaction(assetId: string, transaction: EvmTransaction): Promise<any> {
    const txArguments: TransactionArguments = {
        operation: TransactionOperation.CONTRACT_CALL,
        assetId: assetId,
        source: {
            type: PeerType.VAULT_ACCOUNT,
            id: this.getVaultAccountId()
        },
        gasPrice: transaction.gasPrice != undefined ? formatUnits(transaction.gasPrice.toString(), "gwei") : undefined,
        gasLimit: transaction.maxFeePerGas?.toString(),
        destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            id: "",
            oneTimeAddress: {
                address: <string>transaction.to
            }
        },
        note: transaction.txNote || '',
        amount: formatEther(transaction.value?.toString() || "0"),
        extraParameters: {
            contractCallData: transaction.data
        }
    };
    return this.fireblocks.createTransaction(txArguments);
  }

  async sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(this.ethereumChain, transaction);
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(this.polygonChain, transaction);
  }

  getVaultAccountId(): string {
    return this.config.vaultAccountId;
  }

  async getFromAddress(assetId: string): Promise<string> {
    const depositAddresses = await this.fireblocks.getDepositAddresses(this.getVaultAccountId(), assetId);
    return depositAddresses[0].address;
  }
}

export class SelfCustodyClient implements ITransactionSubmissionClient {
  ethereumChain: string;
  polygonChain: string;
  cryptoConfig: CryptoConfig;
  web3: AlchemyWeb3;

  constructor(ethereumChain: string, polygonChain: string, cryptoConfig: CryptoConfig) {
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
    this.cryptoConfig = cryptoConfig;
    this.web3 = createAlchemyWeb3(cryptoConfig.ethRPC);
  }

  async sendTransaction(_assetId: string, transaction: EvmTransaction): Promise<any> {
    console.log(transaction);
    const signedTransaction = await this.web3.eth.accounts.signTransaction({
      from: transaction.from,
      to: transaction.to,
      value: transaction.value?.toString(),
      gas: transaction.gas?.toString(),
      gasPrice: transaction.gasPrice?.toString(),
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
      maxFeePerGas: transaction.maxFeePerGas?.toString(),
      data: transaction.data,
      nonce: transaction.nonce,
      chainId: transaction.chainId,
    }, this.cryptoConfig.sardinePrivateKey);
    const result = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!, (err, hash) => {
      if (!err) {
        console.log(
          "The hash of the mint is: ",
          hash,
          "\nCheck Alchemy's Mempool to view the status of your transaction!"
        )
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
    return result;
  }

  async sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(this.ethereumChain, transaction);
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(this.polygonChain, transaction);
  }

  async getNonce(address: string): Promise<number> {
    const nonce = await this.web3.eth.getTransactionCount(address, 'latest');
    return nonce
  }

  getFromAddress(_assetId: string): string {
    return this.cryptoConfig.sardinePublicKey;
  }
}