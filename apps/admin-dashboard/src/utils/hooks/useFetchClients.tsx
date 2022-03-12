// import { getUser, setToken } from '../api';
import { User } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../slices/userSlice';
import { InitSocket } from '../APIHandler';
// import { getUser, setToken } from '../../utils/api';
import { createClient, getClients } from '@labmaker/wrapper';
import { Client } from '@labmaker/shared';

export function useFetchClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const fetchClients = useCallback(() => {
    setLoading(true);

    getClients()
      .then(({ data }) => {
        dispatch(setClients(data));
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setTimeout(() => setLoading(false), 1000));
  }, [dispatch]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleRefresh = () => {
    fetchClients();
  };

  const handleCreate = async (username: string, description: string) => {
    // await createClient({ username, description });
    console.log('New Client');
  };

  return { clients, loading, error };
}
