import { getGuilds, PartialGuild } from '@labmaker/wrapper';
import { useEffect, useState } from 'react';

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuild[]>();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setloading(true);
    getGuilds()
      .then(({ data }) => {
        setGuilds(data);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setloading(false));
  }, []);

  return { guilds, loading, error };
}
