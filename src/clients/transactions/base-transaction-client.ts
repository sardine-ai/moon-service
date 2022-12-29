/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Transaction } from '@/types/models';
import { CHAIN_TO_CHAIN_ID, CryptoConfig } from '@/config/crypto-config';
import { EvmTransaction, GasDetails } from '@/types/evm';
import { calculateMaxFeePerGas, GetGasDetails } from './gas';
import { getChainAlchemy } from './helpers';

export interface ITransactionSubmissionClient {
  cryptoConfig: CryptoConfig;
  getGasDetails: GetGasDetails;

  sendTransaction(transaction: Transaction): Promise<any>;
  getFromAddress(chain: string): Promise<string>;
}

export abstract class TransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  cryptoConfig: CryptoConfig;
  getGasDetails: GetGasDetails;

  constructor(cryptoConfig: CryptoConfig, getGasDetails: GetGasDetails) {
    this.cryptoConfig = cryptoConfig;
    this.getGasDetails = getGasDetails;
  }

  sendTransaction(_transaction: Transaction): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getFromAddress(_chain: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  buildEvmTransaction(
    transaction: Transaction,
    fromAddress: string,
    nonce: number,
    gasDetails: GasDetails
  ): EvmTransaction {
    return {
      from: fromAddress,
      to: transaction.to,
      gas: gasDetails.gasLimit,
      maxPriorityFeePerGas: gasDetails.maxPriorityFee,
      maxFeePerGas: calculateMaxFeePerGas(gasDetails),
      data: transaction.callData,
      value: transaction.value,
      chainId: CHAIN_TO_CHAIN_ID[transaction.chain],
      chain: transaction.chain,
      nonce: nonce
    };
  }

  async convertTransactionToEvmTransaction(
    transaction: Transaction
  ): Promise<EvmTransaction> {
    const fromAddress = await this.getFromAddress(transaction.chain);
    const alchemyWeb3 = getChainAlchemy(transaction.chain, this.cryptoConfig);
    const nonce = await alchemyWeb3.eth.getTransactionCount(
      fromAddress,
      'latest'
    );
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
