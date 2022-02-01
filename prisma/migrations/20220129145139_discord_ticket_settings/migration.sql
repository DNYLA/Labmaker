-- AlterTable
ALTER TABLE "DiscordConfig" ADD COLUMN     "acceptedMessage" TEXT,
ADD COLUMN     "channelName" TEXT NOT NULL DEFAULT E'Ticket-/id/',
ADD COLUMN     "deleteMessage" TEXT,
ADD COLUMN     "hideChannel" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newMessage" TEXT,
ADD COLUMN     "notificationChannel" TEXT,
ADD COLUMN     "notifyUser" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ordersCategory" TEXT;
