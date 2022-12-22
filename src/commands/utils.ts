import { update } from 'lodash';
import { Bundle, Transaction } from '../types/models';

export const configureBundleTransactions = (bundle: Bundle): Bundle => {
  const newBundle = Object.assign({}, bundle);
  newBundle.transactions = bundle.transactions.map((transaction, index) => {
    transaction.bundleId = bundle.id;
    transaction.order = index;
    return transaction;
  })
  return newBundle;
}

export const updateTransactionWithCosts = (
  transaction: Transaction,
  cost: string,
  gasCost: string
) => {
  let newTransaction = update(transaction, 'cost', _c => cost);
  newTransaction = update(newTransaction, 'gasCost', _g => gasCost);
  return newTransaction;
};
