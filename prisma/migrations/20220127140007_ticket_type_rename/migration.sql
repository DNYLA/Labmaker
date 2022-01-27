/*
  Warnings:

  - Made the column `type` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `education` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "education" SET NOT NULL;
