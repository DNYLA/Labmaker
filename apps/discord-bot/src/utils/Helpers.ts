import { GuildConfig, Ticket, TicketNotif } from '@labmaker/shared';
import {
  GuildMember,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  Permissions,
  TextChannel,
  User,
} from 'discord.js';
import DiscordClient from './client';
import { InteractionInfo, InteractionArea } from '../events/InteractionCreated';

/**
 * Make custom id for anything that will cause an
 * InteractionEvent to fire when used.
 *
 * To be used mainly so that when adding perms,
 * it won't error out when stringifying the obj.
 * Only easy fix I could find.
 *
 * @param info InteractionInfo.
 * @returns Stringified version of input, but bigints work (used for perms).
 */
export function makeCustomId(info: InteractionInfo) {
  return JSON.stringify(info, (_, v) =>
    typeof v === 'bigint' ? v.toString() : v
  );
}

/**
 * Send a direct message to a user.
 * This will simplify sending a DM, since we need to have a catch for if
 * sending the DM fails. Sending a DM will cause an error if the user
 * has direct messages disabled for non-friends.
 * @param user User to send message to.
 * @param msg Message content.
 */
export async function sendDM(user: User, msg: string) {
  await user
    .send(msg)
    .catch(() =>
      console.info(
        `${user.username}#${user.discriminator} does not accept private messages.`
      )
    );
}

/**
 * Checks if member has any of the required roles/perms.
 * @param msgori Message or Interaction. Needed so we can check the user's perms.
 * @param roles Array of roles - member needs to have at least one.
 * @param perms Array of perms - member needs to have at least one, unless they have a role from `roles`.
 * @param errResp Error message to send to channel if user doesn't have perms.
 * @returns True/False if member has any of the roles/perms.
 */
export function hasAnyPerms(
  msgori: Message | Interaction,
  roles?: string[],
  perms?: bigint[],
  errResp?: string
): boolean {
  const member = msgori.member as GuildMember;
  const channel = msgori.channel;

  // Check roles
  if (roles) {
    const usersRoles = member.roles.cache.mapValues((role) => role.name);

    for (const role of usersRoles) {
      if (roles.includes(role[1])) return true;
    }
  }

  // Check perms
  if (perms) {
    for (const permission in perms) {
      if (Object.prototype.hasOwnProperty.call(perms, permission)) {
        const perm = perms[permission];

        if (member.permissions.has(perm)) {
          return true;
        }
      }
    }
  }

  if (errResp) channel.send(errResp);

  return false;
}

export function getArgsFromMsg(
  msg: string,
  prefixLn: number
): { commandName: string; args?: string[] } {
  // Args including the command name
  const args = msg.slice(prefixLn).split(/ +/);

  return {
    commandName: args[0],
    args: args.slice(1),
  };
}

/**
 * Get ticket number from a channel.
 * @param channel Ticket text channel.
 * @returns Ticket number.
 */
export function getTicketNo(channel: TextChannel): number {
  // Channel must be under Open Orders category for it to be a valid ticket.
  if (channel.parent == null || channel.parent.name != 'Open Orders')
    return null;

  const ticketNo = Number(channel.name.toLowerCase().replace('ticket-', ''));

  if (isNaN(ticketNo)) {
    channel.send(`Invalid Ticket ID`);
    return null;
  }

  return ticketNo;
}

/**
 * Get tickets text channel from its number.
 * @param ticketNo Tickets number.
 * @returns Ticket text channel.
 */
export function getChannelFromId(
  client: DiscordClient,
  id: string
): TextChannel {
  if (!id) {
    console.log('Attempted to get channel from undefined id');
    return;
  }

  const channel = client.channels.cache.find((e) =>
    e.isText() ? (e as TextChannel).id == id : null
  ) as TextChannel;

  if (!channel) {
    console.log(`Couldn't find text channel from ticket number: ${id}`);
    return null;
  }

  return channel;
}

/**
 * Show YES/NO confirmation buttons.
 * @param message Message that triggered command.
 * @param confirmationMsg Message to send along with confirmation.
 * @param opts Options.
 */
export function showConfirmation(
  message: Message,
  confirmationMsg: string,
  opts: { roleIds: string; areaId: string }
) {
  const { roleIds, areaId } = opts;

  const YES = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Yes')
    .setCustomId(`${roleIds}:${areaId}:yes`);

  const NO = new MessageButton()
    .setStyle('DANGER')
    .setLabel('No')
    .setCustomId(`${roleIds}:${areaId}:no`);

  message.reply({
    content: confirmationMsg,
    components: [new MessageActionRow().addComponents([YES, NO])],
  });
}

export function showReviewBtns(
  applicationId: number,
  channel: TextChannel,
  msg?: string
) {
  if (!msg) msg = 'Accept or reject the application using the buttons below.';

  const acceptBtn = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Accept')
    .setCustomId(
      makeCustomId({
        areaId: InteractionArea.TutorInterviewReview,
        payload: { status: 'accepted', data: applicationId },
        perms: [Permissions.FLAGS.ADMINISTRATOR],
      })
    );

  const rejectBtn = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Reject')
    .setCustomId(
      makeCustomId({
        areaId: InteractionArea.TutorInterviewReview,
        payload: {
          status: 'rejected',
          data: applicationId,
        },
        perms: [Permissions.FLAGS.ADMINISTRATOR],
      })
    );

  return channel.send({
    content: msg,
    components: [new MessageActionRow().addComponents([acceptBtn, rejectBtn])],
  });
}

export function parseTicketMessage(
  toParse: string,
  config: GuildConfig,
  ticket: Ticket,
  action?: TicketNotif
): string {
  const parseKeys = [
    'tutor',
    'student',
    'subject',
    'type',
    'education',
    'budget',
    'action',
    'id',
    'tutor_role',
    'admin_role',
    'sender',
    'recipient',
  ];
  let parsed = toParse;
  let sender = '';
  let recipient = '';

  if (action === TicketNotif.Resigned) {
    sender = tagUser(ticket.tutorId);
    recipient = tagUser(ticket.creatorId);
  } else if (action === TicketNotif.Deleted) {
    sender = tagUser(ticket.creatorId);
    recipient = tagUser(ticket.tutorId);
  }

  parseKeys.forEach((key) => {
    let replaceVal = ticket[key];
    switch (key) {
      case 'student':
        replaceVal = tagUser(ticket.creatorId);
        break;
      case 'tutor':
        replaceVal = tagUser(ticket.tutorId);
        break;
      case 'tutor_role':
        replaceVal = tagRole(config.tutorRole);
        break;
      case 'admin_role':
        replaceVal = tagRole(config.staffRole);
        break;
      case 'action':
        replaceVal = action;
        break;
      case 'sender':
        replaceVal = sender;
        break;
      case 'recipient':
        replaceVal = recipient;
        break;
    }

    parsed = parsed.replace(`{${key}}`, replaceVal);
  });

  return parsed;
}

export const tagUser = (userId: string) => {
  return `<@${userId}>`;
};

export const tagRole = (roleId: string) => {
  return `<@&${roleId}>`;
};
