import { Ticket } from '@labmaker/shared';
import { Client, Message, MessageEmbed } from 'discord.js';

export default class Logs {
  static async GenerateEmbed(
    ticketDetails: Ticket,
    message: Message
  ): Promise<MessageEmbed> | null {
    const displayName = `${message.member.user.username}#${message.member.user.discriminator} - Ticket ${ticketDetails.id}`;
    const avUrl = `${message.member.user.displayAvatarURL({
      dynamic: true,
    })}`;
    return new MessageEmbed()
      .setColor('#10F9AB')
      .setTitle(ticketDetails.type)
      .setAuthor({ name: displayName, iconURL: avUrl, url: message.url })
      .addFields(
        { name: 'Subject', value: ticketDetails.subject, inline: false },
        { name: 'Education', value: ticketDetails.education, inline: true },
        { name: 'Budget', value: String(ticketDetails.budget), inline: true }
      )
      .setFooter({ text: 'Submitted' })
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
