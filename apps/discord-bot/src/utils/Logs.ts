import { Client, GuildChannel, Message, MessageEmbed } from 'discord.js';
import { TicketDto } from 'labmaker-api-wrapper';

export default class Logs {
  static async GenerateEmbed(
    ticketDetails: TicketDto,
    message: Message
  ): Promise<MessageEmbed> | null {
    return new MessageEmbed()
      .setColor('#10F9AB')
      .setTitle(ticketDetails.type)
      .setAuthor(
        `${message.member.user.username}#${message.member.user.discriminator} - Ticket ${ticketDetails.ticketId}`,
        `${message.member.user.displayAvatarURL({
          dynamic: true,
        })}`,
        message.url
      )
      .addFields(
        { name: 'Time', value: ticketDetails.time, inline: false },
        { name: 'Level', value: ticketDetails.level, inline: true },
        { name: 'Budget', value: ticketDetails.budget, inline: true }
      )
      .setFooter('Submitted')
      .setThumbnail(`https://i.imgur.com/E7PB9cr.gif`)
      .setTimestamp();
  }

  static async SendLog(client: Client, msg: string): Promise<any> {
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
