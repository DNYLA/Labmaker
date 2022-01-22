// import { getUser, setToken } from '../api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUser, setToken } from '../../utils/api';
import { getUser, setToken, UserDto } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { setUser } from '../slices/userSlice';

export function useFetchUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setToken().then((token) => {
      if (!token) {
        setLoading(false);
        setError(true);
        console.log('no token');
        return;
      }

      getUser()
        .then(({ data }) => {
          dispatch(setUser(data));
          // InitSocket(token);
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
