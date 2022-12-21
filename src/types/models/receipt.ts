import { Bundle, Operation, TransactionState, BaseTransaction } from '.';

export type TransactionReceipts = Array<
  | QuoteTransactionReceiptResponse
  | UpdatedTransactionReceiptResponse
  | CompletedTransactionReceiptResponse
>;

export type SubmittedTransactionReceipts = Array<
  UpdatedTransactionReceiptResponse | CompletedTransactionReceiptResponse
>;

export interface BundleReceiptResponse {
  bundleId?: string;
  totalCost?: number;
  currency?: string;
  isComplete?: boolean;
  transactionReceipts: TransactionReceipts;
}

export interface BaseTransactionReceipt {
  totalCost: number;
  cost: string;
  gasCost: string;
  currency: string;
  operation: Operation;
}

export type QuoteTransactionReceiptResponse = BaseTransactionReceipt;
export type UpdatedTransactionReceiptResponse = Omit<
  BaseTransactionReceipt & { state: TransactionState },
  'cost' | 'gasCost' | 'totalCost'
>;
export type CompletedTransactionReceiptResponse = BaseTransactionReceipt & {
  state: TransactionState;
};

export const buildBundleReceiptResponse = (
  bundle: Bundle
): BundleReceiptResponse => {
  const transactionReceipts = bundle.transactions.map(transaction => {
    const transactionReceipt = buildTransactionReceiptResponse(transaction);
    return transactionReceipt;
  });
  console.log('transactionReceipts', transactionReceipts);
  const isComplete = allTransactionsComplete(transactionReceipts);
  const totalCost = getBundleReceiptTotalCost(transactionReceipts);
  console.log('isComplete', isComplete);
  console.log('totalCost', totalCost);
  return {
    bundleId: bundle.id,
    totalCost: isComplete ? totalCost : undefined,
    currency: transactionReceipts[0].currency,
    isComplete: isComplete,
    transactionReceipts: transactionReceipts
  };
};

export const buildTransactionReceiptResponse = (
  transaction: BaseTransaction
): UpdatedTransactionReceiptResponse | CompletedTransactionReceiptResponse => {
  switch (transaction.state) {
    case TransactionState.COMPLETED: {
      return {
        totalCost:
          Number(transaction.cost || 0) + Number(transaction.gasCost || 0),
        cost: transaction.cost || '0',
        gasCost: transaction.gasCost || '0',
        currency: transaction.chain,
        operation: transaction.operation,
        state: TransactionState.COMPLETED
      };
    }
    default: {
      return {
        currency: transaction.chain,
        operation: transaction.operation,
        state: transaction.state
      };
    }
  }
};

export const allTransactionsComplete = (
  transactionReceipts: SubmittedTransactionReceipts
) => {
  return transactionReceipts.every(
    transactionReceipt => transactionReceipt.state == TransactionState.COMPLETED
  );
};

export const getBundleReceiptTotalCost = (
  transactionReceipts: TransactionReceipts
) => {
  const totalCost = transactionReceipts.reduce(
    (accumulator, transactionReceipt) => {
      let newAccumulator = accumulator;
      if ('totalCost' in transactionReceipt) {
        newAccumulator += transactionReceipt.totalCost;
      }
      return newAccumulator;
    },
    0
  );
  return totalCost;
};
