// import { getUser, setToken } from '../api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { Tickets } from '@labmaker/shared';

export function useFetchTickets() {
  const [tickets, setTickets] = useState<Tickets>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.id === '-1') return setError(true);
    const id = process.env.NX_SERVER_ID;
    if (!id) throw Error('Unable to find Discord ID');

    setLoading(true);
    getTickets(id)
      .then(({ data }) => {
        setTickets(data);
      })
      .catch((err) => setError(err))
      .finally(() => setTimeout(() => setLoading(false), 1000));
  }, [user]);

  return { tickets, loading, error };
}
