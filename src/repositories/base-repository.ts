import { Bundle, Transaction } from "../types/models";

export type StoreBundle = (bundle: Bundle) => Promise<void>;
export type GetBundle = (id: string) => Promise<Bundle>;

export type StoreTransactions = (bundle: Bundle) => Promise<void>
export type UpdateTransaction = (transaction: Transaction) => Promise<void>
export type GetTransaction = (id: string) => Promise<Transaction>;