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
import { Bundle, Transaction, TransactionState } from "../types/models";
import { UpdateTransaction } from "../repositories/base-repository";

export interface ITransactionSubmissionClient {
  sendTransaction(transaction: Transaction): Promise<any>
  getFromAddress(chain: string, assetSymbol: string): Promise<string> | string
}

interface EstimateGasParams {
  to: string,
  data: string,
  valueInEther: number
}

abstract class TransactionSubmissionClient implements ITransactionSubmissionClient {
  cryptoConfig: CryptoConfig;
  ethWeb3: AlchemyWeb3;
  polygonWeb3: AlchemyWeb3;

  constructor(cryptoConfig: CryptoConfig) {
    this.cryptoConfig = cryptoConfig;
    this.ethWeb3 = createAlchemyWeb3(cryptoConfig.ethRPC);
    this.polygonWeb3 = createAlchemyWeb3(cryptoConfig.maticRPC);
  }
  
  sendTransaction(_transaction: Transaction): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getFromAddress(_chain: string, _assetSymbol: string): string | Promise<string> {
    throw new Error("Method not implemented.");
  }

  getChainAlchemy(chain: string): AlchemyWeb3  {
    switch (chain) {
      case this.cryptoConfig.ethChain:
        return this.ethWeb3;
      case this.cryptoConfig.polygonChain:
        return this.polygonWeb3;
      default:
        throw new Error("Unsupported Chain");
    }
  }

  async estimateGasFees(chain: string, {to, data, valueInEther}: EstimateGasParams): Promise<number> {
    const alchemy = this.getChainAlchemy(chain);
    const estimate = alchemy.eth.estimateGas({
      to: to,
      // `function deposit() payable`
      data: data,
      // 1 ether
      value: valueInEther,
    })
    return estimate;
  }
}

interface FireblocksVaultAccount {
  id: string,
  assetId: string
}

export class FireblocksClient extends TransactionSubmissionClient {
  logger: winston.Logger
  fireblocks_dontCallDirectly: FireblocksSDK;
  config: FireblocksConfig;

  constructor(logger: winston.Logger, config: FireblocksConfig, cryptoConfig: CryptoConfig) {
    super(cryptoConfig);
    this.logger = logger;
    this.config = config;
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
      note: transaction.txNote || ''
    }
    if (transaction.data) {
      txArguments.extraParameters = {
        contractCallData: transaction.data
      }
    }
    if (transaction.value) {
      txArguments.amount = formatEther(transaction.value)
    }
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

  async sendTransaction(transaction: Transaction): Promise<any> {
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
}

export class SelfCustodyClient extends TransactionSubmissionClient {
  logger: winston.Logger;

  constructor(logger: winston.Logger, cryptoConfig: CryptoConfig) {
    super(cryptoConfig);
    this.logger = logger;
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

  async sendTransaction(transaction: Transaction): Promise<any> {
    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const fromAddress =  this.getFromAddress(transaction.chain, transaction.assetSymbol);
    const nonce = await alchemyWeb3.eth.getTransactionCount(fromAddress, 'latest');
    const signedTransaction = await this.signTransaction(alchemyWeb3, transaction, nonce);
    return this.sendSignedTransaction(alchemyWeb3, signedTransaction);
  }

  getFromAddress(_chain: string, _assetSymbol: string): string {
    return this.cryptoConfig.sardinePublicKey;
  }
}

export class TestTransactionSubmissionClient implements ITransactionSubmissionClient {
  logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  async sendTransaction(_transaction: EvmTransaction): Promise<any> {
    this.logger.info("Sending Transaction... JK");
    return
  }

  async getFakePromise(): Promise<any> {
    return new Promise<number>((resolve) => {
      resolve(-1);
  });
  }

  getFromAddress(_chain: string, _assetSymbol: string): string | Promise<string> {
    const fakeAddress = "0x123456";
    this.logger.info("Fake from address", fakeAddress);
    return fakeAddress;
  }
}

export type ExecuteBundle = (bundle: Bundle) => Promise<void>

export const executeBundleUninjected = (
  transactionSubmissionClient: ITransactionSubmissionClient,
  updateTransaction: UpdateTransaction
) => async (bundle: Bundle) => {
  let transaction = getReadyTransaction(bundle.transactions);
  if (transaction) {
    const result = transactionSubmissionClient.sendTransaction(transaction);
    transaction = updateTransactionWithResult(transaction, result);
    updateTransaction(transaction);
  }
}

const getReadyTransaction = (transactions: Array<Transaction>): Transaction | undefined => {
  const transaction = transactions.find(isTransactionReady);
  return transaction;
}

const isTransactionReady = (transaction: Transaction) => {
  return transaction.state == TransactionState.CREATED;
}

const updateTransactionWithResult = (transaction: Transaction, result: any): Transaction => {
  const newTransaction = Object.assign({}, transaction);
  newTransaction.executionId = result.id;
  newTransaction.state = TransactionState.SUBMITTED;
  return newTransaction
}