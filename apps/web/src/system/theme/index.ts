import { createTheme } from "@mui/material/styles";
import { lightPalette }from "@/system/theme/palette";
import {typography} from "@/system/tokens/typography";
import {components} from "@/system/theme//components";


// declare module '@mui/material/styles' {
//   interface Palette {
//     custom: Palette['primary'];
//   }

//   interface PaletteOptions {
//     custom?: PaletteOptions['primary'];
//   }
// }


const theme = createTheme({
  palette: lightPalette,
  typography,
  shadows: [
    "none",
    "0px 2px 6px rgba(0,0,0,0.05)",
    "0px 4px 12px rgba(0,0,0,0.06)",
    "0px 6px 18px rgba(0,0,0,0.08)",
    ...Array(21).fill("none") // keep unused shadows simple
  ],
  components,
  shape: {
    borderRadius: 1
  },
});

export default theme;
export type AppTheme = typeof theme;
