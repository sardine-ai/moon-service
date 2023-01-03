/*
  Warnings:

  - You are about to drop the column `chainId` on the `EvmTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `EvmTransaction` table. All the data in the column will be lost.
  - Added the required column `assetSymbol` to the `EvmTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chain` to the `EvmTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvmTransaction" DROP COLUMN "chainId",
DROP COLUMN "from",
ADD COLUMN     "assetSymbol" TEXT NOT NULL,
ADD COLUMN     "chain" TEXT NOT NULL;
