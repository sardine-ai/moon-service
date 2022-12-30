/* eslint-disable @typescript-eslint/no-explicit-any */

import { Bundle, Transaction, TransactionState } from '../types/models';
import { UpdateTransaction } from '../repositories/base-repository';
import { ITransactionSubmissionClient } from '../clients/transactions';
import { Logger } from 'winston';
import { BundleReceiptResponse } from '../types/models/receipt';
import { buildBundleReceiptResponse } from '../types/models/receipt';

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
