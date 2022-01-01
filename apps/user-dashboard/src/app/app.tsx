import styled from 'styled-components';

import { Route, Link } from 'react-router-dom';
import Navbar from 'apps/user-dashboard/src/components/Navbar';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <Navbar />
    </StyledApp>
  );
}

export default App;
