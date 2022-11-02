/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionArguments } from "fireblocks-sdk";
import { EvmTransaction } from "../types/evm";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { FireblocksConfig } from "../config/fireblocks-config";
import { CryptoConfig } from "../config/crypto-config";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import { SignedTransaction } from "web3-core"
// import { getFireblocksAssetId } from "../utils/fireblocks-utils";
import winston from 'winston';

export interface ITransactionSubmissionClient {
  ethereumChain: string;
  polygonChain: string;

  sendEthTransaction(transaction: EvmTransaction): Promise<any>
  sendPolygonTransaction(transaction: EvmTransaction): Promise<any>
  getFromAddress(assetId: string): Promise<string> | string
}

// interface FireblocksVault {
//   Id: string,
//   assetId: string,
//   assetSymbol?: string,
//   vaultAddress: string,
// }

export class FireblocksClient implements ITransactionSubmissionClient {
  logger: winston.Logger
  fireblocks_dontCallDirectly: FireblocksSDK;
  ethereumChain: string;
  polygonChain: string;
  config: FireblocksConfig;
  cryptoConfig: CryptoConfig

  constructor(logger: winston.Logger, ethereumChain: string, polygonChain: string, config: FireblocksConfig, cryptoConfig: CryptoConfig) {
    this.logger = logger;
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
    this.config = config;
    this.cryptoConfig = cryptoConfig;
  }

  async getOrSetFireblocksSdk(): Promise<FireblocksSDK> {
    if (this.fireblocks_dontCallDirectly) {
      return this.fireblocks_dontCallDirectly
    }
    const fireblocksApiSecret = await this.config.getFireblocksApiSecret();
    this.fireblocks_dontCallDirectly = new FireblocksSDK(fireblocksApiSecret, this.config.fireblocksApiKey);
    return this.fireblocks_dontCallDirectly;
  }

  getTransactionArguments(transaction: EvmTransaction, assetId: string, vaultAccountId: string): TransactionArguments {
    const txArguments: TransactionArguments = {
      operation: TransactionOperation.CONTRACT_CALL,
      assetId: assetId,
      source: {
          type: PeerType.VAULT_ACCOUNT,
          id: vaultAccountId
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
    return txArguments
  }

  async sendTransaction(transaction: EvmTransaction, assetId: string, vaultAccountId: string): Promise<any> {
    const txArguments = this.getTransactionArguments(transaction, assetId, vaultAccountId)
    const fireblocks = await this.getOrSetFireblocksSdk();
    console.log(fireblocks);
    console.log(txArguments);
    return fireblocks.createTransaction(txArguments);
  }

  async sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(transaction, this.cryptoConfig.ethAssetId, "");
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(transaction, this.cryptoConfig.polygonAssetId, "");
  }

  async getVaultAccountId(assetId: string, assetSymbol: string): Promise<string> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const potentialVaults = await fireblocks.getVaultAccountsWithPageInfo({assetId: "WETH_POLYGON_TEST"});
    console.log(potentialVaults);
    console.log(JSON.stringify(potentialVaults));
    return this.config.vaultAccountId;
  }

  async getFromAddress(assetId: string): Promise<string> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const vaultAccountId = await this.getVaultAccountId(assetId, "");
    const depositAddresses = await fireblocks.getDepositAddresses(vaultAccountId, assetId);
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

  async signTransaction(alchemyWeb3: AlchemyWeb3, transaction: EvmTransaction, nonce: number): Promise<SignedTransaction> {
    this.logger.info("Signing Transaction")
    const signedTransaction = await alchemyWeb3.eth.accounts.signTransaction({
      from: transaction.from,
      to: transaction.to,
      value: transaction?.value || 0,
      gas: transaction?.gas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
      data: transaction.data,
      nonce: nonce,
      chainId: transaction.chainId,
    }, this.cryptoConfig.sardinePrivateKey);
    return signedTransaction;
  }

  async sendSignedTransaction(alchemyWeb3: AlchemyWeb3, signedTransaction: SignedTransaction): Promise<any> {
    this.logger.info("Sending Signed Transaction")
    const result = await alchemyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction!, (err, hash) => {
      if (err === null) {
        this.logger.info("Hash: ", hash)
      } else {
        this.logger.error("Something went wrong when submitting your transaction:", err)
      }
    });
    return result;
  }

  async sendTransaction(alchemyWeb3: AlchemyWeb3, transaction: EvmTransaction, fromAddress: string): Promise<any> {
    const nonce = await alchemyWeb3.eth.getTransactionCount(fromAddress, 'latest');
    const signedTransaction = await this.signTransaction(alchemyWeb3, transaction, nonce);
    return this.sendSignedTransaction(alchemyWeb3, signedTransaction);
  }

  async sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    const fromAddress = this.getFromAddress(this.cryptoConfig.ethAssetId)
    return await this.sendTransaction(this.ethWeb3, transaction, fromAddress);
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    const fromAddress = this.getFromAddress(this.cryptoConfig.polygonAssetId)
    return await this.sendTransaction(this.polygonWeb3, transaction, fromAddress);
  }

  getFromAddress(_assetId: string): string {
    return this.cryptoConfig.sardinePublicKey;
  }
}

export class TestTransactionSubmissionClient implements ITransactionSubmissionClient {
  ethereumChain: string;
  polygonChain: string;

  constructor(ethereumChain: string, polygonChain: string) {
    this.ethereumChain = ethereumChain;
    this.polygonChain = polygonChain;
  }

  sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    throw new Error("Method not implemented.");
  }
  sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getFromAddress(assetId: string): string | Promise<string> {
    throw new Error("Method not implemented.");
  }
}