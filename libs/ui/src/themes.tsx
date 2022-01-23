import 'styled-components';
import { DefaultTheme } from 'styled-components';

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
  range: {
    upperCol: string;
    lowerCol: string;
    thumbCol: string;
    thumbHover: string;
    upperBackground: string;
    lowerBackground: string;
  };

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
    base: '#202225',
    item: '#8d8d8e',
    active: '#FFF',
    title: '#ff9929',
    titleHover: '#ffaf29',
  },
  input: {
    range: {
      upperCol: '#141617',
      lowerCol: '#ff9929',
      thumbCol: '#8d8d8e',
      thumbHover: '#8d8d8e',
      upperBackground: `linear-gradient(to bottom, #141617, #141617) 100% 50% / 100% 16px no-repeat transparent`,
      lowerBackground: `linear-gradient(to bottom, #ff9929, #ff9929) 100% 50% / 100% 16px no-repeat transparent`,
    },
    backCol: '#141617',
    borderCol: '#141617',
    activeCol: '#161819',
    text: '#EEE',
    switchActive: '#ff9929',
  },
  text: '#EEE',
};

// export const TestTheme: DefaultTheme = {
//   base: {
//     backCol: '#1A1A1D',
//   },
//   navbar: {
//     base: '#4E4E50',
//     item: '#8d8d8e',
//     active: '#FFF',
//     title: '#ff9929',
//     titleHover: '#ffaf29',
//   },
//   input: {
//     backCol: '#2B2B2B',
//     borderCol: '#2B2B2B',
//     activeCol: '#2B2B2B',
//     text: '#EDEDED',
//     switchActive: '#ff9929',
//   },
//   text: '#EDEDED',
// };

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    navbar: Navbar;
    base: Base;
    input: Input;
    text?: string;
    height?: string;
    padding?: string;
  }
}
