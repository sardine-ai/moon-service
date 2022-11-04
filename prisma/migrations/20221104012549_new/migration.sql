/*
  Warnings:

  - You are about to drop the column `operation` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `params` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "operation",
DROP COLUMN "params";
