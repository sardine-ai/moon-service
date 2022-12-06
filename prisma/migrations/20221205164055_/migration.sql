-- CreateTable
CREATE TABLE "TransactionReceipt" (
    "id" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "gasCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "TransactionReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionReceipt_transactionId_key" ON "TransactionReceipt"("transactionId");

-- AddForeignKey
ALTER TABLE "TransactionReceipt" ADD CONSTRAINT "TransactionReceipt_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
