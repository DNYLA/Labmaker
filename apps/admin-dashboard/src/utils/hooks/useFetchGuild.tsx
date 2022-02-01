import { Item } from '@labmaker/ui';
import { getGuildData } from '@labmaker/wrapper';
import { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setGuild } from '../slices/configSlices';
import { toast } from 'react-toastify';
import { parseChannels, parseRoles } from '../helpers';
import { ChannelType } from '@labmaker/shared';

export function useFetchGuild() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [categories, setCategories] = useState<Item[]>([]);
  const [textChannels, setTextChannels] = useState<Item[]>([]);
  const [roles, setRoles] = useState<Item[]>([]);

  const guildConfig = useSelector((state: RootState) => state.guild.config);
  const payments = useSelector((state: RootState) => state.guild.payments);
  const user = useSelector((state: RootState) => state.user.value);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id === '-1') return;
    setLoading(true);
    if (!id) return;

    getGuildData(id)
      .then(({ data }) => {
        dispatch(setGuild(data));
        if (!data.roles || !data.channels) return;
        setRoles(parseRoles(data.roles));
        setTextChannels(parseChannels(data.channels, ChannelType.GUILD_TEXT));
        setCategories(parseChannels(data.channels, ChannelType.GUILD_CATEGORY));
      })
      .catch((err) => {
        toast.error('Error loading Guild Config.');
        navigate('/discord');
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [id, dispatch, navigate, user.id]);

  return {
    guildConfig,
    categories,
    textChannels,
    roles,
    payments,
    loading,
  };
}
