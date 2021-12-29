import { Invite, Message } from 'discord.js';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import Logs from '../utils/Logs';

export default class InviteCreatedEvent extends Event {
  constructor() {
    super('inviteCreate');
  }

  async run(client: DiscordClient, invite: Invite) {
    await invite.guild.fetch();

    let guild = await client.guilds.fetch(invite.guild.id);
    let member = await guild.members.fetch(invite.inviter.id);

    if (
      member.roles.cache.find((r) => r.name === 'Tutor') ||
      member.roles.cache.find((r) => r.name === 'Trial Tutor') ||
      member.permissions.has('ADMINISTRATOR')
    ) {
      console.log('Invite Created by Admin/Helper');
      return;
    }

    await Logs.SendLog(client, `Invite Was Created by ${invite.inviter}`);
  }
}
