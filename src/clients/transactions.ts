/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionArguments, VaultAccountResponse } from "fireblocks-sdk";
import { EvmTransaction } from "../types/evm";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { FireblocksConfig } from "../config/fireblocks-config";
import { CryptoConfig } from "../config/crypto-config";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import { SignedTransaction } from "web3-core"
import { getFireblocksAssetId } from "../utils/fireblocks-utils";
import winston from 'winston';

export interface ITransactionSubmissionClient {
  ethereumChain: string;
  polygonChain: string;

  sendEthTransaction(transaction: EvmTransaction): Promise<any>
  sendPolygonTransaction(transaction: EvmTransaction): Promise<any>
  getFromAddress(chain: string, assetSymbol: string): Promise<string> | string
}

interface FireblocksVaultAccount {
  id: string,
  assetId: string
}

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

  getTransactionArguments(transaction: EvmTransaction, vaultAccount: FireblocksVaultAccount): TransactionArguments {
    const txArguments: TransactionArguments = {
      operation: TransactionOperation.CONTRACT_CALL,
      assetId: vaultAccount.assetId,
      source: {
          type: PeerType.VAULT_ACCOUNT,
          id: vaultAccount.id
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

  // TODO: Implement logic to determine which vault to use, probably want to look at balances
  choseVaultAccount(potentialVaults: Array<VaultAccountResponse>): VaultAccountResponse {
    return potentialVaults[0];
  }

  async getVaultAccount(chain: string, assetSymbol: string): Promise<FireblocksVaultAccount | undefined> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const fireblocksAssetId = getFireblocksAssetId({chain, assetSymbol});
    const potentialVaults = await fireblocks.getVaultAccountsWithPageInfo({assetId: fireblocksAssetId});
    if (potentialVaults.accounts && potentialVaults.accounts.length > 0) {
      return {
        id: this.choseVaultAccount(potentialVaults.accounts).id,
        assetId: fireblocksAssetId
      };
    } 
    return undefined;
  }

  async getFromAddress(chain: string, assetSymbol: string): Promise<string> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const vaultAccount = await this.getVaultAccount(chain, assetSymbol);
    if (vaultAccount) {
      const fireblocksAssetId = getFireblocksAssetId({chain, assetSymbol});
      const depositAddresses = await fireblocks.getDepositAddresses(vaultAccount.id, fireblocksAssetId);
      return depositAddresses[0].address;
    }
    this.logger.error("No address found");
    return "";
  }

  async sendTransaction(transaction: EvmTransaction): Promise<any> {
    // TODO: if the address is passed in the transaction we will want to get the vault id associated with that address
    // need a getVaultFromAddress method
    const vaultAccount = await this.getVaultAccount(transaction.chain, transaction.assetSymbol);
    if (vaultAccount) {
      const txArguments = this.getTransactionArguments(transaction, vaultAccount);
      const fireblocks = await this.getOrSetFireblocksSdk();
      return fireblocks.createTransaction(txArguments);
    }
    this.logger.error("No vault acccount found");
    return;
  }

  async sendEthTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(transaction);
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    return this.sendTransaction(transaction);
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
    const fromAddress = this.getFromAddress(transaction.chain, transaction.assetSymbol)
    return await this.sendTransaction(this.ethWeb3, transaction, fromAddress);
  }

  async sendPolygonTransaction(transaction: EvmTransaction): Promise<any> {
    const fromAddress = this.getFromAddress(transaction.chain, transaction.assetSymbol)
    return await this.sendTransaction(this.polygonWeb3, transaction, fromAddress);
  }

  getFromAddress(_chain: string, _assetSymbol: string): string {
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
  getFromAddress(chain: string, assetSymbol: string): string | Promise<string> {
    throw new Error("Method not implemented.");
  }
}