ALTER TYPE "TransactionType" ADD VALUE 'TRANSFER';

ALTER TABLE "transactions" ADD COLUMN "destinationAccountId" TEXT;

CREATE INDEX "transactions_destinationAccountId_idx" ON "transactions"("destinationAccountId");

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
