import { Bundle, Transaction } from "src/types/models";

export const setStartingTransaction = (bundle: Bundle): Bundle => {
  const newBundle = Object.assign({}, bundle);
  const firstTransaction = newBundle.transactions[0];
  firstTransaction.isStarting = true;
  return newBundle;
}

export const updateTransactionWithBundleId = (transaction: Transaction, bundleId: string): Transaction => {
  const newTransaction = Object.assign({}, transaction);
  newTransaction.bundleId = bundleId;
  return newTransaction;
} 