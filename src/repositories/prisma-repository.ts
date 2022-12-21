/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  PrismaClient,
  Bundle as BundleInPrisma,
  Transaction as TransactionInPrisma,
  EvmTransaction as EvmTransactionInPrisma,
  TransactionState as TransactionStateInPrisma
} from '@prisma/client';
import {
  Bundle,
  Transaction,
  TransactionState,
  Operation,
  BaseTransaction
} from '../types/models';
import {
  StoreBundle,
  StoreTransactions,
  UpdateTransaction,
  GetTransactionByExecutionId,
  GetBundle
} from './base-repository';

// To get more chances to reuse the connection,
// we create a new client instance here and allow others to import it.
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#serverless-environments-faas
export const prismaClient = new PrismaClient();

export const bundleToBundleInPrisma = (bundle: Bundle): BundleInPrisma => ({
  id: bundle.id,
  operation: bundle.operation
});

export const bundleInPrismaToBundle = async (
  prismaBundle: BundleInPrisma & { transactions: Array<TransactionInPrisma> }
): Promise<Bundle> => {
  const transactions = await Promise.all(
    prismaBundle.transactions.map(prismaTransaction =>
      prismaTransactionToTransaction(prismaTransaction)
    )
  );
  return {
    id: prismaBundle.id,
    operation:
      Operation[prismaBundle.operation as keyof typeof Operation] ??
      Operation.UNKNOWN,
    transactions: transactions
  };
};

export const transactionStateToTransactionStateInPrisma = (
  transactionState: TransactionState
): TransactionStateInPrisma => {
  return (
    TransactionStateInPrisma[
      transactionState.toString() as keyof typeof TransactionStateInPrisma
    ] ?? TransactionStateInPrisma.UNDEFINED
  );
};

export const transactionStateInPrismaToTransactionState = (
  transactionState: TransactionStateInPrisma
): TransactionState => {
  return (
    TransactionState[
      transactionState.toString() as keyof typeof TransactionState
    ] ?? TransactionState.UNDEFINED
  );
};

export const transactionToPrismaBaseTransaction = (
  transaction: BaseTransaction
): TransactionInPrisma => ({
  id: transaction.id,
  bundleId: transaction.bundleId!, // TODO: Don't like this
  isStarting: transaction.isStarting,
  transactionHash: transaction.transactionHash ?? null,
  executionId: transaction.executionId ?? null,
  state: transactionStateToTransactionStateInPrisma(transaction.state),
  operation: transaction.operation,
  cost: transaction.cost ?? null,
  gasCost: transaction.gasCost ?? null,
  chain: transaction.chain,
  assetSymbol: transaction.assetSymbol
});

export const transactionToPrismaEvmTransaction = (
  transaction: Transaction
): EvmTransactionInPrisma => ({
  transactionId: transaction.id,
  to: transaction.to,
  value: transaction.value ?? null,
  callData: transaction.callData ?? null
});

export const prismaTransactionToTransaction = async (
  prismaTransaction: TransactionInPrisma
): Promise<Transaction> => {
  const evmTransaction = await getEvmTransaction(prismaTransaction.id);
  return {
    id: prismaTransaction.id,
    bundleId: prismaTransaction.bundleId,
    isStarting: prismaTransaction.isStarting,
    transactionHash: prismaTransaction.transactionHash ?? undefined,
    executionId: prismaTransaction.executionId ?? undefined,
    state: transactionStateInPrismaToTransactionState(prismaTransaction.state),
    chain: prismaTransaction.chain ?? '',
    assetSymbol: prismaTransaction.assetSymbol ?? '',
    operation:
      Operation[prismaTransaction.operation as keyof typeof Operation] ??
      Operation.UNKNOWN,
    cost: prismaTransaction.cost ?? undefined,
    gasCost: prismaTransaction.gasCost ?? undefined,
    to: evmTransaction?.to ?? '',
    value: evmTransaction?.value ?? '',
    callData: evmTransaction?.callData ?? ''
  };
};

export const getBundle: GetBundle = async (bundleId: string) => {
  const bundle = await prismaClient.bundle.findFirst({
    where: {
      id: bundleId
    },
    include: {
      transactions: true
    }
  });
  bundle?.transactions;
  return bundle ? bundleInPrismaToBundle(bundle) : undefined;
};

export const storeBundle: StoreBundle = async (bundle: Bundle) => {
  await prismaClient.bundle.create({
    data: bundleToBundleInPrisma(bundle)
  });
  await storeBundleTransactions(bundle);
};

export const storeBundleTransactions: StoreTransactions = async (
  bundle: Bundle
) => {
  await prismaClient.$transaction([
    prismaClient.transaction.createMany({
      data: bundle.transactions.map(transactionToPrismaBaseTransaction)
    }),
    prismaClient.evmTransaction.createMany({
      data: bundle.transactions.map(transaction =>
        transactionToPrismaEvmTransaction(transaction as Transaction)
      )
    })
  ]);
};

export const updateTransaction: UpdateTransaction = async (
  transaction: Transaction
) => {
  await prismaClient.$transaction([
    prismaClient.transaction.update({
      where: {
        id: transaction.id
      },
      data: transactionToPrismaBaseTransaction(transaction)
    }),
    prismaClient.evmTransaction.update({
      where: {
        transactionId: transaction.id
      },
      data: transactionToPrismaEvmTransaction(transaction)
    })
  ]);
};

export const getEvmTransaction = async (transactionId: string) => {
  const evmTransaction = await prismaClient.evmTransaction.findFirst({
    where: {
      transactionId: transactionId
    }
  });
  return evmTransaction;
};

export const getTransactionByExecutionId: GetTransactionByExecutionId = async (
  executionId: string
) => {
  const transaction = await prismaClient.transaction.findFirst({
    include: {
      evmTransaction: true
    },
    where: {
      executionId: executionId
    }
  });

  return transaction ? prismaTransactionToTransaction(transaction) : undefined;
};

export const getBundleByTransactionExecutionId = async (
  executionId: string
) => {
  const transaction = await getTransactionByExecutionId(executionId);
  return transaction?.bundleId ? getBundle(transaction.bundleId) : undefined;
};
