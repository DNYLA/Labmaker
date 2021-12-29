-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenVersion" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReddditConfig" (
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
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReddditConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT E'?',
    "embedImageUrl" TEXT NOT NULL DEFAULT E'https://i.imgur.com/rDzblHE.gif',
    "autoSwicher" BOOLEAN NOT NULL DEFAULT false,
    "autoTicket" BOOLEAN NOT NULL DEFAULT false,
    "autoReact" BOOLEAN NOT NULL DEFAULT false,
    "paymentConfigId" TEXT NOT NULL,

    CONSTRAINT "DiscordConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "serverId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "subId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "subreddit" TEXT NOT NULL,
    "pm" BOOLEAN NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReddditConfig" ADD CONSTRAINT "ReddditConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "DiscordConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "ReddditConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
