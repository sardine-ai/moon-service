/*
  Warnings:

  - You are about to drop the `TransactionReceipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransactionReceipt" DROP CONSTRAINT "TransactionReceipt_transactionId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "cost" DECIMAL(65,30),
ADD COLUMN     "gasCost" DECIMAL(65,30);

-- DropTable
DROP TABLE "TransactionReceipt";
