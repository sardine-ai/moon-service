// import { update } from "lodash";
// import { Bundle, Transaction } from "../types/models";

// export const setStartingTransaction = (bundle: Bundle): Bundle => {
//   const newBundle = Object.assign({}, bundle);
//   const firstTransaction = newBundle.transactions[0];
//   firstTransaction.isStarting = true;
//   return newBundle;
// }

// export const updateTransactionWithBundleId = (transaction: Transaction, bundleId: string): Transaction => {
//   const newTransaction = Object.assign({}, transaction);
//   newTransaction.bundleId = bundleId;
//   return newTransaction;
// } 

// export const updateTransactionWithCosts = (
//   transaction: Transaction, cost: string, gasCost: string
// ) => {
//   transaction = update(transaction, 'cost', (_c) => cost);
//   transaction = update(transaction, 'gasCost', (_g) => gasCost);
//   return transaction;
// }