import { useFetchGuilds } from '../../utils/hooks/useFetchGuilds';
import React from 'react';
import styled from 'styled-components';
import { Content, LoadingSpinner, Page } from '@labmaker/ui';
import { PartialGuild } from '@labmaker/wrapper';
import { useNavigate } from 'react-router-dom';

export function GuildsMenu() {
  const { guilds, loading, error } = useFetchGuilds();
  const navigate = useNavigate();
  const defaultAvatar = 'https://i.imgur.com/t5JIZ1M.png'; //Could Generate Default Avatar (Its just the first letter from each word in guild.name)
  const addBotUrl =
    'https://discord.com/api/oauth2/authorize?client_id=863403711422660648&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&scope=bot'; //Move to ENV?

  const handleGuildClick = (guild: PartialGuild) => {
    console.log(`${guild.id} clicked`);
    navigate('/discord/settings');
  };

  const handleAddClick = () => window.open(process.env.NX_DISCORD_BOTADD_URL);

  const getAvatar = (id: string, icon: string) =>
    `https://cdn.discordapp.com/icons/${id}/${icon}.png`;

  return (
    <Page>
      <LoadingSpinner loading={loading} message="Loading Guilds" />
      {guilds &&
        !error &&
        guilds?.map((guild) => (
          <GuildSelector onClick={() => handleGuildClick(guild)} key={guild.id}>
            <img
              src={guild.icon ? getAvatar(guild.id, guild.icon) : defaultAvatar}
              alt="Guild Icon"
            />
            <span>{guild.name}</span>
            <Menubutton>Edit</Menubutton>
          </GuildSelector>
        ))}
      <GuildSelector onClick={handleAddClick}>
        <img src={`https://i.imgur.com/t5JIZ1M.png`} alt="Guild Icon" />
        <span>Add Guild</span>
        <Menubutton>Add</Menubutton>
      </GuildSelector>
    </Page>
  );
}

const GuildSelector = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  text-align: center;
  width: 950px;
  height: 150px;
  background-color: ${(p) => p.theme.navbar.base};
  border: 2px solid ${(p) => p.theme.input.borderCol};
  margin: 10px 0px;
  padding-left: 10px;
  align-items: center;

  img {
    user-select: none;
    border-radius: 50%;
    transition: border-radius 150ms ease-in-out;
  }

  span {
    font-size: 25px;
  }

  :hover {
    img {
      border-radius: 30%;
    }
    button {
      color: ${(p) => p.theme.input.switchActive};
    }
    background-color: ${(p) => p.theme.input.activeCol};
  }
`;

const Menubutton = styled.button`
  /* background-color: ${(p) => p.theme.input.switchActive}; */
  background-color: ${(p) => p.theme.navbar.item};
  color: ${(p) => p.theme.navbar.base};
  font-size: 19px;
  margin-right: 20px;
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 5px;
  transition: border-radius 150ms ease-in-out;
  cursor: pointer;
`;
