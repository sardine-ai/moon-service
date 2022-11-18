import { v4 as uuidV4 } from "uuid";

export enum BundleOperations {
  TRANSFER_FUNDS = "TRANSFER_FUNDS",
  BUY_NFT = "BUY_NFT"
}

export interface Bundle {
  id: string;
  operation: string;
  transactions: Array<Transaction>
}

export const createBundle = (operation: BundleOperations): Bundle => ({
  id: uuidV4(),
  operation: operation.toString(),
  transactions: new Array<Transaction>()
})

export enum TransactionState {
  UNDEFINED = "UNDEFINED",
  CREATED = "CREATED",
  SUBMITTED = "SUBMITTED",
  BROADCASTING = "BROADCASTING",
  CONFIRMING = "CONFIRMING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
  FAILED = "FAILED",
  RETRYING = "RETRYING",
}

export interface Transaction {
  id: string;
  bundleId?: string;
  isStarting: boolean;
  transactionHash?: string;
  executionId?: string;
  state: TransactionState;
  to: string;
  value?: string;
  callData?: string;
  chain: string;
  assetSymbol: string;
}
