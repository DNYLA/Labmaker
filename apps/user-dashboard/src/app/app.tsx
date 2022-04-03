import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner, LoginPage, Navbar } from '@labmaker/ui';
import { tutorRoutes, studentRoutes } from '../utils/routes';
import { Tickets } from '../Pages/Tickets';
import { Tutor } from '../Pages/Tutor';
import { useFetchUser } from '../utils/hooks/useFetchUser';
import { CreateTicketPage } from '../Pages/Tickets/create-ticket';
import { UserRole } from '@labmaker/wrapper';
import { ApplyTutorPage } from '../Pages/Tutor/apply';

const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
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
              <>
                <Route path="/create" element={<CreateTicketPage />} />
                <Route path="/apply" element={<ApplyTutorPage />} />
              </>
            )}
          </Routes>
        </>
      )}

      {error && (
        <Routes>
          {/* If not logged in, all routes will shown login page */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      )}
    </StyledApp>
  );
}

export default App;
