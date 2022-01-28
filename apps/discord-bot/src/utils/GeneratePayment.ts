// import { GuildConfig } from '@labmaker/shared';
// import { MessageActionRow, MessageButton } from 'discord.js';
// import DiscordClient from './client';

// export default class Payments {
//   static async GeneratePayments(
//     client: DiscordClient,
//     guildConfig: GuildConfig,
//     roles: string,
//     area: string
//   ): Promise<MessageActionRow> {
//     const buttonTypes = [];
//     const types = [];

//     const paymentObject = client.getPayments(guildConfig.id);
//     if (!paymentObject) {
//       return;
//     }

//     paymentObject.payments.forEach((payment) => {
//       if (payment.type.toLowerCase() == 'unlisted') return;

//       if (!types.includes(payment.type)) {
//         buttonTypes.push(
//           new MessageButton()
//             .setStyle('PRIMARY')
//             .setLabel(payment.type)
//             .setCustomId(`${roles}:${area}:${payment.type}`)
//         );
//         types.push(payment.type);
//       }
//     });

//     return new MessageActionRow().addComponents(buttonTypes);
//   }
// }
