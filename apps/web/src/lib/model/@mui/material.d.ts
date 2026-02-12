import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: {
      main: string;
    },
    error: {
      main: string;
    },
    nav: {
      main: string;
    },
    tagChip: {
      main: string;
      contrastText: string;
    },
    categoryChip: {
      main: string;
      contrastText: string;
    },
    containedButton: {
      main: string;
      contrastText: string;
    }
  }
  interface PaletteOptions {
    tertiary?: {
      main: string;
    },
    error?: {
      main: string;
    },
    nav?: {
      main: string;
    },
    tagChip?: {
      main: string;
      contrastText: string;
    },
    categoryChip?: {
      main: string;
      contrastText: string;
    },
    containedButton?: {
      main: string;
      contrastText: string;
    }
  }
};


// declare module "@mui/material/Button" {
//   interface ButtonPropsColorOverrides {
//     myAwesomeColor: true;
//   }
// }
