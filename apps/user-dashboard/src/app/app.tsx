import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Navbar as Nav } from '@labmaker/ui-header';
import { Home } from '../Pages/Home/home';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Labmaker } from '../utils/APIHandler';
import { addConfigs, setUser } from '../utils/slices/userSlice';
const StyledApp = styled.div`
  background-color: ${(p) => p.theme.base.backCol};
  height: 1080px;
  color: ${(p) => p.theme.text};
`;

export function App() {
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const items = [
    {
      name: 'Home',
      to: '/',
    },
    { name: 'Discord' },
    { name: 'Logs' },
  ];

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

      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loginFailed) {
    window.location.href = Labmaker.loginURL();
  }

  if (isLoading) {
    //Update With Spinner
    return <div>Loading User</div>;
  } else {
    return (
      <StyledApp>
        <Nav
          title={'LABMAKER'}
          items={items}
          avatarUrl={
            'https://cdn.discordapp.com/avatars/827212859447705610/3b000789b7b21736d58db29c923c0020.png?size=1024'
          }
        />
        <Switch>
          <Route path="/" exact component={Home}></Route>
        </Switch>
      </StyledApp>
    );
  }
}

export default App;
