import { useFetchGuilds } from '../../utils/hooks/useFetchGuilds';
import styled from 'styled-components';
import { LoadingSpinner, Page } from '@labmaker/ui';
import { useNavigate } from 'react-router-dom';
import { PartialGuild } from '@labmaker/shared';

export function GuildsMenu() {
  const { guilds, loading, error } = useFetchGuilds();
  const navigate = useNavigate();
  const defaultAvatar = 'https://i.imgur.com/t5JIZ1M.png'; //Could Generate Default Avatar (Its just the first letter from each word in guild.name)

  const handleGuildClick = (guild: PartialGuild) => {
    navigate(`/discord/${guild.id}`);
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
            {/* <Menubutton>Edit</Menubutton> */}
          </GuildSelector>
        ))}

      <GuildSelector onClick={handleAddClick}>
        <img src={`https://i.imgur.com/t5JIZ1M.png`} alt="Guild Icon" />
        <span>Add Guild</span>
        {/* <Menubutton>Add</Menubutton> */}
      </GuildSelector>
    </Page>
  );
}

const GuildSelector = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  max-width: 650px;
  background-color: ${(p) => p.theme.input.activeCol};
  border: 2px solid transparent;
  border-radius: 20px;
  margin: 10px 0px;
  padding: 12px;
  align-items: center;
  transition: border-radius 150ms ease-in-out;

  img {
    user-select: none;
    border-radius: 50%;
    width: 80px;
    margin-right: 25px;
    transition: border-radius 150ms ease-in-out;
  }

  span {
    font-size: 25px;
  }

  &:hover {
    border: 2px solid ${(p) => p.theme.navbar.active};
    border-radius: 28px;

    img {
      border-radius: 30%;
    }
  }
`;

// const Menubutton = styled.button`
//   /* background-color: ${(p) => p.theme.navbar.item}; */
//   background-color: #121212;
//   color: ${(p) => p.theme.navbar.title};
//   font-size: 19px;
//   margin-right: 20px;
//   width: 100px;
//   height: 50px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
// `;
