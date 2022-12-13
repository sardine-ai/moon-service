/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FireblocksSDK, PeerType, TransactionOperation, TransactionArguments, VaultAccountResponse } from "fireblocks-sdk";
import { EvmTransaction, GasDetails } from "../../types/evm";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { FireblocksConfig } from "../../config/fireblocks-config";
import { CHAIN_TO_CHAIN_ID, CryptoConfig } from "../../config/crypto-config";
import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import { SignedTransaction } from "web3-core"
import { getFireblocksAssetId } from "../../utils/fireblocks-utils";
import winston from 'winston';
import { Transaction } from "../../types/models";
import { getGasDetails } from "./helpers";
import { QuoteTransactionReceiptResponse } from "../../types/models/receipt";

export interface ITransactionSubmissionClient {
  sendTransaction(transaction: Transaction): Promise<any>;
  getFromAddress(chain: string, assetSymbol: string): Promise<string> | string;
  quoteTransaction(transaction: Transaction): Promise<QuoteTransactionReceiptResponse>;
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

  async quoteTransaction(transaction: Transaction): Promise<QuoteTransactionReceiptResponse> {
    const cost = formatEther(transaction.value || "0");

    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const fromAddress =  await this.getFromAddress(transaction.chain, transaction.assetSymbol);
    const gasDetails = await getGasDetails(fromAddress, transaction, alchemyWeb3);
    const gasCost = formatEther(
      Number(gasDetails.gasLimit || 0) * (Number(gasDetails.maxPriorityFee) + Number(gasDetails.baseFeePerGas || 0))
    )
    return {
      totalCost: Number(cost) + Number(gasCost),
      cost: cost,
      gasCost: gasCost,
      currency: transaction.chain,
      operation: transaction.operation
    }
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
        throw new Error(`Unsupported Chain: ${chain}`);
    }
  }
  
  buildEvmTransaction(transaction: Transaction, fromAddress: string, nonce: number, gasDetails: GasDetails): EvmTransaction {
    return {
      from: fromAddress,
      to: transaction.to,
      gas: gasDetails.gasLimit,
      maxPriorityFeePerGas: gasDetails.maxPriorityFee,
      maxFeePerGas: (2 * Number(gasDetails?.baseFeePerGas || "0") + Number(gasDetails?.maxPriorityFee || "0")).toString(),
      data: transaction.callData,
      value: transaction.value,
      chainId: CHAIN_TO_CHAIN_ID[transaction.chain],
      chain: transaction.chain,
      assetSymbol: transaction.assetSymbol,
      nonce: nonce
    }
  }

  async convertTransactionToEvmTransaction(transaction: Transaction): Promise<EvmTransaction> {
    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const fromAddress =  await this.getFromAddress(transaction.chain, transaction.assetSymbol);
    const nonce = await alchemyWeb3.eth.getTransactionCount(fromAddress, 'latest');
    const gasDetails = await getGasDetails(fromAddress, transaction, alchemyWeb3);
    return this.buildEvmTransaction(transaction, fromAddress, nonce, gasDetails);
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
      operation: TransactionOperation.TRANSFER,
      assetId: getFireblocksAssetId({chain: transaction.chain}),
      source: {
          type: PeerType.VAULT_ACCOUNT,
          id: vaultAccount.id
      },
      priorityFee: formatUnits(transaction?.maxPriorityFeePerGas || "0", "gwei"),
      maxFee: formatUnits(transaction?.maxFeePerGas || "0", "gwei"),
      gasLimit: transaction.gas,
      destination: {
          type: PeerType.ONE_TIME_ADDRESS,
          id: "",
          oneTimeAddress: {
              address: <string>transaction.to
          }
      },
      note: transaction.txNote || '',
      amount: formatEther(transaction?.value || "0"),
    }
    if (transaction.data) {
      txArguments.extraParameters = {
        contractCallData: transaction.data
      }
      txArguments.operation = TransactionOperation.CONTRACT_CALL;
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
      const depositAddresses = await fireblocks.getDepositAddresses(vaultAccount.id, vaultAccount.assetId);
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
      const evmTransaction = await this.convertTransactionToEvmTransaction(transaction);
      const txArguments = this.getTransactionArguments(evmTransaction, vaultAccount);
      console.log(txArguments);
      const fireblocks = await this.getOrSetFireblocksSdk();
      try {
        const response = await fireblocks.createTransaction(txArguments);
        console.log("response", response)
        return response;
      } catch (error) {
        console.log("error", error)
      }
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

  async signTransaction(alchemyWeb3: AlchemyWeb3, transaction: EvmTransaction): Promise<SignedTransaction> {
    this.logger.info("Signing Transaction")
    const signedTransaction = await alchemyWeb3.eth.accounts.signTransaction({
      from: transaction.from,
      to: transaction.to,
      value: transaction?.value || 0,
      gas: transaction?.gas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
      data: transaction.data,
      nonce: transaction.nonce,
      chainId: transaction.chainId,
    }, this.cryptoConfig.sardinePrivateKey);
    return signedTransaction;
  }

  async sendSignedTransaction(alchemyWeb3: AlchemyWeb3, signedTransaction: SignedTransaction): Promise<any> {
    this.logger.info("Sending Signed Transaction")
    const result = await alchemyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction!, (err, hash) => {
      if (err === null) {
        this.logger.info(`Hash: ${hash}`)
      } else {
        this.logger.error(`Something went wrong when submitting your transaction: ${err}`)
      }
    });
    return result;
  }

  async sendTransaction(transaction: Transaction): Promise<any> {
    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const evmTransaction = await this.convertTransactionToEvmTransaction(transaction);
    console.log("Signing evm transaction", evmTransaction);
    const signedTransaction = await this.signTransaction(alchemyWeb3, evmTransaction);
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

  quoteTransaction(_transaction: Transaction): Promise<QuoteTransactionReceiptResponse> {
    throw new Error("Method not implemented.");
  }

  async sendTransaction(_transaction: Transaction): Promise<any> {
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
    this.logger.info(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }
}