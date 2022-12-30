/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CryptoConfig } from '../../config/crypto-config';
import { Transaction } from '../../types/models';
import { TransactionSubmissionClient } from './base-transaction-client';
import { GetGasDetails } from './gas';
import logger from '../../loaders/logger';
import { EvmTransaction } from '../../types/evm';

export class TestTransactionSubmissionClient
  extends TransactionSubmissionClient
{
  constructor(cryptoConfig: CryptoConfig, getGasDetails: GetGasDetails) {
    super(cryptoConfig, getGasDetails);
  }

  async sendTransaction(_transaction: Transaction): Promise<any> {
    logger.info('Sending Transaction... JK');
    return;
  }

  async getFromAddress(_chain: string): Promise<string> {
    const fakeAddress = '0x123456';
    logger.info(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }

  async convertTransactionToEvmTransaction(
    transaction: Transaction
  ): Promise<EvmTransaction> {
    const fromAddress = await this.getFromAddress(transaction.chain);
    const nonce = 0
    const gasDetails = await this.getGasDetails(
      fromAddress,
      transaction,
      this.cryptoConfig
    );
    return this.buildEvmTransaction(
      transaction,
      fromAddress,
      nonce,
      gasDetails
    );
  }
}
