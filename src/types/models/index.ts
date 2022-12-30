import { v4 as uuidV4 } from 'uuid';

export enum Operation {
  UNKNOWN = 'UNKNOWN',
  TRANSFER_FUNDS = 'TRANSFER_FUNDS',
  BUY_NFT = 'BUY_NFT',
  SWAP_TOKENS = 'SWAP_TOKENS'
}

export interface Bundle {
  id: string;
  operation: Operation;
  transactions: Array<Transaction>;
}

export const createBundle = (operation: Operation): Bundle => ({
  id: uuidV4(),
  operation: operation,
  transactions: new Array<Transaction>()
});

export enum TransactionState {
  UNDEFINED = 'UNDEFINED',
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  BROADCASTING = 'BROADCASTING',
  CONFIRMING = 'CONFIRMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING'
}

export const getTransactionState = (state: string): TransactionState => {
  return (
    TransactionState[state as keyof typeof TransactionState] ||
    TransactionState.UNDEFINED
  );
};

export interface Transaction {
  id: string;
  bundleId?: string;
  order: number;
  transactionHash?: string;
  executionId?: string;
  state: TransactionState;
  operation: Operation;
  assetCosts?: {
    assetSymbol: string;
    amount: string;
    decimals: number;
  }[];
  gasCost?: string;
  gas?: string;
  gasPrice?: string;
  chain: string;
  to: string;
  value?: string;
  callData?: string;
}
