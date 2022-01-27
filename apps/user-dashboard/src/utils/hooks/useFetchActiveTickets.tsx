// import { getUser, setToken } from '../api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveTickets, getTickets } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { PartialTicket, Tickets } from '@labmaker/shared';

//Fetches Active Server Tickets
export function useFetchActiveTickets() {
  const [tickets, setTickets] = useState<PartialTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.id === '-1') return setError(true);
    const id = process.env.NX_SERVER_ID;
    if (!id) throw Error('Unable to find Discord ID');

    setLoading(true);
    getActiveTickets(id)
      .then(({ data }) => {
        setTickets(data);
      })
      .catch((err) => setError(err))
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [user, refresh]);

  return { tickets, loading, setRefresh, refresh, error };
}
