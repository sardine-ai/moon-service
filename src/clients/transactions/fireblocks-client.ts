/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  FireblocksSDK,
  PeerType,
  TransactionOperation,
  TransactionArguments,
  VaultAccountResponse
} from 'fireblocks-sdk';
import winston from 'winston';
import { TransactionSubmissionClient } from './base-transaction-client';
import { FireblocksConfig } from '../../config/fireblocks-config';
import { CryptoConfig } from '../../config/crypto-config';
import { EvmTransaction } from '../../types/evm';
import { getFireblocksAssetId } from '../../utils/fireblocks-utils';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { Transaction } from '../../types/models';
import { TransactionSubmittionError } from '../../types/errors';

interface FireblocksVaultAccount {
  id: string;
  assetId: string;
}

export class FireblocksClient extends TransactionSubmissionClient {
  logger: winston.Logger;
  fireblocks_dontCallDirectly: FireblocksSDK;
  config: FireblocksConfig;

  constructor(
    logger: winston.Logger,
    config: FireblocksConfig,
    cryptoConfig: CryptoConfig
  ) {
    super(cryptoConfig);
    this.logger = logger;
    this.config = config;
  }

  async getOrSetFireblocksSdk(): Promise<FireblocksSDK> {
    if (this.fireblocks_dontCallDirectly) {
      return this.fireblocks_dontCallDirectly;
    }
    const fireblocksApiSecret = await this.config.getFireblocksApiSecret();
    this.fireblocks_dontCallDirectly = new FireblocksSDK(
      fireblocksApiSecret,
      this.config.fireblocksApiKey
    );
    return this.fireblocks_dontCallDirectly;
  }

  getTransactionArguments(
    transaction: EvmTransaction,
    vaultAccount: FireblocksVaultAccount
  ): TransactionArguments {
    const txArguments: TransactionArguments = {
      operation: TransactionOperation.TRANSFER,
      assetId: getFireblocksAssetId({ chain: transaction.chain }),
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: vaultAccount.id
      },
      priorityFee: formatUnits(
        transaction?.maxPriorityFeePerGas || '0',
        'gwei'
      ),
      maxFee: formatUnits(transaction?.maxFeePerGas || '0', 'gwei'),
      gasLimit: transaction.gas,
      destination: {
        type: PeerType.ONE_TIME_ADDRESS,
        id: '',
        oneTimeAddress: {
          address: <string>transaction.to
        }
      },
      note: transaction.txNote || '',
      amount: formatEther(transaction?.value || '0')
    };

    if (transaction.data) {
      txArguments.extraParameters = {
        contractCallData: transaction.data
      };
      txArguments.operation = TransactionOperation.CONTRACT_CALL;
    }
    console.log('txArguments', txArguments);
    return txArguments;
  }

  // TODO: Implement logic to determine which vault to use, probably want to look at balances
  choseVaultAccount(
    potentialVaults: Array<VaultAccountResponse>
  ): VaultAccountResponse | undefined {
    return potentialVaults.find(v => v.name == 'Testing Vault');
  }

  async getVaultAccount(
    chain: string,
    assetSymbol: string
  ): Promise<FireblocksVaultAccount | undefined> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const fireblocksAssetId = getFireblocksAssetId({ chain, assetSymbol });
    const potentialVaults = await fireblocks.getVaultAccountsWithPageInfo({
      assetId: fireblocksAssetId
    });
    const vault = this.choseVaultAccount(potentialVaults.accounts);
    if (vault) {
      return {
        id: vault.id,
        assetId: fireblocksAssetId
      };
    }
    return undefined;
  }

  async getFromAddress(chain: string, assetSymbol: string): Promise<string> {
    const fireblocks = await this.getOrSetFireblocksSdk();
    const vaultAccount = await this.getVaultAccount(chain, assetSymbol);
    if (vaultAccount) {
      const depositAddresses = await fireblocks.getDepositAddresses(
        vaultAccount.id,
        vaultAccount.assetId
      );
      return depositAddresses[0].address;
    }
    this.logger.error('No address found');
    return '';
  }

  async sendTransaction(transaction: Transaction): Promise<any> {
    // TODO: if the address is passed in the transaction we will want to get the vault id associated with that address
    // need a getVaultFromAddress method
    const vaultAccount = await this.getVaultAccount(
      transaction.chain,
      transaction.chain
    );
    if (vaultAccount) {
      const evmTransaction = await this.convertTransactionToEvmTransaction(
        transaction
      );
      const txArguments = this.getTransactionArguments(
        evmTransaction,
        vaultAccount
      );
      this.logger.info(`Fireblocks Arguments: ${JSON.stringify(txArguments)}`);
      const fireblocks = await this.getOrSetFireblocksSdk();
      try {
        const response = await fireblocks.createTransaction(txArguments);
        return response;
      } catch (error) {
        new TransactionSubmittionError();
      }
    }
    this.logger.error('No vault acccount found');
    return;
  }
}
