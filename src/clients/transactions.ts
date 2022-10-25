/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionArguments } from "fireblocks-sdk";
import { EvmTransaction } from "../types/evm";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { FireblocksConfig } from "../config/fireblocksConfig";
import { CryptoConfig } from "../config/cryptoConfig";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import winston from 'winston';

export interface ITransactionSubmissionClient {
  logger: winston.Logger
  ethereumChain: string;
  polygonChain: string;

  sendTransaction(assetId: string, transaction: EvmTransaction): Promise<any>
  sendEthTransaction(transaction: EvmTransaction): Promise<any>
  sendPolygonTransaction(transaction: EvmTransaction): Promise<any>
  getFromAddress(assetId: string): Promise<string> | string
  getNonce(accountAddress: string): Promise<number>
}

export class FireblocksClient implements ITransactionSubmissionClient {
  logger: winston.Logger
  fireblocks: FireblocksSDK;
  ethereumChain: string;
  polygonChain: string;
  config: FireblocksConfig;

  constructor(logger: winston.Logger, ethereumChain: string, polygonChain: string, config: FireblocksConfig) {
    this.logger = logger;
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
        gasLimit: transaction?.maxFeePerGas,
        destination: {
            type: PeerType.ONE_TIME_ADDRESS,
            id: "",
            oneTimeAddress: {
                address: <string>transaction.to
            }
        },
        note: transaction.txNote || '',
        amount: formatEther(transaction?.value || 0),
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
  logger: winston.Logger
  ethereumChain: string;
  polygonChain: string;
  cryptoConfig: CryptoConfig;
  ethWeb3: AlchemyWeb3;
  polygonWeb3: AlchemyWeb3;

  constructor(logger: winston.Logger, ethereumChain: string, polygonChain: string, cryptoConfig: CryptoConfig) {
    this.logger = logger;
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
    this.cryptoConfig = cryptoConfig;
    this.ethWeb3 = createAlchemyWeb3(cryptoConfig.ethRPC);
    this.polygonWeb3 = createAlchemyWeb3(cryptoConfig.maticRPC);
  }

  async sendTransaction(_assetId: string, transaction: EvmTransaction): Promise<any> {
    this.logger.info("Signing Transaction")
    const signedTransaction = await this.polygonWeb3.eth.accounts.signTransaction({
      from: transaction.from,
      to: transaction.to,
      value: transaction?.value || 0,
      gas: transaction?.gas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
      data: transaction.data,
      nonce: transaction.nonce,
      chainId: await this.polygonWeb3.eth.getChainId(),
    }, this.cryptoConfig.sardinePrivateKey);

    const result = await this.polygonWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction!, (err, hash) => {
      if (err === null) {
        console.log("Hash: ", hash)
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
    const nonce = await this.polygonWeb3.eth.getTransactionCount(address, 'latest');
    return nonce
  }

  getFromAddress(_assetId: string): string {
    return this.cryptoConfig.sardinePublicKey;
  }
}