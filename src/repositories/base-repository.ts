import { Bundle, Transaction } from '../types/models';

export type StoreBundle = (bundle: Bundle) => Promise<void>;
export type GetBundle = (bundleId: string) => Promise<Bundle | undefined>;

export type StoreTransactions = (bundle: Bundle) => Promise<void>;
export type UpdateTransaction = (transaction: Transaction) => Promise<void>;
export type GetTransaction = (id: string) => Promise<Transaction | undefined>;
export type GetTransactionByExecutionId = (
  executionId: string
) => Promise<Transaction | undefined>;
export type GetBundleByTransactionExecutionId = (
  executionId: string
) => Promise<Bundle | undefined>;
