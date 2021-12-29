import {
  ButtonInteraction,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { GuildConfigDto } from '@labmaker/wrapper';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import Payments from '../utils/GeneratePayment';
import { getArgsFromMsg } from '../utils/Helpers';
import Invoicer from '../utils/Invoicer';

export default class MessageEvent extends Event {
  constructor() {
    super('interactionCreate');
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (!interaction.isButton()) return;

    // Split interaction id by ":".
    // The should only be one colon, the left side being the
    // type and the right being its value (eg: area:value).
    const splitId = interaction.customId.split(':');

    const areaId = splitId[0]?.toLowerCase();
    const customId = splitId[1];

    // Ensure areaId and customId were set correctly.
    if (!areaId || !customId) {
      interaction.update({
        content: 'Unable to correctly get splitId of option.',
        components: [],
      });
      return;
    }

    const guildId = interaction.guild.id;
    let guildConfig = await client.API.Discord.getOne(guildId);

    switch (areaId) {
      case 'paymentoption':
        await this.handlePaymentOptionEv(
          client,
          interaction,
          customId,
          guildConfig
        );
        break;
      case 'createinvoice':
        await this.handleCreateInvoiceEv(
          client,
          interaction,
          customId,
          guildConfig
        );
        break;
    }
  }

  private async handlePaymentOptionEv(
    client: DiscordClient,
    interaction: ButtonInteraction,
    interationCustomId: string,
    guildConfig: GuildConfigDto
  ) {
    // Go back to main menu if back button clicked
    if (interationCustomId == 'back') {
      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [await Payments.GeneratePayments(client, guildConfig)],
      });

      return;
    }

    const payments = client.getPayments(guildConfig.id).payments;
    let paymentButtons = [];

    payments.forEach((payment) => {
      if (interationCustomId === payment.name) {
        Invoicer.handlePaymentChoice(payment, interaction, guildConfig);
      } else if (interationCustomId === payment.type) {
        let tempButton = new MessageButton()
          .setStyle('PRIMARY')
          .setLabel(payment.name)
          .setCustomId(`paymentoption:${payment.name}`);

        paymentButtons.push(tempButton);
      }
    });

    if (paymentButtons.length > 0) {
      const backButton = new MessageButton()
        .setStyle('SECONDARY')
        .setLabel('<')
        .setCustomId('paymentoption:back');
      paymentButtons.push(backButton);

      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [new MessageActionRow().addComponents(paymentButtons)],
      });
    }
  }

  private async handleCreateInvoiceEv(
    client: DiscordClient,
    interaction: ButtonInteraction,
    interactionCustomId: string,
    guildConfig: GuildConfigDto
  ) {
    // Go back to displaying payment options
    if (interactionCustomId == 'no') {
      this.handlePaymentOptionEv(
        client,
        interaction,
        'paymentoption:back',
        guildConfig
      );
    }

    if (interactionCustomId == 'yes') {
      try {
        let replyRef = (interaction.message as Message).reference;
        let rmsg = await interaction.channel.messages.fetch(replyRef.messageId);
        let { args } = getArgsFromMsg(rmsg.content, guildConfig.prefix.length);

        let checkout = await client.API.Pay.createOrder(
          interaction.channelId,
          args[0]
        );
        if (checkout) {
          interaction.update({
            content: `Invoice created! Please click the checkout button below to complete your payment of **$${args[0]}**.`,
            components: [
              new MessageActionRow().addComponents([
                new MessageButton()
                  .setStyle('LINK')
                  .setLabel('Checkout')
                  .setURL(checkout.url),
              ]),
            ],
          });
        }
      } catch (err) {
        interaction.update(
          "Error fetching original message. Couldn't get price of invoice."
        );
      }
    }
  }
}
