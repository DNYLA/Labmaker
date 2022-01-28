import { GuildConfig, Ticket, TicketInfo, TicketNotif } from '@labmaker/shared';
import DiscordClient from './client';
import { io } from 'socket.io-client';
import { Permissions } from 'discord.js';

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

  socket.on('ticket', (infoJson: string) => {
    const ticketInfo: TicketInfo = JSON.parse(infoJson);

    switch (ticketInfo.type) {
      case TicketNotif.Created:
        return handleCreate(client, ticketInfo.ticket);
      case TicketNotif.Accepted:
        return handleAccepted(client, ticketInfo.ticket);
      case TicketNotif.Resigned:
        return console.log('Handle Resign');
      case TicketNotif.Deleted:
        return console.log('Handle Delete');
    }
  });
};

const handleCreate = (client: DiscordClient, ticket: Ticket) => {
  const c = client.channels.cache.find((c) => c.id === '936715007524229161');
  if (!c || !c.isText()) return;
  c.send(
    `Listing Created ${ticket.subject} ${ticket.type} Paying $${ticket.budget} <@&936714996858110012>`
  );
  return;
};

const handleAccepted = async (client: DiscordClient, ticket: Ticket) => {
  await client.guilds.fetch();
  const guild = client.guilds.cache.find((g) => g.id === ticket.serverId);
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
};
