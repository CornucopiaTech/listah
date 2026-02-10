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
      main: 'rgba(21, 49, 49, 0.05)',
      // light: '#4f7b7b',
      // dark: '#0b1f1f',
    },
    tagChip: {
      main: '#153131',
      contrastText: '#f9fafaff',
      // light: '#4f7b7b',
      // dark: '#0b1f1f',
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
} as ThemeOptions


// Create a theme instance.
export const materialTheme = createMaterialTheme(theme);

export type AppTheme = typeof materialTheme;
