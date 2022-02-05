-- CreateEnum
CREATE TYPE "UserLogType" AS ENUM ('GET', 'PUT', 'POST', 'DELETE');

-- AlterTable
ALTER TABLE "DiscordConfig" ALTER COLUMN "channelName" SET DEFAULT E'Ticket-{id}';

-- CreateTable
CREATE TABLE "UserLogs" (
    "id" SERIAL NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT,
    "action" "UserLogType" NOT NULL,
    "actionMessage" TEXT NOT NULL,

    CONSTRAINT "UserLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserIds" TEXT[],
    "message" TEXT NOT NULL,
    "viewed" BOOLEAN NOT NULL,
    "hidden" BOOLEAN NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLogs" ADD CONSTRAINT "UserLogs_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
