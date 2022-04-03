import { DarkTheme } from '@labmaker/ui';
import { setBaseURL } from '@labmaker/wrapper';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import '../../../libs/ui/src/norm.css';
import App from './app/app';
import { Provider } from 'react-redux';
import { store } from './store';

const apiURL = process.env.NX_API_URL;
if (!apiURL) throw Error('Invalid API URL');
setBaseURL(apiURL); //Not Really sure where the best place to put this is but this seems like a suitable place since

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={DarkTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
