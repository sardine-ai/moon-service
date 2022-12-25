-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('UNDEFINED', 'CREATED', 'SUBMITTED', 'BROADCASTING', 'CONFIRMING', 'COMPLETED', 'CANCELLED', 'REJECTED', 'BLOCKED', 'FAILED', 'RETRYING');
