/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Transaction } from '../../types/models';
import { TransactionReceipt } from '../../types/models/receipt';
import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';
import { CHAIN_TO_CHAIN_ID, CryptoConfig } from '../../config/crypto-config';
import { formatEther } from 'ethers/lib/utils';
import { getGasDetails } from './helpers';
import { EvmTransaction, GasDetails } from '../../types/evm';

export interface ITransactionSubmissionClient {
  sendTransaction(transaction: Transaction): Promise<any>;
  getFromAddress(chain: string, assetSymbol: string): Promise<string> | string;
  quoteTransaction(
    transaction: Transaction
  ): Promise<TransactionReceipt>;
}

export abstract class TransactionSubmissionClient
  implements ITransactionSubmissionClient
{
  cryptoConfig: CryptoConfig;
  ethWeb3: AlchemyWeb3;
  polygonWeb3: AlchemyWeb3;

  constructor(cryptoConfig: CryptoConfig) {
    this.cryptoConfig = cryptoConfig;
    this.ethWeb3 = createAlchemyWeb3(cryptoConfig.ethRPC);
    this.polygonWeb3 = createAlchemyWeb3(cryptoConfig.maticRPC);
  }

  async quoteTransaction(
    transaction: Transaction
  ): Promise<TransactionReceipt> {
    const cost = formatEther(transaction.value || '0');

    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const fromAddress = await this.getFromAddress(
      transaction.chain,
      transaction.assetSymbol
    );
    const gasDetails = await getGasDetails(
      fromAddress,
      transaction,
      alchemyWeb3
    );
    const gasCost = formatEther(
      Number(gasDetails.gasLimit || 0) *
        (Number(gasDetails.maxPriorityFee) +
          Number(gasDetails.baseFeePerGas || 0))
    );
    return {
      totalCost: Number(cost) + Number(gasCost),
      assetCost: cost,
      gasCost: gasCost,
      currency: transaction.chain,
      operation: transaction.operation
    };
  }

  sendTransaction(_transaction: Transaction): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getFromAddress(
    _chain: string,
    _assetSymbol: string
  ): string | Promise<string> {
    throw new Error('Method not implemented.');
  }

  getChainAlchemy(chain: string): AlchemyWeb3 {
    switch (chain) {
      case this.cryptoConfig.ethChain:
        return this.ethWeb3;
      case this.cryptoConfig.polygonChain:
        return this.polygonWeb3;
      default:
        throw new Error(`Unsupported Chain: ${chain}`);
    }
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
      maxFeePerGas: (
        2 * Number(gasDetails?.baseFeePerGas || '0') +
        Number(gasDetails?.maxPriorityFee || '0')
      ).toString(),
      data: transaction.callData,
      value: transaction.value,
      chainId: CHAIN_TO_CHAIN_ID[transaction.chain],
      chain: transaction.chain,
      assetSymbol: transaction.assetSymbol,
      nonce: nonce
    };
  }

  async convertTransactionToEvmTransaction(
    transaction: Transaction
  ): Promise<EvmTransaction> {
    const alchemyWeb3 = this.getChainAlchemy(transaction.chain);
    const fromAddress = await this.getFromAddress(
      transaction.chain,
      transaction.assetSymbol
    );
    const nonce = await alchemyWeb3.eth.getTransactionCount(
      fromAddress,
      'latest'
    );
    const gasDetails = await getGasDetails(
      fromAddress,
      transaction,
      alchemyWeb3
    );
    return this.buildEvmTransaction(
      transaction,
      fromAddress,
      nonce,
      gasDetails
    );
  }
}