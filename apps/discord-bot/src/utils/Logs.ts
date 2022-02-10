import { Ticket } from '@labmaker/shared';
import { Client, GuildMember, Message, MessageEmbed } from 'discord.js';
import { ApplicationResult, Applications, User } from '@prisma/client';

export default class Logs {
  static async GenerateEmbed(
    ticket: Ticket,
    student: GuildMember,
    url: string
  ): Promise<MessageEmbed> | null {
    const displayName = `${student.user.username}#${student.user.discriminator} - Ticket ${ticket.id}`;
    const budgetText = `$${ticket.budget}`;
    const avUrl = `${student.user.displayAvatarURL({
      dynamic: true,
    })}`;

    return new MessageEmbed()
      .setColor('#10F9AB')
      .setTitle(ticket.type)
      .setAuthor({ name: displayName, iconURL: avUrl, url })
      .addFields(
        { name: 'Subject', value: ticket.subject, inline: true },
        { name: 'Education', value: ticket.education, inline: true },
        {
          name: 'Budget',
          value: budgetText,
          inline: false,
        }
      )
      .setFooter({ text: 'Accepted' })
      .setThumbnail(`https://i.imgur.com/E7PB9cr.gif`)
      .setTimestamp();
  }

  static async GenerateTutorApplicationEmbed(
    application: Applications & {
      user: User;
    },
    applicant: GuildMember
  ) {
    const displayName = `${application.user.username}#${application.user.discriminator} - Application ${application.id}`;
    const avUrl = `${applicant.displayAvatarURL({
      dynamic: true,
    })}`;

    return new MessageEmbed()
      .setColor('#10F9AB')
      .setTitle(application.result)
      .setAuthor({ name: displayName, iconURL: avUrl })
      .addFields(
        {
          name: 'Message',
          value: application.applicationMessage,
          inline: false,
        },
        {
          name: 'Subjects',
          value: application.subjects.join(', '),
          inline: true,
        },
        { name: 'Vouches', value: application.vouchesLink, inline: true },
        {
          name: 'Applied',
          value: new Date(application.createdAt).toLocaleDateString(),
          inline: true,
        }
      )
      .setFooter({ text: 'Interview Requested' })
      .setThumbnail(`https://i.imgur.com/E7PB9cr.gif`)
      .setTimestamp();
  }

  static async SendLog(
    client: Client,
    msg: string
  ): Promise<Message<boolean> | void> {
    //Rewrite to find Channel named logs inside servers
    //SERVERID | CHANNELID
    const servers = [['863423914230546462', '863424666052198410']]; //Big Baller

    servers.forEach((server) => {
      client.guilds
        .fetch(server[0])
        .then(async (guild) => {
          const logChannel = guild.channels.cache.get(server[1]);

          if (logChannel) {
            setTimeout(() => {
              if (logChannel.isText()) {
                return logChannel.send(msg);
              }
            }, 1500);
          }
        })
        .catch(console.error);
    });
  }
}
