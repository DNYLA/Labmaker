// import { getUser, setToken } from '../api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUser, setToken } from '../../utils/api';
import { getUser, setToken, UserDto } from '@labmaker/wrapper';

export function useFetchUser() {
  const [user, setUser] = useState<UserDto>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const user = useSelector((state: RootState) => state.user.value);

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
          setUser(data);
          // InitSocket(token);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        })
        .finally(() => setTimeout(() => setLoading(false), 1000));
    });
  }, []);

  return { user, loading, error };
}
