/*
  Warnings:

  - Changed the type of `ticketId` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "ticketId",
ADD COLUMN     "ticketId" INTEGER NOT NULL;
