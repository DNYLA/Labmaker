import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '@labmaker/ui';
import { routes } from '../utils/routes';
import { Tickets } from '../Pages/Tickets';
import { Tutor } from '../Pages/Tutor';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
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
      <Navbar
        title={'LABMAKER'}
        items={routes}
        avatarUrl={
          'https://i.imgur.com/yrZKnwI.png'
          // user.avatar
          //   ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
          //   : 'https://i.imgur.com/yrZKnwI.png'
        }
      />
      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/tutor" element={<Tutor />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
