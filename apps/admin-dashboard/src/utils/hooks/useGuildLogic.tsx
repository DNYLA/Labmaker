import {
  createRedditConfig,
  deleteRedditConfig,
  getDiscordPayments,
  RedditConfigDto,
  updateRedditConfig,
} from '@labmaker/wrapper';
import { RootState } from '../../store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redditTemplate } from '../LoadingTypes';
import { findItem, parseConfigs } from '../helpers';
import { Item } from '@labmaker/ui';
import { toast } from 'react-toastify';
import { addNode, deleteNode, setNode } from '../slices/userSlice';
import { updateGuildConfig, updatePayments } from '@labmaker/wrapper';
import {
  setConfig as setConfigState,
  setPayments as setPaymentsState,
} from '../slices/configSlices';
import { GuildConfig, Payment } from '@labmaker/shared';

export function useGuildLogic() {
  const dispatch = useDispatch();
  const guildConfig = useSelector((state: RootState) => state.guild.config);
  const payments = useSelector((state: RootState) => state.guild.payments); //Only Used for Saving
  const parsedGuilds = useSelector(
    (state: RootState) => state.guild.parsedGuilds
  ); //Only Used for Saving

  const saveData = async () => {
    if (!guildConfig) return;
    try {
      updateGuildConfig(guildConfig);
      if (payments.length === 0) return;
      await updatePayments(payments);
    } catch (err) {
      console.log(err);
    }
  };

  const createPayment = () => {
    if (!guildConfig) return;

    const newPayment: Payment = {
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

  const onConfigIdChanged = async (serverId: string | number) => {
    if (typeof serverId === 'number') return; //This will never happen however typescript requires i check
    setConfig({ ...guildConfig, paymentConfigId: serverId });
  };

  const setPayments = (payments: Payment[]) =>
    dispatch(setPaymentsState(payments));
  const setConfig = (config: GuildConfig) => dispatch(setConfigState(config));

  return {
    guildConfig,
    payments,
    parsedGuilds,
    onConfigIdChanged,
    saveData,
    createPayment,
    setPayments,
    setConfig,
  };
}
