import {
  ComboContainer,
  UserControls,
  LoadingSpinner,
  Page,
  Content,
  Item,
} from '@labmaker/ui';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GeneralSettings } from './general-settings';
import { PaymentSettings } from './payment-settings';
import { useFetchGuild } from '../../utils/hooks/useFetchGuild';
import { useNavigate } from 'react-router-dom';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';
import { TicketSettings } from './ticket-settings';
import { TicketMessage } from './ticket-message-settings';

/* eslint-disable-next-line */
export interface DiscordProps {}

export function Discord(props: DiscordProps) {
  const { guildConfig, categories, textChannels, roles, loading } =
    useFetchGuild();
  const { createPayment, saveData, parsedGuilds } = useGuildLogic();

  const navigate = useNavigate();
  //Parsed Guilds are currently only fetched on GuildsMenu so if the user
  //refreshes the page when inside the DiscordPage it will error unless we redirect
  useEffect(() => {
    if (parsedGuilds.length === 0) {
      navigate('/discord');
    }
  }, [navigate, parsedGuilds.length]);

  return (
    <Page>
      <LoadingSpinner loading={loading} message={'Loading Discord Config'} />
      {!loading && guildConfig.id !== '-1' && (
        <Content>
          <ControlsContainer>
            <UserControls onCreate={createPayment} onSave={saveData} />
          </ControlsContainer>

          <ComboContainer>
            <GeneralSettings />
            <PaymentSettings />
          </ComboContainer>

          {/* Add Styling for Transition */}
          {guildConfig.ticketSystem && (
            <ComboContainer>
              <TicketSettings
                categories={categories}
                textChannels={textChannels}
                parsedRoles={roles}
              />
              <TicketMessage />
            </ComboContainer>
          )}
        </Content>
      )}
    </Page>
  );
}

const SelectorContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  overflow-x: auto;

  // This is changed depending on if there is overflow on x axis above in window resize event.
  justify-content: center;

  & > * {
    margin: 0px 15px;
  }
`;

// This is styled differently from the one inside Home
const ControlsContainer = styled.div`
  display: flex;
  position: relative;
`;
