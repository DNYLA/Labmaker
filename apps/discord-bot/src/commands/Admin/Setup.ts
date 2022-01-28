import {
  ColorResolvable,
  Message,
  PermissionResolvable,
  Role,
} from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

type CreateRole = {
  name: string;
  color: ColorResolvable;
  permissions?: PermissionResolvable;
  reason?: string;
};

type CategoryCreate = {
  name: string;
  channels: string[];
};

const rolesToCreate: CreateRole[] = [
  { name: 'Admin', color: 'DARK_AQUA', permissions: 'ADMINISTRATOR' },
  { name: 'Tutor', color: 'GREEN' },
  { name: 'Trial Tutor', color: 'DARK_GREEN' },
  { name: 'Student', color: 'PURPLE' },
  { name: 'Verified Student', color: 'GOLD' },
];

const catToCreate: CategoryCreate[] = [
  { name: 'Open Orders', channels: [] },
  { name: 'Help', channels: ['TOS', 'Help', 'Apply'] },
  {
    name: 'General',
    channels: ['Announcements', 'Invites', 'Vouches'],
  },
  { name: 'Chat', channels: ['Student Chat'] },
  {
    name: 'Staff',
    channels: ['Tutor Chat', 'Staff Chat', 'Transcripts'],
  },
];

export default class Setup extends Command {
  constructor() {
    super('setup', 'Admin', []);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    if (message.guild.ownerId !== message.author.id)
      return message.channel.send('Invalid Permission to use command');

    return message.channel.send('Setup Command Disabled');

    const guild = message.guild;
    //Delete All Channels
    guild.channels.cache.forEach(async (channel) => {
      await channel.delete();
    });
    guild.roles.cache.forEach(
      async (role) =>
        await role
          .delete()
          .then()
          .catch(() => console.log('Unable to delete role'))
    );

    //Create Log Channel to Notify User
    const logChannel = await guild.channels.create('Setup Logs', {
      type: 'GUILD_TEXT',
    });
    setTimeout(() => logChannel.send('Setting Up Server'), 1000);
    setTimeout(() => logChannel.send('Deleted Roles'), 1000);
    //Create Roles - Owner, Admin, Tutor, Trial Tutor, Student, Verified Student
    //Check if they exist before creating them
    // const createdRoles = guild.roles.cache.map((role) => {
    //   if (roles.includes(role.name)) {
    //     console.log('Am i HEre?');
    //     const i = roles.findIndex((name) => name === role.name);
    //     if (i > -1) roles.splice(i, 1);
    //     return role;
    //   }
    // });

    const createdRoles: Role[] = [];

    for (let i = 0; i < rolesToCreate.length; i++) {
      const rtc = rolesToCreate[i];
      const role = await guild.roles.create({
        name: rtc.name,
        color: rtc.color,
        reason: rtc.reason,
        permissions: rtc.permissions,
      });
      createdRoles.push(role);
    }

    setTimeout(() => logChannel.send('Created Roles'), 1000);

    //Create Open Orders Category

    catToCreate.forEach(async (cat) => {
      const category = await guild.channels.create(cat.name, {
        type: 'GUILD_CATEGORY',
      });

      cat.channels.forEach(async (name) => {
        await guild.channels.create(name, {
          type: 'GUILD_TEXT',
          parent: category.id,
        });
      });
    });

    setTimeout(() => logChannel.send('Finished Setting Up!'), 1000);
  }
}
