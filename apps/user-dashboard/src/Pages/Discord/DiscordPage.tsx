import {
  ComboContainer,
  Item,
  UserControls,
  LoadingSpinner,
  Selector,
  Page,
  Content,
} from '@labmaker/ui';
import { Guild, PaymentDto } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { Labmaker } from '../../utils/APIHandler';
import { loadingPayment, loadingServer } from '../../utils/LoadingTypes';
import { setDiscordConfig } from '../../utils/slices/configSlices';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { GeneralSettings } from './general-settings';
import { PaymentSettings } from './payment-settings';
import { useFetchGuild } from '../../utils/hooks/useFetchGuild2';
import { useNavigate, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface DiscordProps {}

export function Discord(props: DiscordProps) {
  const {
    guildConfig,
    setGuildConfig,
    parsedGuilds,
    payments,
    setPayments,
    createPayment,
    saveData,
    loading,
  } = useFetchGuild();

  const onConfigIdChanged = async (serverId: string | number) => {
    if (typeof serverId === 'number') return; //This will never happen however typescript requires i check
    const fetchedPayments = await Labmaker.Discord.getPayments(serverId);
    setPayments(fetchedPayments);
    setGuildConfig({ ...guildConfig, paymentConfigId: serverId });
  };

  return (
    <Page>
      <LoadingSpinner loading={loading} message={'Loading Discord Config'} />
      {!loading && guildConfig && (
        <Content>
          <ControlsContainer>
            <UserControls
              // onDelete={deleteNode}
              // onRefresh={refreshItem}
              onCreate={createPayment}
              onSave={saveData}
            />
          </ControlsContainer>

          <ComboContainer>
            <GeneralSettings
              config={guildConfig}
              setConfig={setGuildConfig}
              parsedGuilds={parsedGuilds}
              changeEvent={onConfigIdChanged}
            />

            <PaymentSettings
              config={guildConfig}
              guilds={parsedGuilds}
              payments={payments}
              setPayments={setPayments}
              createPayment={createPayment}
            />
          </ComboContainer>
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
