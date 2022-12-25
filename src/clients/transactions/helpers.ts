/* eslint-disable @typescript-eslint/no-explicit-any */

import { Bundle, Transaction, TransactionState } from '../../types/models';
import { UpdateTransaction } from '../../repositories/base-repository';
import { ITransactionSubmissionClient } from './index';
import { GasDetails } from '../../types/evm';
import { AlchemyWeb3 } from '@alch/alchemy-web3';
import { Logger } from 'winston';
import {
  BundleReceiptResponse,
  getBundleReceiptTotalCost
} from '../../types/models/receipt';
import { buildBundleReceiptResponse } from '../../types/models/receipt';

export const getGasDetails = async (
  fromAddress: string,
  transaction: Transaction,
  alchemy: AlchemyWeb3
): Promise<GasDetails> => {
  const gasLimit = await alchemy.eth.estimateGas({
    from: fromAddress,
    to: transaction.to,
    data: transaction.callData,
    value: transaction.value
  });
  const maxPriorityFeePerGas = await alchemy.eth.getMaxPriorityFeePerGas();
  const feeHistory = await alchemy.eth.getFeeHistory(1, 'latest', []);
  return {
    maxPriorityFee: maxPriorityFeePerGas,
    gasLimit: gasLimit.toString(),
    baseFeePerGas: parseInt(feeHistory.baseFeePerGas[0], 16).toString()
  };
};

export type ExecuteBundle = (bundle: Bundle) => Promise<BundleReceiptResponse>;
export type QuoteBundle = (bundle: Bundle) => Promise<BundleReceiptResponse>;

export const executeBundleUninjected =
  (
    transactionSubmissionClient: ITransactionSubmissionClient,
    updateTransaction: UpdateTransaction,
    logger: Logger
  ) =>
  async (bundle: Bundle): Promise<BundleReceiptResponse> => {
    let transaction = getReadyTransaction(bundle.transactions);
    if (transaction) {
      logger.info(`Submitting transaction: ${JSON.stringify(transaction)}`);
      const result = await transactionSubmissionClient.sendTransaction(
        transaction
      );
      logger.info(`Transaction result ${JSON.stringify(result)}`);
      transaction = updateTransactionWithResult(transaction, result);
      updateTransaction(transaction);
    }
    const bundleReceiptResponse = buildBundleReceiptResponse(bundle);
    return bundleReceiptResponse;
  };

export const quoteBundleUninjected =
  (transactionSubmissionClient: ITransactionSubmissionClient, logger: Logger) =>
  async (bundle: Bundle): Promise<BundleReceiptResponse> => {
    const transactionQuotes = await Promise.all(
      bundle.transactions.map(async transaction => {
        logger.info(`Quoting transaction: ${JSON.stringify(transaction)}`);
        const transactionQuote =
          await transactionSubmissionClient.quoteTransaction(transaction);
        return transactionQuote;
      })
    );
    logger.info(`Transaction Quotes: ${JSON.stringify(transactionQuotes)}`);
    const totalCost = getBundleReceiptTotalCost(transactionQuotes);
    logger.info(`Total cost: ${totalCost}`);
    return {
      totalCost: totalCost,
      currency: transactionQuotes[0].currency,
      transactionReceipts: transactionQuotes
    };
  };

export const getReadyTransaction = (
  transactions: Array<Transaction>
): Transaction | undefined => {
  const transaction = transactions.find(isTransactionReady);
  return transaction;
};

const isTransactionReady = (transaction: Transaction) => {
  return transaction.state == TransactionState.CREATED;
};

const updateTransactionWithResult = (
  transaction: Transaction,
  result: any
): Transaction => {
  const newTransaction = Object.assign({}, transaction);
  newTransaction.executionId = result?.id || undefined;
  newTransaction.state = TransactionState.SUBMITTED;
  newTransaction.transactionHash = result?.transactionHash || undefined;
  return newTransaction;
};
