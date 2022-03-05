import {
  GuildConfig,
  Ticket,
  TicketChannelInfo,
  TicketInfo,
  TicketNotif,
} from '@labmaker/shared';
import DiscordClient from './client';
import { io } from 'socket.io-client';
import { Permissions } from 'discord.js';
import Logs from './Logs';
import { parseTicketMessage, showReviewBtns } from './Helpers';
import { ApplicationResult, Applications, User } from '@prisma/client';

export const listen = (accessToken: string, client: DiscordClient) => {
  const socket = io(process.env.API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  //#region Base Events
  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket'); // false
  });

  socket.on('error', (err) => {
    console.log('Error with WebSocket');
    console.log(err);
  });

  socket.on('exception', (ex) => {
    console.log(ex);
    switch (ex.code) {
      case 401: {
        console.log('Invalid API token privded. Disconnecting Client.');
        socket.disconnect();
      }
    }
  });
  //#endregion

  socket.on('guildConfig', (configJson: string) => {
    try {
      const config: GuildConfig = JSON.parse(configJson);
      client.setConfig(config);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('ticket', async (infoJson: string) => {
    const ticketInfo: TicketInfo = JSON.parse(infoJson);

    switch (ticketInfo.type) {
      case TicketNotif.Created:
        return handleCreate(client, ticketInfo.ticket);
      case TicketNotif.Accepted: {
        const data = await handleAccepted(client, ticketInfo.ticket);
        socket.emit('updateChannelId', {
          which: 'ticket',
          id: data.id,
          newChannelId: data.channelId,
        });
        break;
      }
      case TicketNotif.Resigned:
        return handleResignOrDelete(
          client,
          ticketInfo.ticket,
          TicketNotif.Resigned
        );
      case TicketNotif.Deleted:
        return handleResignOrDelete(
          client,
          ticketInfo.ticket,
          TicketNotif.Deleted
        );
    }
  });

  socket.on('tutorApplication', async (json: string) => {
    const application: Applications & {
      user: User;
    } = JSON.parse(json);

    switch (application.result) {
      case ApplicationResult.INTERVIEW: {
        const appChannel = await handleTutorApplicationInterview(
          client,
          application
        );
        socket.emit('updateChannelId', {
          which: 'application',
          id: application.id,
          newChannelId: appChannel.id,
        });
        break;
      }
      case ApplicationResult.REJECTED: {
        handleTutorApplicationRejection(client, application);
        break;
      }
    }
  });
};

const handleCreate = async (client: DiscordClient, ticket: Ticket) => {
  const config = await client.getConfig(ticket.serverId);
  if (!config.notificationChannel) return;
  const notifyChannel = client.channels.cache.find(
    (c) => c.id === config.notificationChannel
  );
  if (!notifyChannel || !notifyChannel.isText()) return;
  notifyChannel.send(parseTicketMessage(config.newMessage, config, ticket));
  return;
};

const handleAccepted = async (
  client: DiscordClient,
  ticket: Ticket
): Promise<TicketChannelInfo> => {
  await client.guilds.fetch();
  const guild = client.guilds.cache.find((g) => g.id === ticket.serverId);
  await guild.members.fetch();
  const student = guild.members.cache.find((m) => m.id === ticket.creatorId);
  const tutor = guild.members.cache.find((m) => m.id === ticket.tutorId);
  const config = await client.getConfig(ticket.serverId);

  if (!guild) return;

  const channel = await guild.channels.create(
    parseTicketMessage(config.channelName, config, ticket),
    {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
        { id: ticket.creatorId, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
        { id: ticket.tutorId, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
      ],
      parent: config.ordersCategory,
    }
  );

  if (!student || !tutor)
    channel.send('Tutor or Student is not in the server.');

  const msg = await channel.send(
    parseTicketMessage(config.acceptedMessage, config, ticket)
  );
  const embed = await Logs.GenerateEmbed(ticket, student, msg.url);
  await channel.send({ embeds: [embed] });

  channel.send(
    'Keep All communications in this channel. This is so we can monitor and make sure you are protected. If you contact the tutor outside the ticket your warranty will be voided.'
  );

  return { id: ticket.id, channelId: channel.id };
};

const handleResignOrDelete = async (
  client: DiscordClient,
  ticket: Ticket,
  type: TicketNotif
) => {
  const { channel, tutor, student } = await hideChannel(client, ticket);
  const config = await client.getConfig(ticket.serverId);
  if (!channel || !channel.isText()) return;

  await channel.send(
    parseTicketMessage(
      config.deleteMessage,
      config,
      ticket,
      TicketNotif.Resigned
    )
  );

  if (type === TicketNotif.Resigned) {
    if (!student) return;
    await student.send(
      `The Tutor working on your Ticket ${ticket.id} has resigned. We are finding another tutor for you!`
    );
    handleCreate(client, ticket);
  } else if (type === TicketNotif.Deleted) {
    if (!tutor) return;
    await tutor.send(
      `The student you were working with on Ticket ${ticket.id} has deleted the ticket and no longer needs help. Sorry for the inconvenience!`
    );
  }
};

const handleTutorApplicationInterview = async (
  client: DiscordClient,
  application: Applications & {
    user: User;
  }
) => {
  await client.guilds.fetch();
  const guild = client.guilds.cache.find((g) => g.id === application.serverId);
  await guild.members.fetch();
  const applicant = guild.members.cache.find(
    (m) => m.id === application.user.id
  );
  const config = await client.getConfig(application.serverId);

  if (!guild) return;

  const channel = await guild.channels.create('application-1', {
    type: 'GUILD_TEXT',
    permissionOverwrites: [
      // Remove view channel from everyone
      { id: guild.roles.everyone, deny: [Permissions.FLAGS.VIEW_CHANNEL] },

      // Allow applicant to view channel
      { id: applicant, allow: [Permissions.FLAGS.VIEW_CHANNEL] },

      // Only admins to review applications currently,
      // if a role is added for reviewers then can be added here.
    ],
    parent: '941188741790314496',
  });

  // TODO: Replace all these hardcoded messages with parsed msgs from config

  // PM User to notify them of their interview
  applicant
    .send(
      `Congratulations <@${application.user.id}>! Your application for the Tutor role have been moved to the interview stage. Head over to <#${channel.id}> and get back to us with when you are available for the interview. Good luck!`
    )
    .catch(() =>
      console.info(
        `${application.user.username}#${application.user.discriminator} does not accept private messages.`
      )
    );

  // Send same message in application channel.
  // Some users may have PMs disabled for non-friends so there
  // is a chance they don't reveice the PM above.
  channel.send(
    `Congratulations <@${application.user.id}>! Your application for the Tutor role have been moved to the interview stage. Head over to the server and get back to us with when you are available for the interview. Good luck!`
  );

  channel
    .send({
      embeds: [
        await Logs.GenerateTutorApplicationEmbed(application, applicant),
      ],
    })
    .then((msg) => msg.pin());

  showReviewBtns(
    application.id,
    channel,
    'Use the `!review` command to bring up the accept/reject buttons again!'
  );

  return channel;
};

const handleTutorApplicationRejection = async (
  client: DiscordClient,
  application: Applications & { user: User }
) => {
  await client.guilds.fetch();
  const guild = client.guilds.cache.find((g) => g.id === application.serverId);
  await guild.members.fetch();
  const applicant = guild.members.cache.find(
    (m) => m.id === application.user.id
  );

  applicant
    .send(
      `Hi <@${application.user.id}>. Unfortunately your tutor application was denied. You can still check your dashboard for when you are able to apply again! We look forward to seeing you soon!`
    )
    .catch(() =>
      console.info(
        `${application.user.username}#${application.user.discriminator} does not accept private messages.`
      )
    );
};

const hideChannel = async (client: DiscordClient, ticket: Ticket) => {
  const guild = client.guilds.cache.find((g) => g.id === ticket.serverId);
  await guild.members.fetch();
  const student = guild.members.cache.find((m) => m.id === ticket.creatorId);
  const tutor = guild.members.cache.find((m) => m.id === ticket.tutorId);

  const channel = guild.channels.cache.find((c) => c.id === ticket.channelId);

  if (!channel || !channel.isText()) return { channel, student, tutor };

  try {
    await channel.edit({
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
      ],
    });
  } catch {
    channel.send('Unable to Edit Channel Permissions');
  }

  return { channel, student, tutor };
};
