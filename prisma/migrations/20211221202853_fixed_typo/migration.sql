/*
  Warnings:

  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReddditConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "ReddditConfig" DROP CONSTRAINT "ReddditConfig_userId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "ticketId" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DEFAULT E'',
ALTER COLUMN "subject" SET DEFAULT E'',
ALTER COLUMN "time" SET DEFAULT E'',
ALTER COLUMN "level" SET DEFAULT E'',
ALTER COLUMN "budget" SET DEFAULT E'',
ALTER COLUMN "submitted" SET DEFAULT false;

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "ReddditConfig";

-- CreateTable
CREATE TABLE "RedditConfig" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pmBody" TEXT NOT NULL,
    "subreddits" TEXT[],
    "forbiddenWords" TEXT[],
    "blockedUsers" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "RedditConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "subId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "subreddit" TEXT NOT NULL,
    "pm" BOOLEAN NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RedditConfig" ADD CONSTRAINT "RedditConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "RedditConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
