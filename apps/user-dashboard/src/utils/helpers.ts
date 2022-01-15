import { Item } from '@labmaker/ui';
import { Guild, RedditConfigDto } from '@labmaker/wrapper';

export const parseConfigs = (configs: RedditConfigDto[]) => {
  const parsedConfigs = new Array<Item>();
  configs.forEach((c) =>
    parsedConfigs.push({ value: c.id, label: c.username })
  );

  return parsedConfigs;
};

export const parseGuilds = (guilds: Guild[]) => {
  const parsedGuild = new Array<Item>();
  guilds.forEach((guild) => {
    parsedGuild.push({ value: guild.id, label: guild.name });
  });

  return parsedGuild;
};
