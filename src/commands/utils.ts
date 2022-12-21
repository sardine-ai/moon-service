import { update } from 'lodash';
import { Bundle, Transaction } from '../types/models';

export const setStartingTransaction = (bundle: Bundle): Bundle => {
  const newBundle = Object.assign({}, bundle);
  const firstTransaction = newBundle.transactions[0];
  firstTransaction.isStarting = true;
  return newBundle;
};

export const updateTransactionWithBundleId = (
  transaction: Transaction,
  bundleId: string
): Transaction => {
  const newTransaction = update(transaction, 'bundleId', _b => bundleId);
  return newTransaction;
};

export const updateTransactionWithCosts = (
  transaction: Transaction,
  cost: string,
  gasCost: string
) => {
  let newTransaction = update(transaction, 'cost', _c => cost);
  newTransaction = update(newTransaction, 'gasCost', _g => gasCost);
  return newTransaction;
};
