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
import { setGuild, setPayments } from '../slices/configSlices';
import { toast } from 'react-toastify';

export function useFetchGuild() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parsedGuilds, setParsedGuilds] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const guildConfig = useSelector((state: RootState) => state.guild.config);
  const payments = useSelector((state: RootState) => state.guild.payments);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    if (!id) return;

    getDiscordConfig(id)
      .then(({ data }) => {
        dispatch(setGuild(data));
      })
      .catch((err) => {
        toast.error('Error loading Guild Config.');
        navigate('/discord');
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  return {
    guildConfig,
    parsedGuilds,
    payments,
    loading,
  };
}
