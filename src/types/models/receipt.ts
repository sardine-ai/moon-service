import { Bundle, Operation, TransactionState, Transaction } from '.';
import { getAssetDetails } from '../../utils/crypto-utils';

export interface BundleReceiptResponse {
  bundleId?: string;
  totalCosts?: {
    assetSymbol: string;
    amount: string;
    decimals: number;
  }[];
  isComplete?: boolean;
  transactionReceipts: Array<TransactionReceipt>;
}

export interface TransactionReceipt {
  assetCosts?: {
    assetSymbol: string;
    amount: string;
    decimals: number;
  }[];
  gasCost?: string;
  chain: string;
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
  const totalCosts = getBundleReceiptTotalCost(transactionReceipts);
  return {
    bundleId: bundle.id,
    totalCosts: isComplete ? totalCosts : undefined,
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
        assetCosts: transaction.assetCosts,
        gasCost: transaction.gasCost || '0',
        chain: transaction.chain,
        operation: transaction.operation,
        state: TransactionState.COMPLETED
      };
    }
    default: {
      return {
        chain: transaction.chain,
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
  const totalCostDict = transactionReceipts
    .map(t => t.assetCosts)
    .flat()
    .reduce<Record<string, string>>((accumulator, cost) => {
      if (cost) {
        if (cost.assetSymbol in accumulator) {
          accumulator[cost.assetSymbol] = (
            Number(accumulator[cost.assetSymbol]) + Number(cost.amount)
          ).toString();
        } else {
          accumulator[cost.assetSymbol] = cost.amount;
        }
      }
      return accumulator;
    }, {});
  const totalCosts = Object.keys(totalCostDict).map(key => {
    return {
      assetSymbol: key,
      amount: totalCostDict[key],
      decimals: getAssetDetails('mainnet', key).decimals
    };
  });
  return totalCosts;
};
