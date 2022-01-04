import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Navbar as Nav } from '@labmaker/ui-header';
import { Home } from '../Pages/Home/home';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Labmaker } from '../utils/APIHandler';
import { addConfigs, setUser } from '../utils/slices/userSlice';
import { RootState } from '../store';
import { Discord } from '../Pages/Discord/discord';
const StyledApp = styled.div`
  background-color: ${(p) => p.theme.base.backCol};
  height: 1080px;
  color: ${(p) => p.theme.text};
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
            user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
              : 'https://i.imgur.com/yrZKnwI.png'
          }
        />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/discord" exact component={Discord}></Route>
        </Switch>
      </StyledApp>
    );
  }
}

export default App;
