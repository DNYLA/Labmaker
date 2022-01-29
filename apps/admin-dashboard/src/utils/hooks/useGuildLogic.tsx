import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { updateGuildConfig, updatePayments } from '@labmaker/wrapper';
import {
  setConfig as setConfigState,
  setPayments as setPaymentsState,
} from '../slices/configSlices';
import { GuildConfig, Payment } from '@labmaker/shared';

export function useGuildLogic() {
  const dispatch = useDispatch();
  const { config, payments, channels, roles, parsedGuilds } = useSelector(
    (state: RootState) => state.guild
  );

  const saveData = async () => {
    if (!config) return;
    try {
      updateGuildConfig(config);
      if (payments.length === 0) return;
      await updatePayments(payments);
    } catch (err) {
      console.log(err);
    }
  };

  const createPayment = () => {
    if (!config) return;

    const newPayment: Payment = {
      id: Math.random(), //This gets overridden on Server-Side (Create new DTOS for items yet to be created)
      name: 'Payment Name',
      value: 'Payment Value',
      type: 'FIAT',
      serverId: config.id,
      newPayment: true,
    };
    const _payments = [...payments];
    _payments.push(newPayment);
    setPayments(_payments);
  };

  const onConfigIdChanged = async (serverId: string | number) => {
    if (typeof serverId === 'number') return; //This will never happen however typescript requires i check
    setConfig({ ...config, paymentConfigId: serverId });
  };

  const setPayments = (payments: Payment[]) =>
    dispatch(setPaymentsState(payments));
  const setConfig = (config: GuildConfig) => dispatch(setConfigState(config));

  return {
    config,
    payments,
    parsedGuilds,
    onConfigIdChanged,
    saveData,
    createPayment,
    setPayments,
    setConfig,
  };
}
