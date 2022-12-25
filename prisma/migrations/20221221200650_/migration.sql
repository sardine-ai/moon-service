/*
  Warnings:

  - You are about to drop the `EvmTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `to` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EvmTransaction" DROP CONSTRAINT "EvmTransaction_transactionId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "callData" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "to" TEXT NOT NULL,
ADD COLUMN     "value" TEXT;

-- DropTable
DROP TABLE "EvmTransaction";
