import {
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { lightPalette } from "@/system/theme/palette";
import { typography } from "@/system/tokens/typography";
import { components } from "@/system/theme//components";


// declare module '@mui/material/styles' {
//   interface Palette {
//     custom: Palette['primary'];
//   }

//   interface PaletteOptions {
//     custom?: PaletteOptions['primary'];
//   }
// }


const theme = responsiveFontSizes(createTheme({
  palette: lightPalette,
  typography,
  components,
  shape: {
    borderRadius: 1
  },
  spacing: 8,
}));
// theme = responsiveFontSizes(theme);

export default theme;
export type AppTheme = typeof theme;
