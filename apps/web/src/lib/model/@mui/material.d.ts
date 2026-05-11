import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    muted: Palette['primary'];
  }
  interface PaletteOptions {
    muted?: Palette['primary'];
  }
};
