/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CryptoConfig } from 'src/config/crypto-config';
import winston from 'winston';
import { Transaction } from '../../types/models';
import { ITransactionSubmissionClient } from './base-transaction-client';
import { GetGasDetails } from './gas';

export class TestTransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  logger: winston.Logger;
  cryptoConfig: CryptoConfig;
  getGasDetails: GetGasDetails;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  async sendTransaction(_transaction: Transaction): Promise<any> {
    this.logger.info('Sending Transaction... JK');
    return;
  }

  async getFromAddress(
    _chain: string,
  ): Promise<string> {
    const fakeAddress = '0x123456';
    this.logger.info(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }
}
