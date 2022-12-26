/*
  Warnings:

  - You are about to drop the column `costs` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "costs",
ADD COLUMN     "assetCosts" JSONB[];
