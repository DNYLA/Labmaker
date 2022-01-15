import { useFetchGuilds } from '../../utils/hooks/useFetchGuilds';
import React from 'react';
import styled from 'styled-components';

const StyledGuildsMenu = styled.div``;

export function GuildsMenu() {
  const { guilds, loading, error } = useFetchGuilds();

  return <div>{guilds && guilds?.map((guild) => <div>{guild.name}</div>)}</div>;
}
