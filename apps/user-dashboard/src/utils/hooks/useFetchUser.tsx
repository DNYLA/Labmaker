// import { getUser, setToken } from '../api';
import { User } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../slices/userSlice';
import { InitSocket, Labmaker } from '../APIHandler';
// import { getUser, setToken } from '../../utils/api';
import { getUser, setToken } from '@labmaker/wrapper';

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

      Labmaker.setAccessToken(token);
      getUser()
        .then(({ data }) => {
          dispatch(setUser(data));
          InitSocket(token);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        })
        .finally(() => setTimeout(() => setLoading(false), 1000));
    });
  }, [dispatch]);

  return { user, loading, error };
}
