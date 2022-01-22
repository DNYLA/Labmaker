/*
  Warnings:

  - You are about to drop the column `channelId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `submitted` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `budget` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'BOT';

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "channelId",
DROP COLUMN "level",
DROP COLUMN "submitted",
DROP COLUMN "ticketId",
DROP COLUMN "time",
ADD COLUMN     "additionalInfo" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "education" TEXT NOT NULL,
ADD COLUMN     "tutorId" TEXT,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "subject" DROP DEFAULT,
DROP COLUMN "budget",
ADD COLUMN     "budget" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
