import { Item } from '@labmaker/ui';
import {
  getDiscordConfig,
  GuildConfig,
  GuildConfigDto,
  PaymentDto,
  updateDiscordConfig,
  updatePayments,
} from '@labmaker/wrapper';
import React, { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { loadingDiscordConfig } from '../LoadingTypes';

export function useFetchGuild() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guildConfig, setGuildConfig] =
    useState<GuildConfigDto>(loadingDiscordConfig);
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [parsedGuilds, setParsedGuilds] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    if (!id) return;

    getDiscordConfig(id)
      .then(({ data }) => {
        setGuildConfig(data.config);
        setPayments(data.payments);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const createPayment = () => {
    if (!guildConfig) return;

    const newPayment: PaymentDto = {
      id: Math.random(), //This gets overridden on Server-Side (Create new DTOS for items yet to be created)
      name: 'Payment Name',
      value: 'Payment Value',
      type: 'FIAT',
      serverId: guildConfig.id,
      newPayment: true,
    };
    const _payments = [...payments];
    _payments.push(newPayment);
    setPayments(_payments);
  };

  const saveData = async () => {
    if (!guildConfig) return;
    try {
      updateDiscordConfig(guildConfig);
      if (payments.length === 0) return;
      await updatePayments(payments);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    guildConfig,
    setGuildConfig,
    parsedGuilds,
    payments,
    setPayments,
    saveData,
    createPayment,
    loading,
  };
}
