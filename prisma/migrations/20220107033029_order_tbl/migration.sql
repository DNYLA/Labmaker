/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "transactionId";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "ticketId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
