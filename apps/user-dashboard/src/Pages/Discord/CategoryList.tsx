import { PartialGuild } from '@labmaker/wrapper';
import React from 'react';

interface ICategoryList {
  guild: PartialGuild;
}
export default function CategoryList({ guild }: ICategoryList) {
  return <div>{guild.id}</div>;
}
