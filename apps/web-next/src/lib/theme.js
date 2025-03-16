import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = {
  palette: {
    primary: {
      main: '#153131', //Deep Green
      contrastText: '#E2FCEF',
    },
    secondary: {
      main: '#FF784F', //Bright Orange
    },
    tertiary: {
      main: '#220C10', //Deep Brown
    },
    error: {
      main: red.A400,
    },
  }
}

// Create a theme instance.
export default createTheme(theme);
