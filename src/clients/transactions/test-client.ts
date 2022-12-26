/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import winston from 'winston';
import { Transaction } from '../../types/models';
import { TransactionReceipt } from '../../types/models/receipt';
import { ITransactionSubmissionClient } from './base-transaction-client';

export class TestTransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  quoteTransaction(_transaction: Transaction): Promise<TransactionReceipt> {
    throw new Error('Method not implemented.');
  }

  async sendTransaction(_transaction: Transaction): Promise<any> {
    this.logger.info('Sending Transaction... JK');
    return;
  }

  async getFakePromise(): Promise<any> {
    return new Promise<number>(resolve => {
      resolve(-1);
    });
  }

  getFromAddress(
    _chain: string,
    _assetSymbol: string
  ): string | Promise<string> {
    const fakeAddress = '0x123456';
    this.logger.info(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }
}
