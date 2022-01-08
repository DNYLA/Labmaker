import {
  ButtonInteraction,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  Permissions,
} from 'discord.js';
import { GuildConfigDto } from '@labmaker/wrapper';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import Payments from '../utils/GeneratePayment';
import { getArgsFromMsg, hasAnyPerms } from '../utils/Helpers';
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

    const roleIds = splitId[0]; // Split by "/" for each role
    const areaId = splitId[1]?.toLowerCase();
    const customId = splitId[2];

    // Ensure areaId and customId were set correctly.
    if (!roleIds || !areaId || !customId) {
      interaction.update({
        content: 'Unable to correctly get splitId of option.',
        components: [],
      });
      return;
    }

    if (
      !hasAnyPerms(
        interaction,
        [...roleIds.split('/')],
        [Permissions.FLAGS.ADMINISTRATOR]
      )
    )
      return;

    const guildId = interaction.guild.id;
    const guildConfig = await client.API.Discord.getOne(guildId);

    switch (areaId) {
      // Normal pay commands that any one can interact with.
      case 'paymentoption':
        await this.handlePaymentOptionEv(
          client,
          interaction,
          customId,
          roleIds,
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
    roleIds: string,
    guildConfig: GuildConfigDto
  ) {
    // Go back to main menu if back button clicked
    if (interationCustomId == 'back') {
      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [
          await Payments.GeneratePayments(
            client,
            guildConfig,
            roleIds,
            interationCustomId
          ),
        ],
      });

      return;
    }

    const payments = client.getPayments(guildConfig.id).payments;
    const paymentButtons = [];

    payments.forEach((payment) => {
      if (interationCustomId === payment.name) {
        Invoicer.handlePaymentChoice(payment, interaction, guildConfig);
      } else if (interationCustomId === payment.type) {
        paymentButtons.push(
          new MessageButton()
            .setStyle('PRIMARY')
            .setLabel(payment.name)
            .setCustomId(`paymentoption:${payment.name}`)
        );
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
    if (!hasAnyPerms(interaction, ['Tutor'], [Permissions.FLAGS.ADMINISTRATOR]))
      return;

    // Go back to displaying payment options
    if (interactionCustomId == 'no') {
      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [
          await Payments.GeneratePayments(
            client,
            guildConfig,
            'Tutor',
            'paymentoption'
          ),
        ],
      });

      return;
    }

    if (interactionCustomId == 'yes') {
      try {
        const replyRef = (interaction.message as Message).reference;
        const rmsg = await interaction.channel.messages.fetch(
          replyRef.messageId
        );
        const { args } = getArgsFromMsg(
          rmsg.content,
          guildConfig.prefix.length
        );

        const checkout = await client.API.Pay.createOrder(
          interaction.member.user.id,
          interaction.channelId,
          Number(args[0])
        );
        if (checkout) {
          interaction.update({
            content: `Invoice created! Please click the checkout button below to complete your payment of **$${Number(
              args[0]
            )}**.`,
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
