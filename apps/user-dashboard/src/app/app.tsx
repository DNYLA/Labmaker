import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';
import { Navbar as Nav } from '@labmaker/ui-header';
import { InputBox } from '@labmaker/ui-inputs';
const StyledApp = styled.div`
  // Your style here
  background-color: ${(p) => p.theme.base.backCol};
  height: 1080px;
`;

export function App() {
  const items = [
    {
      name: 'Home',
      to: '/',
    },
    { name: 'Discord' },
    { name: 'Logs' },
  ];

  return (
    <StyledApp>
      <Nav
        title={'LABMAKER'}
        items={items}
        avatarUrl={
          'https://cdn.discordapp.com/avatars/827212859447705610/3b000789b7b21736d58db29c923c0020.png?size=1024'
        }
      />
      <InputBox
        message={'Name'}
        value={''}
        onChange={() => console.log('hi')}
      />
    </StyledApp>
  );
}

export default App;
