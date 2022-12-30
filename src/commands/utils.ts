import { update } from 'lodash';
import { Bundle, Transaction } from '../types/models';

export const configureBundleTransactions = (bundle: Bundle): Bundle => {
  const newBundle = Object.assign({}, bundle);
  newBundle.transactions = bundle.transactions.map((transaction, index) => {
    transaction.bundleId = bundle.id;
    transaction.order = index;
    return transaction;
  });
  return newBundle;
};

export const updateTransactionWithCosts = (
  transaction: Transaction,
  gasCost: string
) => {
  const newTransaction = update(transaction, 'gasCost', _g =>
    gweiToWei(gasCost)
  );
  return newTransaction;
};

export const gweiToWei = (gwei: string) => {
  return (Number(gwei) * 10 ** 9).toString();
};
