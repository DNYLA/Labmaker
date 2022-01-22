// import { getUser, setToken } from '../api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUser, setToken } from '../../utils/api';
import {
  getTickets,
  getUser,
  getUserTickets,
  setToken,
  TicketDto,
  UserDto,
} from '@labmaker/wrapper';
import { RootState } from '../../store';
import { setUser } from '../slices/userSlice';

export function useFetchTickets() {
  const [tickets, setTickets] = useState<TicketDto[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.id === '-1') return setError(true);
    const id = process.env.NX_SERVER_ID;
    if (!id) throw Error('Unable to find Discord ID');

    setLoading(true);
    getUserTickets(id)
      .then(({ data }) => {
        setTickets(data);
      })
      .catch((err) => setError(err))
      .finally(() => setTimeout(() => setLoading(false), 1000));
  }, [user]);

  return { tickets, loading, error };
}
