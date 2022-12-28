/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CryptoConfig } from 'src/config/crypto-config';
import { Transaction } from '../../types/models';
import { ITransactionSubmissionClient } from './base-transaction-client';
import { GetGasDetails } from './gas';

export class TestTransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  cryptoConfig: CryptoConfig;
  getGasDetails: GetGasDetails;

  constructor() {}

  async sendTransaction(_transaction: Transaction): Promise<any> {
    console.log('Sending Transaction... JK');
    return;
  }

  async getFromAddress(_chain: string): Promise<string> {
    const fakeAddress = '0x123456';
    console.log(`Fake from address: ${fakeAddress}`);
    return fakeAddress;
  }
}
