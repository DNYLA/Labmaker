-- CreateEnum
CREATE TYPE "ApplicationResult" AS ENUM ('ACCEPTED', 'REJECTED', 'HOLD');

-- CreateTable
CREATE TABLE "Applications" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "applicationMessage" TEXT NOT NULL,
    "vouchesLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "redditUsername" TEXT,
    "result" "ApplicationResult" NOT NULL,
    "subjects" "Subjects"[],

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "DiscordConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
