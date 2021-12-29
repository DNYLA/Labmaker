import { MessageActionRow, MessageButton } from 'discord.js';
import { GuildConfigDto } from 'labmaker-api-wrapper';
import DiscordClient from './client';

export default class Payments {
  static async GeneratePayments(
    client: DiscordClient,
    guildConfig: GuildConfigDto
  ): Promise<MessageActionRow> {
    let buttonTypes = [];
    let types = [];

    const paymentObject = client.getPayments(guildConfig.id);
    if (!paymentObject) {
      return;
    }

    paymentObject.payments.forEach((payment) => {
      if (!types.includes(payment.type)) {
        let tempButton = new MessageButton()
          .setStyle('PRIMARY')
          .setLabel(payment.type)
          .setCustomId(`paymentoption:${payment.type}`);

        buttonTypes.push(tempButton);
        types.push(payment.type);
      }
    });

    return new MessageActionRow().addComponents(buttonTypes);
  }
}
