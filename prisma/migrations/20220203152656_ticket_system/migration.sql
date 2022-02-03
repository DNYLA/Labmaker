-- AlterTable
ALTER TABLE "DiscordConfig" ADD COLUMN     "ticketSystem" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
