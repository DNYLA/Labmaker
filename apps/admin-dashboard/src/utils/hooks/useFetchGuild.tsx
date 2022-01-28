import { Item } from '@labmaker/ui';
import { getGuildDetails } from '@labmaker/wrapper';
import { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setGuild } from '../slices/configSlices';
import { toast } from 'react-toastify';

export function useFetchGuild() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parsedGuilds, setParsedGuilds] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const guildConfig = useSelector((state: RootState) => state.guild.config);
  const payments = useSelector((state: RootState) => state.guild.payments);
  const user = useSelector((state: RootState) => state.user.value);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id === '-1') return;
    setLoading(true);
    if (!id) return;

    getGuildDetails(id)
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
  }, [id, dispatch, navigate, user.id]);

  return {
    guildConfig,
    parsedGuilds,
    payments,
    loading,
  };
}
