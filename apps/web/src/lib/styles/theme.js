import { createTheme } from '@mui/material/styles';
import { blueGrey, deepOrange, red, teal } from '@mui/material/colors';

const theme = {
  palette: {
    primary: {
      // main: 'rgba(21, 49, 49, 0.03)', //Deep Green
      main: '#153131', //Deep Green
      // main: blueGrey[50],
      contrastText: '#153131',
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
    nav: {
      main: 'rgba(21, 49, 49, 0.03)'
    },
    tagChip: {
      main: blueGrey[500],
      contrastText: blueGrey[50],
    },
    categoryChip: {
      main: deepOrange[500],
      contrastText: deepOrange[50],
    }
  }
}

// const theme = {
//   palette: {
//     primary: {
//       // main: 'rgba(21, 49, 49, 0.03)', //'#153131', //Deep Green
//       // main: '#153131', //Deep Green
//       main: teal[50],
//       contrastText: '#E2FCEF',
//     },
//     secondary: {
//       main: '#FF784F', //Bright Orange
//     },
//     tertiary: {
//       main: '#220C10', //Deep Brown
//     },
//     error: {
//       main: red.A400,
//     },
//   }
// }

// Create a theme instance.
export default createTheme(theme);
