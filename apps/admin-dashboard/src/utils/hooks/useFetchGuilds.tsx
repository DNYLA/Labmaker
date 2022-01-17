import { getGuilds, PartialGuild } from '@labmaker/wrapper';
import { setParsedGuilds } from '../slices/configSlices';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { parseGuilds } from '../helpers';

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuild[]>();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch]);

  return { guilds, loading, error };
}
