import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner, LoginPage, Navbar } from '@labmaker/ui';
import { routes } from '../utils/routes';
import { Tickets } from '../Pages/Tickets';
import { Tutor } from '../Pages/Tutor';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { CreateTicketPage } from '../Pages/Tickets/create-ticket';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  const { user, loading, error } = useFetchUser();
  if (loading)
    return (
      <div>
        <LoadingSpinner loading={loading} message={'Logging In...'} />
      </div>
    );
  console.log(user);

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

      {user && !error && (
        <>
          <Navbar
            title={'LABMAKER'}
            items={routes}
            avatarUrl={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
                : 'https://i.imgur.com/yrZKnwI.png'
            }
          />
          <Routes>
            <Route path="/" element={<Tickets />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/create" element={<CreateTicketPage />} />
          </Routes>
        </>
      )}
      {error && (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create" element={<CreateTicketPage />} />
        </Routes>
      )}
    </StyledApp>
  );
}

export default App;
