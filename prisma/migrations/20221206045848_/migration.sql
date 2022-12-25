/*
  Warnings:

  - You are about to drop the column `callData` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "callData",
DROP COLUMN "to",
DROP COLUMN "value";

-- CreateTable
CREATE TABLE "EvmTransaction" (
    "transactionId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT,
    "callData" TEXT,

    CONSTRAINT "EvmTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "EvmTransaction" ADD CONSTRAINT "EvmTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
