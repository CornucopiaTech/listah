import {
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { lightPalette } from "@/system/theme/palette";
import { typography } from "@/system/tokens/typography";
import { components } from "@/system/theme//components";


const theme = responsiveFontSizes(createTheme(
  {
    // @ts-ignore
    "palette": lightPalette,
    // @ts-ignore
    typography,
    "shape": {
      "borderRadius": 1
    },
    // @ts-ignore
    components,
  }
));


export default theme;
export type AppTheme = typeof theme;
