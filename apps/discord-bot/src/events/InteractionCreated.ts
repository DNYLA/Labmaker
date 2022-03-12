import { reviewApplication } from '@labmaker/wrapper';
import { ApplicationResult } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ButtonInteraction, Interaction } from 'discord.js';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import { hasAnyPerms } from '../utils/Helpers';

export enum InteractionArea {
  PaymentOption,
  CreatePPOrder,
  TutorInterviewReview,
}

// All customIds for MessageButtons should use this
// interface for setting it, then JSON stringify it.
// It will be parsed again in the InteractionCreated event.
export interface InteractionInfo {
  areaId: InteractionArea;
  payload: any;

  /**
   * Roles needed for interaction to work for user.
   * This will work if user has any of the roles input,
   * they do not need to have all of them.
   */
  roles?: string[];

  /**
   * Perms needed for interaction to work for user.
   * This will work if user has any of the perms input,
   * they do not need to have all of them.
   *
   * Use with discordjs perms (eg for admin: Permissions.FLAGS.ADMINISTRATOR)
   */
  perms?: bigint[];
}

/**
 * For this event to work properly the InteractionInfo interface
 * should be used when making the customId for your button or anything
 * else that will cause this event to trigger.
 *
 * Currently the `makeCustomId` helper func should be used to set
 * your custom id. **Example:**
 *   [...].setCustomId(
 *     makeCustomId({
 *       areaId: InteractionArea.RandomAreaThatDoesntExist,
 *       payload: { status: 'accepted', data: applicationId },
 *       perms: [Permissions.FLAGS.ADMINISTRATOR],
 *     })
 *   );
 */
export default class InteractionCreatedEvent extends Event {
  constructor() {
    super('interactionCreate');
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (!interaction.isButton()) return;

    const { areaId, payload, roles, perms } = JSON.parse(
      interaction.customId
    ) as InteractionInfo;

    // Return if user has none of the roles/perms listed.
    if (roles || perms) {
      if (!hasAnyPerms(interaction, roles, perms)) return;
    }

    switch (areaId) {
      case InteractionArea.PaymentOption:
        console.log('Payment Option');
        break;
      case InteractionArea.CreatePPOrder:
        console.log('Create PP Order');
        break;
      case InteractionArea.TutorInterviewReview:
        this.handleTutorInterviewReview(interaction, payload);
        break;
      default:
        console.log('InteractionCreated: Invalid case encountered.');
        break;
    }
  }

  private async handleTutorInterviewReview(
    interaction: ButtonInteraction,
    payload: any
  ) {
    if (!payload.status || !payload.data) {
      console.error(
        'Need to define status and data in payload for handleTutorInterviewReview to work.'
      );
      return;
    }

    const applicationStatus = payload.status.toUpperCase() as ApplicationResult;
    const applicationId = Number(payload.data);

    // Return if applicationStatus doesn't conform to the ApplicationResult type.
    if (!Object.values(ApplicationResult).includes(applicationStatus)) return;

    // Only accepted statuses are accepted/rejected. These are the only options given in interview review.
    if (applicationStatus !== 'ACCEPTED' && applicationStatus !== 'REJECTED')
      return;

    let msg = `**Application ${applicationStatus.toLowerCase()}.** This channel will be archived shortly.`;

    if (applicationStatus === 'REJECTED')
      msg += `\n\nHopefully we haven't put you off being a tutor on this server. Check out the application page to see when you can reapply!`;

    await reviewApplication(applicationId, applicationStatus).catch(
      (r: AxiosError) => {
        msg = "Couldn't review application!";

        if (r.response?.data?.message) {
          msg = r.response.data.message;
        }
      }
    );

    interaction.update({
      content: msg,
      components: [],
    });
  }

  // private async handlePaymentOptionEv(
  //   client: DiscordClient,
  //   interaction: ButtonInteraction,
  //   interationCustomId: string,
  //   areaId: string,
  //   roleIds: string,
  //   guildConfig: GuildConfig
  // ) {
  //   // Go back to main menu if back button clicked
  //   if (interationCustomId == 'back') {
  //     interaction.update({
  //       content: 'Please Pick A Payment Method',
  //       components: [
  //         await GeneratePayments(client, guildConfig, roleIds, areaId),
  //       ],
  //     });

  //     return;
  //   }

  //   const payments = client.getPayments(guildConfig.id).payments;
  //   const paymentButtons = [];

  //   payments.forEach((payment) => {
  //     if (interationCustomId === payment.name) {
  //       // If selected payment, update interaction to show it
  //       return interaction.update({
  //         content: `${payment.name}: ${payment.value}`,
  //         components: [],
  //       });
  //     } else if (interationCustomId === payment.type) {
  //       paymentButtons.push(
  //         new MessageButton()
  //           .setStyle('PRIMARY')
  //           .setLabel(payment.name)
  //           .setCustomId(`${roleIds}:${areaId}:${payment.name}`)
  //       );
  //     }
  //   });

  //   if (paymentButtons.length > 0) {
  //     const backButton = new MessageButton()
  //       .setStyle('SECONDARY')
  //       .setLabel('<')
  //       .setCustomId(`${roleIds}:${areaId}:back`);
  //     paymentButtons.push(backButton);

  //     interaction.update({
  //       content: 'Please Pick A Payment Method',
  //       components: [new MessageActionRow().addComponents(paymentButtons)],
  //     });
  //   }
  // }

  // private async createPayPalOrderEv(
  //   client: DiscordClient,
  //   interaction: ButtonInteraction,
  //   interactionCustomId: string,
  //   guildConfig: GuildConfig
  // ) {
  //   if (!hasAnyPerms(interaction, ['Tutor'], [Permissions.FLAGS.ADMINISTRATOR]))
  //     return;

  //   // Go back to displaying payment options
  //   if (interactionCustomId == 'no') {
  //     interaction.update({
  //       content: 'Cancelled request.',
  //       components: [],
  //     });
  //     return;
  //   }

  //   if (interactionCustomId == 'yes') {
  //     try {
  //       const replyRef = (interaction.message as Message).reference;
  //       const rmsg = await interaction.channel.messages.fetch(
  //         replyRef.messageId
  //       );
  //       const { args } = getArgsFromMsg(
  //         rmsg.content,
  //         guildConfig.prefix.length
  //       );

  //       const { data: checkout } = await createPaypalOrder(
  //         interaction.member.user.id,
  //         interaction.channelId,
  //         Number(args[0])
  //       );

  //       if (checkout) {
  //         interaction.update({
  //           content: `Order created! Please click the checkout button below to complete your payment of **$${Number(
  //             args[0]
  //           )}**.`,
  //           components: [
  //             new MessageActionRow().addComponents([
  //               new MessageButton()
  //                 .setStyle('LINK')
  //                 .setLabel('Checkout')
  //                 .setURL(checkout.url),
  //             ]),
  //           ],
  //         });
  //       }
  //     } catch (err) {
  //       interaction.update({
  //         content:
  //           "Error fetching original message. Couldn't get price of order.",
  //         components: [],
  //       });
  //     }
  //   }
  // }
}
