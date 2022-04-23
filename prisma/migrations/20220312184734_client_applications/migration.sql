-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPERADMIN';

-- CreateTable
CREATE TABLE "ClientApplications" (
    "clientId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "scopes" TEXT[],
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "ClientApplications_pkey" PRIMARY KEY ("clientId")
);

-- AddForeignKey
ALTER TABLE "ClientApplications" ADD CONSTRAINT "ClientApplications_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
