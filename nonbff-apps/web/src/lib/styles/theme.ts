import { createTheme as createMaterialTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';




const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#153131',
      contrastText: '#153131',
      light: '#4f7b7b',
      dark: '#0b1f1f',
    },
    secondary: {
      main: '#FF784F',
      light: '#4f7b7b',
      dark: '#0b1f1f',
      contrastText: '#153131',
    },
    tertiary: {
      main: '#220C10',
    },
    error: {
      main: "#ff1744",
      light: '#4f7b7b',
      dark: '#0b1f1f',
      contrastText: '#153131',
    },
    nav: {
      main: 'rgba(186, 255, 201, 1)'
    },
    tagChip: {
      main: 'rgba(180, 233, 169, 1)',
      contrastText: '#153131',
    },
    categoryChip: {
      main: 'rgba(255, 184, 79, 1)',
      contrastText: '#153131',
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
