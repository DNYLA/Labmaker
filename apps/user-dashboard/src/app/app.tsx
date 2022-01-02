import styled from 'styled-components';
import { Route, Link, Switch } from 'react-router-dom';
import { Navbar as Nav } from '@labmaker/ui-header';
import { InputBox } from '@labmaker/ui-inputs';
import { Home } from '../Pages/Home/home';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Labmaker } from 'apps/user-dashboard/src/utils/APIHandler';
import { setUser } from 'apps/user-dashboard/src/utils/slices/userSlice';
import { addRedditConfigs } from 'apps/user-dashboard/src/utils/slices/configSlices';
const StyledApp = styled.div`
  // Your style here
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

  const loadUser = async () => {
    const result = await Labmaker.refreshAccesToken();
    console.log(result);
    if (!result.ok) {
      setLoginFailed(true);
    } else {
      const user = await Labmaker.User.getUser();
      console.log(user);
      dispatch(setUser(user));
      if (user.nodes.length > 0) {
        dispatch(addRedditConfigs(user.nodes));
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const asyncLoad = async () => {
      await loadUser();
    };

    asyncLoad();

    // Labmaker.refreshAccesToken().then((result) => {
    // }
  }, []);

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
