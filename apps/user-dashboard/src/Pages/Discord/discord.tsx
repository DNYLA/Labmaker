import { ComboContainer } from '@labmaker/ui-inputs';
import { Guild, PaymentDto } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { Labmaker } from '../../utils/APIHandler';
import { loadingPayment } from '../../utils/LoadingTypes';
import { setDiscordConfig } from '../../utils/slices/configSlices';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Selector } from '@labmaker/ui-header';
import { GeneralSettings } from './general-settings';
import { PaymentSettings } from './payment-settings';
type DDProps = {
  value: string;
  label: string;
};

function useGuildLogic() {
  const dispatch = useDispatch();
  const discordConfig = useSelector(
    (state: RootState) => state.discordConfig.value
  );

  const loadingServer: Guild = {
    id: '0',
    name: 'Name',
    icon: 'Icon',
    owner: false,
    permissions: '1234',
    features: [],
    joined: false,
  };

  const [guilds, setGuilds] = useState([loadingServer]);
  const [parsedGuilds, setParsedGuilds] = useState([
    { value: 'Loading...', label: 'Loading' },
  ]);
  const [reload, setReload] = useState(true);
  const [payments, setPayments] = useState([loadingPayment]);

  // const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    const loadConfig = async () => {
      setReload(false);
      dispatch(setDiscordConfig({ ...discordConfig, loading: true }));

      const fetchedGuilds = await Labmaker.Guild.Guilds();
      if (!fetchedGuilds) {
        // dispatch(
        //   updateDiscord({
        //     ...discordConfig,
        //     name: 'No Servers Found',
        //     loading: false,
        //   })
        // );
        dispatch(
          setDiscordConfig({
            ...discordConfig,
            name: 'No Servers Found',
            loading: false,
          })
        );
        setGuilds([]);
        setParsedGuilds(parseGuilds([]));
        return;
      }

      setGuilds(fetchedGuilds);
      setParsedGuilds(parseGuilds(fetchedGuilds));

      const fetchedData = await Labmaker.Guild.Config(fetchedGuilds[0].id);

      if (!fetchedData) {
        dispatch(
          setDiscordConfig({
            ...discordConfig,
            name: 'No Servers Found',
            loading: false,
          })
        );
        return;
      }

      if (!fetchedData.config) return;
      dispatch(setDiscordConfig(fetchedData.config));

      if (!fetchedData.payments) return;
      setPayments(fetchedData.payments);
    };

    if (reload) {
      loadConfig();
    }
  }, [dispatch, discordConfig, reload]);

  const saveData = async () => {
    //Add Functionality to see what was updated and only update that.
    await savePayments();
    await Labmaker.Discord.update(discordConfig);
  };

  const handleClick = async (server: string) => {
    const fetchedData = await Labmaker.Guild.Config(server);

    if (!fetchedData) {
      window.open(
        'https://discord.com/api/oauth2/authorize?client_id=863403711422660648&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&scope=bot'
      );
    } else {
      dispatch(setDiscordConfig(fetchedData.config));
      setPayments(fetchedData.payments);
    }
  };

  const createPayment = async () => {
    const newPayment: PaymentDto = {
      id: Math.random(),
      name: 'Payment Name',
      value: 'Payment Value',
      type: 'FIAT',
      serverId: discordConfig.id,
      newPayment: true,
    };

    // const savedPayment = await Labmaker.Discord.createPayments([newPayment]);
    const _payments = [...payments];

    // _payments.push(savedPayment[0]);
    _payments.push(newPayment);
    // console.log(savedPayment);
    setPayments(_payments);
  };

  const savePayments = async () => {
    if (payments.length === 0) return;

    // await Labmaker.Discord.updatePayments(payments);

    //Add Functionality to see what was updated and only send them
    const newPayments: PaymentDto[] = [];
    const updatePayments: PaymentDto[] = [];
    const deletedIds: number[] = [];

    //Should this be moved to the API under one route?
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

  const parseGuilds = (guilds: Guild[]) => {
    const parsedGuilds: string[] = [];
    const parsed: DDProps[] = [];

    if (!guilds) return parsed;

    guilds.forEach((guild: Guild) => {
      if (guild.joined) {
        parsedGuilds.push(guild.name);
        parsed.push({ value: guild.id, label: guild.name });
      }
    });
    return parsed;
  };

  const handleChange = async (item: any) => {
    const fetchedPayments = await Labmaker.Discord.getPayments(item.value);

    setPayments(fetchedPayments);
    dispatch(
      setDiscordConfig({ ...discordConfig, paymentConfigId: item.value })
    );
  };

  return {
    guilds,
    parsedGuilds,
    saveData,
    handleClick,
    createPayment,
    handleChange,
    discordConfig,
    payments,
    setPayments,
  };
}

/* eslint-disable-next-line */
export interface DiscordProps {}

const StyledDiscord = styled.div`
  margin: 50px 250px;
`;

export function Discord(props: DiscordProps) {
  const {
    guilds,
    parsedGuilds,
    saveData,
    handleClick,
    createPayment,
    handleChange,
    discordConfig,
    payments,
    setPayments,
  } = useGuildLogic();

  const GenerateGuilds = () => {
    if (guilds.length === 0)
      return (
        <div>
          No Guilds with permissions found. Create a guild and come back!
        </div>
      );

    return guilds.map((guild) => {
      return (
        <Selector
          key={guild.id}
          clickEvent={() => handleClick(guild.id)}
          title={guild.joined ? guild.name : `${guild.name} - Invite`}
          imageUrl={
            guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : `https://i.imgur.com/t5JIZ1M.png`
          }
        />
      );
    });
  };

  return (
    <StyledDiscord>
      <SelectorContainer>{GenerateGuilds()}</SelectorContainer>

      <ComboContainer>
        <GeneralSettings
          config={discordConfig}
          parsedGuilds={parsedGuilds}
          changeEvent={handleChange}
        />
        <PaymentSettings
          payments={payments}
          guilds={parsedGuilds}
          config={discordConfig}
          setPayments={setPayments}
          createPayment={createPayment}
        />
      </ComboContainer>
    </StyledDiscord>
  );
}

const SelectorContainer = styled.div`
  display: flex;
  justify-content: center;

  .selector {
    margin: 0px 15px;
  }
`;
