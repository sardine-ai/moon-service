/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { EvmTransaction } from '../../types/evm';
import { CryptoConfig } from '../../config/crypto-config';
import { AlchemyWeb3 } from '@alch/alchemy-web3';
import { SignedTransaction } from 'web3-core';
import { Transaction } from '../../types/models';
import { TransactionSubmissionClient } from './base-transaction-client';
import { TransactionSubmittionError } from '../../types/errors';
import { getChainAlchemy } from './helpers';
import { GetGasDetails } from './gas';
import logger from '../../loaders/logger';

export class SelfCustodyClient extends TransactionSubmissionClient {
  constructor(
    cryptoConfig: CryptoConfig,
    getGasDetails: GetGasDetails
  ) {
    super(cryptoConfig, getGasDetails);
  }

  async signTransaction(
    alchemyWeb3: AlchemyWeb3,
    transaction: EvmTransaction
  ): Promise<SignedTransaction> {
    const signedTransaction = await alchemyWeb3.eth.accounts.signTransaction(
      {
        from: transaction.from,
        to: transaction.to,
        value: transaction?.value || 0,
        gas: transaction.gas,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
        data: transaction.data,
        nonce: transaction.nonce,
        chainId: transaction.chainId
      },
      this.cryptoConfig.sardinePrivateKey
    );
    return signedTransaction;
  }

  async sendSignedTransaction(
    alchemyWeb3: AlchemyWeb3,
    signedTransaction: SignedTransaction
  ): Promise<any> {
    const result = await alchemyWeb3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction!,
      (err, hash) => {
        if (err === null) {
          logger.info(`Transacion Hash: ${hash}`);
        } else {
          throw TransactionSubmittionError(err);
        }
      }
    );
    return result;
  }

  async sendTransaction(transaction: Transaction): Promise<any> {
    const alchemyWeb3 = getChainAlchemy(transaction.chain, this.cryptoConfig);
    const evmTransaction = await this.convertTransactionToEvmTransaction(
      transaction
    );
    const signedTransaction = await this.signTransaction(
      alchemyWeb3,
      evmTransaction
    );
    return this.sendSignedTransaction(alchemyWeb3, signedTransaction);
  }

  async getFromAddress(_chain: string): Promise<string> {
    return this.cryptoConfig.sardinePublicKey;
  }
}
