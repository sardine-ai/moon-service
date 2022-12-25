-- AlterTable
ALTER TABLE "EvmTransaction" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "callData" DROP NOT NULL;
