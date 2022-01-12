import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner, Navbar as Nav } from '@labmaker/ui-header';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Labmaker, LabmakerSocket, InitSocket } from '../utils/APIHandler';

import { addConfigs, setUser } from '../utils/slices/userSlice';
import { RootState } from '../store';
import { Discord } from '../Pages/Discord/discord';
import { Home } from '../Pages/Home/Home';
import { Logs } from '../Pages/Logs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledApp = styled.div`
  /* background-color: ${(p) => p.theme.base.backCol};
  color: ${(p) => p.theme.text}; */
`;

export function App() {
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.value);

  const dispatch = useDispatch();

  const items = [
    {
      name: 'Home',
      to: '/',
    },
    { name: 'Discord' },
    { name: 'Logs' },
  ];

  //Fetches User from API
  const fetchUser = useCallback(async () => {
    const result = await Labmaker.refreshAccesToken();
    console.log(result);
    if (!result.ok) {
      setLoginFailed(true);
    } else {
      const user = await Labmaker.User.getUser();
      console.log(user);
      dispatch(setUser(user));
      if (user.nodes.length > 0) {
        dispatch(addConfigs(user.nodes));
      }
      InitSocket(Labmaker.accessToken);
      // LabmakerSocket.listen(Labmaker.accessToken);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loginFailed) {
    window.location.href = Labmaker.loginURL();
  }

  //Usually Spinner is included under StyledApp however dont want to show navigation until logged in.
  if (isLoading)
    return (
      <div>
        <LoadingSpinner loading={isLoading} message={'Logging In...'} />
      </div>
    );

  return (
    <StyledApp>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Nav
        title={'LABMAKER '}
        items={items}
        avatarUrl={
          user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
            : 'https://i.imgur.com/yrZKnwI.png'
        }
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discord" element={<Discord />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
