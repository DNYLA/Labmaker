import styled from 'styled-components';

/* eslint-disable-next-line */
export interface DiscordProps {}

const StyledDiscord = styled.div`
  color: pink;
`;

export function Discord(props: DiscordProps) {
  return <StyledDiscord></StyledDiscord>;
}

export default Discord;
