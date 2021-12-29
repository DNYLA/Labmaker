type Theme = {
  base?: any;
  text?: any;
  height?: any;
  padding?: any;
};

export const DarkTheme: Theme = {
  base: {
    menu: "#1A1A1D",
    menuHover: "#2f3136",
    content: "#202225", //141617
    container: "#202225",
    //36393F
  },
  text: {
    main: "#FFF",
  },
  height: {
    topContent: "85px",
  },
  padding: {
    content: "20px 0px",
  },
};

export const DefaultTheme: Theme = {
  base: {
    menu: "#202225", //1A1A1D
    menuHover: "#2f3136",
    content: "#141617",
    container: "#161c1f", //6F2232
    //36393F
  },
  text: {
    main: "#FFF",
  },
  height: {
    topContent: "85px",
  },
  padding: {
    content: "20px 0px",
  },
};
