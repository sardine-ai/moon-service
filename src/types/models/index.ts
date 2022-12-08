// import { v4 as uuidV4 } from "uuid";

// export enum Operation {
//   UNKNOWN = "UNKNOWN",
//   TRANSFER_FUNDS = "TRANSFER_FUNDS",
//   BUY_NFT = "BUY_NFT"
// }

// export interface Bundle {
//   id: string;
//   operation: Operation;
//   transactions: Array<Transaction>
// }

// export const createBundle = (operation: Operation): Bundle => ({
//   id: uuidV4(),
//   operation: operation,
//   transactions: new Array<Transaction>()
// })

// export enum TransactionState {
//   UNDEFINED = "UNDEFINED",
//   CREATED = "CREATED",
//   SUBMITTED = "SUBMITTED",
//   BROADCASTING = "BROADCASTING",
//   CONFIRMING = "CONFIRMING",
//   COMPLETED = "COMPLETED",
//   CANCELLED = "CANCELLED",
//   REJECTED = "REJECTED",
//   BLOCKED = "BLOCKED",
//   FAILED = "FAILED",
//   RETRYING = "RETRYING",
// }

// export const getTransactionState = (state: string): TransactionState => {
//   return TransactionState[state as keyof typeof TransactionState] || TransactionState.UNDEFINED
// }

// export interface BaseTransaction {
//   id: string;
//   bundleId?: string;
//   isStarting: boolean;
//   transactionHash?: string;
//   executionId?: string;
//   state: TransactionState;
//   operation: Operation;
//   cost?: string;
//   gasCost?: string;
//   chain: string;
//   assetSymbol: string;
// }

// export type Transaction = BaseTransaction & {
//   to: string;
//   value?: string;
//   callData?: string; 
// }