import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { GuildConfigDto, PaymentDto } from '@labmaker/wrapper';
import { getArgsFromMsg } from './Helpers';

export default class Invoicer {
  public static async handlePaymentChoice(
    payment: PaymentDto,
    interaction: ButtonInteraction,
    guildConfig: GuildConfigDto
  ) {
    // If doesn't equal a payment we support invoicing, then just send message of it's value
    if (payment.name.toLowerCase() != 'paypal') {
      return interaction.reply({
        content: `${payment.name}: ${payment.value}`,
      });
    }

    const replyRef = (interaction.message as Message).reference;
    if (replyRef) {
      const rmsg = await interaction.channel.messages.fetch(replyRef.messageId);

      if (rmsg) {
        console.log(rmsg.content);

        const { args } = getArgsFromMsg(
          rmsg.content,
          guildConfig.prefix.length
        );

        const YES = new MessageButton()
          .setStyle('SUCCESS')
          .setLabel('Yes')
          .setCustomId('Tutor:createinvoice:yes');

        const NO = new MessageButton()
          .setStyle('DANGER')
          .setLabel('No')
          .setCustomId('Tutor:createinvoice:no');

        interaction.update({
          content: `Create PayPal invoice for $${Number(args[0])}?`,
          components: [new MessageActionRow().addComponents([YES, NO])],
        });
      }
    }
  }
}
