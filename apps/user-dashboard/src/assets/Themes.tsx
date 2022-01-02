interface Navbar {
  base: string;
  item: string;
  active: string;
  title: string;
  titleHover: string;
}

interface Base {
  backCol: string;
}

interface Input {
  borderCol: string;
  backCol: string;
  activeCol: string;
  text: string;
  switchActive?: string;
}

export const DarkTheme: DefaultTheme = {
  base: {
    backCol: '#202225',
  },
  navbar: {
    base: '#1A1A1D',
    item: '#8d8d8e',
    active: '#FFF',
    title: '#ff9929',
    titleHover: '#ffaf29',
  },
  input: {
    backCol: '#141617',
    borderCol: '#141617',
    activeCol: '#3B3B3B',
    text: '#EEE',
    switchActive: '#ff9929',
  },
  text: '#EEE',
  // text: {
  //   main: '#FFF',
  // },
  // height: {
  //   topContent: '85px',
  // },
  // padding: {
  //   content: '20px 0px',
  // },
};

export const TestTheme: DefaultTheme = {
  base: {
    backCol: '#1A1A1D',
  },
  navbar: {
    base: '#4E4E50',
    item: '#8d8d8e',
    active: '#FFF',
    title: '#ff9929',
    titleHover: '#ffaf29',
  },
  input: {
    backCol: '#2B2B2B',
    borderCol: '#2B2B2B',
    activeCol: '#2B2B2B',
    text: '#EDEDED',
    switchActive: '#ff9929',
  },
  text: '#EDEDED',
  // text: {
  //   main: '#FFF',
  // },
  // height: {
  //   topContent: '85px',
  // },
  // padding: {
  //   content: '20px 0px',
  // },
};

import 'styled-components';
import { DefaultTheme } from 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    navbar: Navbar;
    base: Base;
    input: Input;
    text?: any;
    height?: any;
    padding?: any;
  }
}
