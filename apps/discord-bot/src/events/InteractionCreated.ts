import {
  ButtonInteraction,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  Permissions,
} from 'discord.js';
import {
  createPaypalOrder,
  getGuildConfig,
  GuildConfigDto,
} from '@labmaker/wrapper';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import Payments from '../utils/GeneratePayment';
import { getArgsFromMsg, hasAnyPerms } from '../utils/Helpers';

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
    const { data: guildConfig } = await getGuildConfig(guildId);

    switch (areaId) {
      // Normal pay commands that any one can interact with.
      case 'paymentoption':
        await this.handlePaymentOptionEv(
          client,
          interaction,
          customId,
          areaId,
          roleIds,
          guildConfig
        );
        break;
      case 'createpporder':
        await this.createPayPalOrderEv(
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
    areaId: string,
    roleIds: string,
    guildConfig: GuildConfigDto
  ) {
    // Go back to main menu if back button clicked
    if (interationCustomId == 'back') {
      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [
          await Payments.GeneratePayments(client, guildConfig, roleIds, areaId),
        ],
      });

      return;
    }

    const payments = client.getPayments(guildConfig.id).payments;
    const paymentButtons = [];

    payments.forEach((payment) => {
      if (interationCustomId === payment.name) {
        // If selected payment, update interaction to show it
        return interaction.update({
          content: `${payment.name}: ${payment.value}`,
          components: [],
        });
      } else if (interationCustomId === payment.type) {
        paymentButtons.push(
          new MessageButton()
            .setStyle('PRIMARY')
            .setLabel(payment.name)
            .setCustomId(`${roleIds}:${areaId}:${payment.name}`)
        );
      }
    });

    if (paymentButtons.length > 0) {
      const backButton = new MessageButton()
        .setStyle('SECONDARY')
        .setLabel('<')
        .setCustomId(`${roleIds}:${areaId}:back`);
      paymentButtons.push(backButton);

      interaction.update({
        content: 'Please Pick A Payment Method',
        components: [new MessageActionRow().addComponents(paymentButtons)],
      });
    }
  }

  private async createPayPalOrderEv(
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
        content: 'Cancelled request.',
        components: [],
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

        const { data: checkout } = await createPaypalOrder(
          interaction.member.user.id,
          interaction.channelId,
          Number(args[0])
        );

        if (checkout) {
          interaction.update({
            content: `Order created! Please click the checkout button below to complete your payment of **$${Number(
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
        interaction.update({
          content:
            "Error fetching original message. Couldn't get price of order.",
          components: [],
        });
      }
    }
  }
}
