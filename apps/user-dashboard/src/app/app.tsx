import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner, LoginPage, Navbar } from '@labmaker/ui';
import { tutorRoutes, studentRoutes } from '../utils/routes';
import { Tickets } from '../Pages/Tickets';
import { Tutor } from '../Pages/Tutor';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { CreateTicketPage } from '../Pages/Tickets/create-ticket';
import { UserRole } from '@labmaker/wrapper';

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
            items={user.role === UserRole.USER ? studentRoutes : tutorRoutes}
            avatarUrl={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
                : 'https://cdn.discordapp.com/embed/avatars/0.png'
            }
          />
          <Routes>
            <Route path="/" element={<Tickets />} />
            <Route path="/tutor" element={<Tutor />} />
            {user.role !== UserRole.TUTOR && (
              <Route path="/create" element={<CreateTicketPage />} />
            )}
          </Routes>
        </>
      )}
      {error && (
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      )}
    </StyledApp>
  );
}

export default App;
