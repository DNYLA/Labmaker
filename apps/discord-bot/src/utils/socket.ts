import {
  GuildConfig,
  Ticket,
  TicketChannelInfo,
  TicketInfo,
  TicketNotif,
} from '@labmaker/shared';
import DiscordClient from './client';
import { io, Socket } from 'socket.io-client';
import { Permissions } from 'discord.js';
import Logs from './Logs';
import { updateTicket } from '@labmaker/wrapper';

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
    console.log('New Config');
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
        socket.emit('ticketChannelId', data);
        break;
      }
      case TicketNotif.Resigned:
        return handleResign(client, ticketInfo.ticket);
      case TicketNotif.Deleted:
        return handleDelete(client, ticketInfo.ticket);
    }
  });
};

const handleCreate = (client: DiscordClient, ticket: Ticket) => {
  const chan = client.channels.cache.find((c) => c.id === '936715007524229161');
  if (!chan || !chan.isText()) return;
  chan.send(
    `Listing Created ${ticket.subject} ${ticket.type} Paying $${ticket.budget} <@&936714996858110012>`
  );
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

  if (!guild) return;

  const channel = await guild.channels.create(`Ticket-${ticket.id}`, {
    type: 'GUILD_TEXT',
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
      { id: ticket.creatorId, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
      { id: ticket.tutorId, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
    ],
    parent: '936715000159043665',
  });

  if (!student || !tutor)
    channel.send('Tutor or Student is not in the server.');

  const msg = await channel.send(
    `Welcome <@${student.id}> Your Tutor is <@${tutor.id}> discuss your ${ticket.type} here.`
  );
  const embed = await Logs.GenerateEmbed(ticket, student, msg.url);
  await channel.send({ embeds: [embed] });

  channel.send(
    'Keep All communications in this channel. This is so we can monitor and make sure you are protected. If you contact the tutor outside the ticket your warranty will be voided.'
  );

  return { id: ticket.id, channelId: channel.id };
};

const handleResign = async (client: DiscordClient, ticket: Ticket) => {
  const { channel, student } = await hideChannel(client, ticket);
  if (!channel) return;
  await channel.send(
    '<@&918311173093457941> Tutor Handling case resigned. Student Already Notified, close Ticket Once Verified.'
  );

  //No Point in doing the rest if student doesnt exist. (Delete Student & Tutor Tickets if they dont exist in onLeave Event)
  if (!student) return;
  await student.send(
    `The Tutor working on your Ticket ${ticket.id} has resigned. We are finding another tutor for you!`
  );

  handleCreate(client, ticket);
};

const handleDelete = async (client: DiscordClient, ticket: Ticket) => {
  const { channel, tutor } = await hideChannel(client, ticket);
  if (!channel) return;
  await channel.send(
    '<@&918311173093457941> Student deleted Ticket. Tutor has been Notified, close Ticket Once Verified.'
  );
  if (!tutor) return;
  await tutor.send(
    `The student you were working with on Ticket ${ticket.id} has deleted the ticket and no longer needs help. Sorry for the inconvenience!`
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
