/*
  Warnings:

  - You are about to drop the column `state` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "state";

-- DropEnum
DROP TYPE "TransactionState";
