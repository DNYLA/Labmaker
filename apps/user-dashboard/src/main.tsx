import { DarkTheme, TestTheme } from './assets/Themes';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import './index.css';
import App from './app/app';
import { Provider } from 'react-redux';
import { store } from './store';
import { AXIOS } from '@labmaker/wrapper';

AXIOS.defaults.baseURL = 'http://localhost:3000'; //Not Really sure where the best place to put this is but this seems like a suitable place since
//it is called before anything is rendered.

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
