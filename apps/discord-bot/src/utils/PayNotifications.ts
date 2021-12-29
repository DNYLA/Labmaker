import { MessageEmbed } from 'discord.js';
import { io } from 'socket.io-client';
import DiscordClient from './client';
import { getChannelFromId } from './Helpers';

/**
 * Get pay notifications from pay gateway.
 */
export default class PayNotifications {
  public static listen(client: DiscordClient) {
    try {
      const ws = io('http://localhost:3000/payments', {
        extraHeaders: {
          Authorization: client.API.accessToken,
        },
      });

      ws.on('connect', () => {
        console.log('WS open');
      });

      ws.on('disconnect', () => {
        console.log('WS closed');
      });

      ws.on('error', (err) => {
        console.log('WS', err.message);
      });

      ws.on('message', (client: DiscordClient, msg: Buffer) => {
        this.handleWSMsg(client, msg);
      });
    } catch (err) {
      console.log("Couldn't connect to pay gateway!", err);
    }
  }

  private static handleWSMsg(client: DiscordClient, msg: Buffer) {
    const pld = JSON.parse(msg.toString());

    if (!pld.op) {
      console.log('Recieved WS Message without an operation id, ignoring.');
      return;
    }

    // Share proper types from api somehow, possibly put in wrapper
    switch (pld.op) {
      case 100:
        this.sendPaymentCompletedMessage(client, pld.data);
        break;
    }
  }

  private static sendPaymentCompletedMessage(client: DiscordClient, payload) {
    const channel = getChannelFromId(client, payload.channelId);

    if (!channel) return;

    const breakdown = payload.breakdown;
    const paidEmbed = new MessageEmbed()
      .setColor('#10F9AB')
      .setTitle('Payment Completed!')
      .setDescription(
        'The payment has been completed, your tutor can now get going with your work!'
      )
      .addFields(
        {
          name: 'Total Paid',
          value: `${breakdown.gross.value} ${breakdown.gross.currencyCode}`,
          inline: true,
        },
        {
          name: 'Paypal Fee',
          value: `${breakdown.fee.value} ${breakdown.fee.currencyCode}`,
          inline: true,
        },
        {
          name: 'After Fees',
          value: `${breakdown.net.value} ${breakdown.net.currencyCode}`,
          inline: true,
        }
      )
      .setThumbnail(`https://i.imgur.com/E7PB9cr.gif`)
      .setTimestamp();

    channel.send({ embeds: [paidEmbed] });
  }
}
