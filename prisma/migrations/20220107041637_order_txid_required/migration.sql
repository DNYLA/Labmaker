/*
  Warnings:

  - Made the column `transactionId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "transactionId" SET NOT NULL;
