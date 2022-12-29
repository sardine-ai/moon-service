/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CryptoConfig } from '../../config/crypto-config';
import { Transaction } from '../../types/models';
import { ITransactionSubmissionClient } from './base-transaction-client';
import { GetGasDetails } from './gas';
import logger from '../../loaders/logger';

export class TestTransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  cryptoConfig: CryptoConfig;
  getGasDetails: GetGasDetails;

  constructor() {}

  async sendTransaction(_transaction: Transaction): Promise<any> {
    logger.info('Sending Transaction... JK');
    return;
  }

  async getFromAddress(_chain: string): Promise<string> {
    const fakeAddress = '0x123456';
    logger.info(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }
}
