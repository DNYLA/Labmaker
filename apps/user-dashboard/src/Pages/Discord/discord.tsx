import styled from 'styled-components';

/* eslint-disable-next-line */
export interface DiscordProps {}

const StyledDiscord = styled.div`
  color: pink;
`;

export function Discord(props: DiscordProps) {
  return (
    <StyledDiscord>
      <h1>Welcome to Discord!</h1>
    </StyledDiscord>
  );
}

export default Discord;
