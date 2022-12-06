import { Bundle, Transaction } from "../types/models";
import { GetBundle, StoreBundle, UpdateTransaction } from "./base-repository";

const BUNDLE_DATABASE: Array<Bundle> = [];

export const storeBundle: StoreBundle = async (bundle: Bundle) => {
  BUNDLE_DATABASE.push(bundle);
}

export const getBundle: GetBundle = async (bundleId: string) => {
  return BUNDLE_DATABASE.find(bundle => bundle.id == bundleId);
}

export const updateTransaction: UpdateTransaction = async (transaction: Transaction) => {
  const bundle = BUNDLE_DATABASE.find(bundle => bundle.id == (transaction.bundleId ?? ""));
  const index = bundle?.transactions.findIndex(t => t.id == transaction.id);
  if (bundle?.transactions && index != undefined && index >= 0) {
    bundle.transactions[index] = transaction;
  }
}