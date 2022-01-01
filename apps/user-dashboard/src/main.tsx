import { DarkTheme } from 'apps/user-dashboard/src/assets/Themes';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import App from './app/app';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={DarkTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
