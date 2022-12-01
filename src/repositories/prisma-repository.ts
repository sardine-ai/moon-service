/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { 
  PrismaClient, 
  Bundle as BundleInPrisma,
  Transaction as TransactionInPrisma, 
  EvmTransaction as EvmTransactionInPrisma, 
  TransactionState as TransactionStateInPrisma
} from "@prisma/client";
import { Bundle, Transaction, TransactionState } from "../types/models";
import { StoreBundle, StoreTransactions, UpdateTransaction } from "./base-repository";

// To get more chances to reuse the connection,
// we create a new client instance here and allow others to import it.
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#serverless-environments-faas
export const prismaClient = new PrismaClient();

export const bundleToBundleInPrisma = (bundle: Bundle): BundleInPrisma => ({
  id: bundle.id,
  operation: bundle.operation,
})

export const transactionStateToTransactionStateInPrisma = (
  transactionState: TransactionState
): TransactionStateInPrisma => {
  return TransactionStateInPrisma[transactionState.toString() as keyof typeof TransactionStateInPrisma] ?? TransactionStateInPrisma.UNDEFINED;
}

export const transactionToPrismaBaseTransaction = (transaction: Transaction): TransactionInPrisma => ({
  id: transaction.id,
  bundleId: transaction.bundleId!, // TODO: Don't like this
  isStarting: transaction.isStarting,
  transactionHash: transaction.transactionHash ?? null,
  executionId: transaction.executionId ?? null,
  state: transactionStateToTransactionStateInPrisma(transaction.state),
  operation: transaction.operation
});

export const transactionToPrismaEvmTransaction = (transaction: Transaction): EvmTransactionInPrisma => ({
  transactionId: transaction.id,
  to: transaction.to,
  value: transaction.value ?? null,
  callData: transaction.callData ?? null,
  chain: transaction.chain,
  assetSymbol: transaction.assetSymbol
});

export const storeBundle: StoreBundle = async (bundle: Bundle) => {
  await prismaClient.bundle.create({
    data: bundleToBundleInPrisma(bundle)
  })
  await storeBundleTransactions(bundle);
}

export const storeBundleTransactions: StoreTransactions = async (bundle: Bundle) => {
  await prismaClient.$transaction([
    prismaClient.transaction.createMany({
      data: bundle.transactions.map(transactionToPrismaBaseTransaction)
    }),
    prismaClient.evmTransaction.createMany({
      data: bundle.transactions.map(transactionToPrismaEvmTransaction)
    })
  ]);
}

export const updateTransaction: UpdateTransaction = async (transaction: Transaction) => {
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
  ])
}