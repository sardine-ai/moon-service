import { Bundle, Operation, TransactionState, Transaction } from '.';

export interface BundleReceiptResponse {
  bundleId?: string;
  totalCost?: number;
  currency?: string;
  isComplete?: boolean;
  transactionReceipts: Array<TransactionReceipt>;
}

export interface TransactionReceipt {
  totalCost?: number;
  cost?: string;
  gasCost?: string;
  currency: string;
  operation: Operation;
  state?: TransactionState;
}

export const buildBundleReceiptResponse = (
  bundle: Bundle
): BundleReceiptResponse => {
  const transactionReceipts = bundle.transactions.map(transaction => {
    const transactionReceipt = buildTransactionReceiptResponse(transaction);
    return transactionReceipt;
  });
  const isComplete = allTransactionsComplete(transactionReceipts);
  const totalCost = getBundleReceiptTotalCost(transactionReceipts);
  return {
    bundleId: bundle.id,
    totalCost: isComplete ? totalCost : undefined,
    currency: transactionReceipts[0].currency,
    isComplete: isComplete,
    transactionReceipts: transactionReceipts
  };
};

export const buildTransactionReceiptResponse = (
  transaction: Transaction
): TransactionReceipt => {
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
  transactionReceipts: Array<TransactionReceipt>
) => {
  return transactionReceipts.every(
    transactionReceipt => transactionReceipt.state == TransactionState.COMPLETED
  );
};

export const getBundleReceiptTotalCost = (
  transactionReceipts: Array<TransactionReceipt>
) => {
  const totalCost = transactionReceipts.reduce(
    (accumulator, transactionReceipt) => {
      accumulator += transactionReceipt.totalCost ?? 0;
      return accumulator;
    },
    0
  );
  return totalCost;
};
