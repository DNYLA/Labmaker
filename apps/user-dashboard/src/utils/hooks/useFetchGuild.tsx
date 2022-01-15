import { Item } from '@labmaker/ui';
import { Guild, PaymentDto } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { Labmaker } from '../../utils/APIHandler';
import { loadingPayment, loadingServer } from '../../utils/LoadingTypes';
import { setDiscordConfig } from '../slices/configSlices';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function parseGuilds(guilds: Guild[]) {
  const parsedGuild: Item[] = [];

  guilds.forEach((guild) => {
    parsedGuild.push({ value: guild.id, label: guild.name });
  });

  console.log(parsedGuild);

  return parsedGuild;
}

export function useFetchGuild() {
  const [guilds, setGuilds] = useState([loadingServer]);
  const [parsedGuilds, setParsedGuilds] = useState<Item[]>([
    { value: '0', label: 'Loading...' },
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
