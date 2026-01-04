import { createTheme as createMaterialTheme } from '@mui/material/styles';
import { blueGrey, deepOrange, red, teal } from '@mui/material/colors';
import { createTheme as createMantineTheme, MantineProvider } from '@mantine/core';

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
      main: 'rgba(21, 49, 49, 0.05)'
    },
    tagChip: {
      main: '#153131',
      contrastText: '#f9fafaff',
    },
    categoryChip: {
      main: '#e83904ff',
      contrastText: '#f9fafaff',
    },
    containedButton: {
      main: '#153131',
      contrastText: '#f9fafaff',
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
export const materialTheme = createMaterialTheme(theme);
export const mantineTheme = createMantineTheme(theme);
