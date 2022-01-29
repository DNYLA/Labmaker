import { getGuilds } from '@labmaker/wrapper';
import { setParsedGuilds } from '../slices/configSlices';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseGuilds } from '../helpers';
import { RootState } from '../../store';
import { PartialGuild } from '@labmaker/shared';
import { Item } from '@labmaker/ui';

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuild[]>();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.id === '-1') return;
    setloading(true);
    getGuilds()
      .then(({ data }) => {
        setGuilds(data);
        dispatch(setParsedGuilds(parseGuilds(data)));
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setloading(false));
  }, [dispatch, user.id]);

  return { guilds, loading, error };
}
