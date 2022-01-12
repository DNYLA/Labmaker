import { getUser, setToken } from '../api';
import { User } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../slices/userSlice';
import { InitSocket } from '../APIHandler';

export function useFetchUser() {
  // const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setToken().then((token) => {
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }
      console.log(token);

      getUser()
        .then(({ data }) => {
          // setUser(data);
          dispatch(setUser(data));
          InitSocket(token);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        })
        .finally(() => setTimeout(() => setLoading(false), 1000));
    });
  }, [dispatch]);

  return { user, loading, error };
}
