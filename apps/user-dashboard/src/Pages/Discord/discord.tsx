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
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { GeneralSettings } from './general-settings';
import { PaymentSettings } from './payment-settings';

function parseGuilds(guilds: Guild[]) {
  const parsedGuild: Item[] = [];

  guilds.forEach((guild) => {
    parsedGuild.push({ value: guild.id, label: guild.name, selected: false });
  });

  console.log(parsedGuild);

  parsedGuild[0].selected = true;

  return parsedGuild;
}

function useGuildLogic() {
  const [guilds, setGuilds] = useState([loadingServer]);
  const [parsedGuilds, setParsedGuilds] = useState<Item[]>([
    { value: '0', label: 'Loading...', selected: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([loadingPayment]);
  const dispatch = useDispatch();
  const discordConfig = useSelector(
    (state: RootState) => state.discordConfig.value
  );

  const fetchGuilds = useCallback(async () => {
    const fGuilds = await Labmaker.Guild.Guilds();
    if (!fGuilds) return;
    setGuilds(fGuilds);
    setParsedGuilds(parseGuilds(fGuilds));
    const fetchedData = await Labmaker.Guild.Config(fGuilds[0].id); //Fetch First Config (Probably Update this to fetch All?)

    if (!fetchedData || !fetchedData.config) return;
    dispatch(setDiscordConfig(fetchedData.config));

    if (!fetchedData.payments) return;
    setPayments(fetchedData.payments);
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    fetchGuilds();
  }, [fetchGuilds]);

  const onGuildSelected = async (serverId: string) => {
    const fetchedData = await Labmaker.Guild.Config(serverId);

    if (!fetchedData) {
      window.open(
        'https://discord.com/api/oauth2/authorize?client_id=863403711422660648&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&scope=bot'
      );
    } else {
      dispatch(setDiscordConfig(fetchedData.config));
      setPayments(fetchedData.payments);
    }
  };

  const onConfigIdChanged = async (serverId: string | number) => {
    if (typeof serverId === 'number') return; //This will never happen however typescript requires i check

    const fetchedPayments = await Labmaker.Discord.getPayments(serverId);
    setPayments(fetchedPayments);
    dispatch(setDiscordConfig({ ...discordConfig, paymentConfigId: serverId }));
  };

  const createPayment = async () => {
    const newPayment: PaymentDto = {
      id: Math.random(), //This gets overridden on Server-Side (Create new DTOS for items yet to be created)
      name: 'Payment Name',
      value: 'Payment Value',
      type: 'FIAT',
      serverId: discordConfig.id,
      newPayment: true,
    };

    const _payments = [...payments];
    _payments.push(newPayment);
    setPayments(_payments);
  };

  const savePayments = async () => {
    if (payments.length === 0) return;

    //Add Functionality to see what was updated and only send them
    //Or Merge this into one API call and just figure out what is new and what needs to be deleted on the server-side?
    const newPayments: PaymentDto[] = [];
    const updatePayments: PaymentDto[] = [];
    const deletedIds: number[] = [];

    //this is what should be moved to the API under one route
    //shouldnt be too hard to do it just replace current PUT with this.
    payments.forEach((payment) => {
      if (payment.newPayment) {
        newPayments.push(payment);
      } else if (!payment.deletedPayment) {
        updatePayments.push(payment);
      } else if (payment.deletedPayment && payment.id) {
        deletedIds.push(payment.id);
      }
    });

    if (newPayments.length > 0)
      await Labmaker.Discord.createPayments(newPayments);
    if (updatePayments.length > 0)
      await Labmaker.Discord.updatePayments(updatePayments);
    if (deletedIds.length > 0)
      await Labmaker.Discord.deletePayments(deletedIds);
  };

  const saveData = async () => {
    await savePayments();
    await Labmaker.Discord.update(discordConfig);
  };

  return {
    discordConfig,
    guilds,
    parsedGuilds,
    payments,
    setPayments,
    createPayment,
    saveData,
    onGuildSelected,
    onConfigIdChanged,
    isLoading,
  };
}

/* eslint-disable-next-line */
export interface DiscordProps {}

export function Discord(props: DiscordProps) {
  const {
    discordConfig,
    guilds,
    parsedGuilds,
    payments,
    setPayments,
    createPayment,
    saveData,
    onGuildSelected,
    onConfigIdChanged,
    isLoading,
  } = useGuildLogic();

  const GenerateGuilds = () => {
    if (guilds.length === 0 && !isLoading)
      return (
        <div>
          No Guilds with permissions found. Create a guild and come back!
        </div>
      );

    return guilds.map((guild) => {
      return (
        <Selector
          key={guild.id}
          clickEvent={() => onGuildSelected(guild.id)}
          title={guild.joined ? guild.name : `${guild.name} - Invite`}
          imageUrl={
            guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : `https://i.imgur.com/t5JIZ1M.png`
          }
          isActive={guild.id === discordConfig.id}
        />
      );
    });
  };

  return (
    <Page>
      <Content>
        <LoadingSpinner
          loading={isLoading}
          message={'Loading Discord Config'}
        />

        <SelectorContainer>{GenerateGuilds()}</SelectorContainer>

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
            config={discordConfig}
            parsedGuilds={parsedGuilds}
            changeEvent={onConfigIdChanged}
          />

          <PaymentSettings
            payments={payments}
            guilds={parsedGuilds}
            config={discordConfig}
            setPayments={setPayments}
            createPayment={createPayment}
          />
        </ComboContainer>
      </Content>
    </Page>
  );
}

const SelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;

  & > * {
    margin: 0px 15px;
  }
`;

// This is styled differently from the one inside Home
const ControlsContainer = styled.div`
  display: flex;
  position: relative;
`;
