import { useEffect, useState } from 'react';
import { Menu } from './components/Menu';
import { Discord } from './pages/Discord/Discord';
import { Route, Switch } from 'react-router-dom';
import { Logs } from './pages/Logs';
import { Labmaker } from './utils/APIHandler';
import { Spinner } from './components/Spinner';
import { useDispatch } from 'react-redux';
import { updateUser } from './utils/slices/userSlice';
import { Home } from './pages/Home/Home';
import { updateReddit } from './utils/slices/configSlices';

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    Labmaker.refreshAccesToken().then((result) => {
      console.log(result.accessToken);
      if (!result.ok) {
        setLoggedIn(false);
      } else {
        Labmaker.User.getUser().then((userDetails) => {
          dispatch(updateUser(userDetails));
          if (userDetails.nodes.length > 0) {
            dispatch(updateReddit(userDetails.nodes[0]));
          }

          setLoading(false);
        });
      }
    });
  }, [dispatch]);

  if (!loggedIn) {
    window.location.href = Labmaker.loginURL();
  }

  if (loading)
    return (
      <div>
        <Spinner loading={loading} message={'Logging In...'} />
      </div>
    );

  return (
    <div className="App">
      <Menu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/discord">
          <Discord />
        </Route>
        <Route path="/logs">
          <Logs />
        </Route>
        {/* <Route path="/homeNew" exact component={Discord2} /> */}
      </Switch>
    </div>
  );
}

export default App;
