-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('SUBMITTED', 'BROADCASTING', 'CONFIRMING', 'COMPLETED', 'CANCELLED', 'REJECTED', 'BLOCKED', 'FAILED', 'RETRYING');

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "operation" TEXT NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "isStarting" BOOLEAN NOT NULL DEFAULT false,
    "transactionHash" TEXT,
    "executionId" TEXT,
    "state" "TransactionState" NOT NULL,
    "operation" TEXT NOT NULL,
    "params" JSONB NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvmTransaction" (
    "transactionId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "callData" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "EvmTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvmTransaction" ADD CONSTRAINT "EvmTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
