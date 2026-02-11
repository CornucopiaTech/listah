import { createTheme as createMaterialTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';




const theme: ThemeOptions = {
  palette: {
    primary: {
      // main: 'rgba(21, 49, 49, 0.03)', //Deep Green
      main: '#153131', //Deep Green
      // main: blueGrey[50],
      contrastText: '#153131',
      light: '#4f7b7b',
      dark: '#0b1f1f',
    },
    secondary: {
      main: '#FF784F', //Bright Orange
      light: '#4f7b7b',
      dark: '#0b1f1f',
      contrastText: '#153131',
    },
    tertiary: {
      main: '#220C10', //Deep Brown
      // light: '#4f7b7b',
      // dark: '#0b1f1f',
    },
    error: {
      main: "#ff1744",
      light: '#4f7b7b',
      dark: '#0b1f1f',
      contrastText: '#153131',
    },
    nav: {
      main: 'rgba(186, 255, 201, 1)' //'rgba(21, 49, 49, 0.1)',
      // light: '#4f7b7b',
      // dark: '#0b1f1f',
    },
    tagChip: {
      main: 'rgba(180, 233, 169, 1)', //'rgb(180, 233, 169)',
      contrastText: '#153131', //'#f9fafaff',
      // light: '#4f7b7b',
      // dark: '#0b1f1f',
    },
    categoryChip: {
      main: 'rgba(255, 184, 79, 1)', //'rgb(251, 247, 189)', //'#e83904ff',
      contrastText: '#153131', //'#f9fafaff',
    },
    containedButton: {
      main: '#153131',
      contrastText: '#f9fafaff',
    }
  }
} as ThemeOptions


// Create a theme instance.
export const materialTheme = createMaterialTheme(theme);

export type AppTheme = typeof materialTheme;
