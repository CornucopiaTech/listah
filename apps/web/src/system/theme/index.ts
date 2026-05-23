import {
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { lightPalette } from "@/system/theme/palette";
import { typography } from "@/system/tokens/typography";
import { components } from "@/system/theme//components";


// const theme = responsiveFontSizes(createTheme({
//   palette: lightPalette,
//   typography,
//   components,
//   shape: {
//     borderRadius: 1
//   },
//   spacing: 8,
// }));
// // theme = responsiveFontSizes(theme);

const theme = responsiveFontSizes(createTheme(
  {
    "palette": lightPalette,
    typography,
    "shape": {
      "borderRadius": 1
    },
    components,
  }
));


export default theme;
export type AppTheme = typeof theme;
