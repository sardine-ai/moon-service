/*
  Warnings:

  - You are about to drop the column `assetSymbol` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "assetSymbol",
DROP COLUMN "cost",
ADD COLUMN     "costs" JSONB[];
