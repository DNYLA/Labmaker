import {
  ChannelType,
  PartialGuild,
  PartialGuildChannel,
  PartialRole,
} from '@labmaker/shared';
import { Item } from '@labmaker/ui';
import { RedditConfigDto } from '@labmaker/wrapper';

export const parseConfigs = (configs: RedditConfigDto[]) => {
  const parsedConfigs = new Array<Item>();
  configs.forEach((c) =>
    parsedConfigs.push({ value: c.id, label: c.username })
  );

  return parsedConfigs;
};

export const parseGuilds = (guilds: PartialGuild[]) => {
  const parsedGuild = new Array<Item>();
  guilds.forEach((guild) => {
    parsedGuild.push({ value: guild.id, label: guild.name });
  });

  console.log('This is the parsedGuild');
  console.log(parsedGuild);

  return parsedGuild;
};

export const parseRoles = (roles: PartialRole[]) => {
  const parsedRoles = new Array<Item>();
  roles.forEach((role) => {
    parsedRoles.push({ value: role.id, label: role.name });
  });

  return parsedRoles;
};

export const parseChannels = (
  channels: PartialGuildChannel[],
  type: ChannelType
) => {
  const parsedRoles = new Array<Item>();
  channels.forEach((c) => {
    if (c.type === type) parsedRoles.push({ value: c.id, label: c.name });
  });

  return parsedRoles;
};

export const findItem = (
  items: Item[],
  searchArray: RedditConfigDto[],
  id: number
) => {
  const foundItem = items.find((item) => item.value === id);
  return searchArray.find((c) => c.id === foundItem?.value);
};
