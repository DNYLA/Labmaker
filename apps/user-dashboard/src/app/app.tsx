import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner, Navbar as Nav } from '@labmaker/ui';
import { Labmaker, LabmakerSocket, InitSocket } from '../utils/APIHandler';
import { Home } from '../Pages/Home/Home';
import { Logs } from '../Pages/Logs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { routes } from '../utils/routes';
import { GuildsMenu } from '../Pages/Discord/GuildsMenu';

const StyledApp = styled.div`
  /* background-color: ${(p) => p.theme.base.backCol};
  color: ${(p) => p.theme.text}; */
`;

export function App() {
  const { user, error, loading } = useFetchUser();

  if (error) {
    window.location.href = Labmaker.loginURL();
  }

  //Usually Spinner is included under StyledApp however dont want to show navigation until logged in.
  if (loading)
    return (
      <div>
        <LoadingSpinner loading={loading} message={'Logging In...'} />
      </div>
    );

  return (
    <StyledApp>
      {user && !error && (
        <>
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
            title={'LABMAKER'}
            items={routes}
            avatarUrl={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
                : 'https://i.imgur.com/yrZKnwI.png'
            }
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discord" element={<GuildsMenu />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </>
      )}
    </StyledApp>
  );
}

export default App;
