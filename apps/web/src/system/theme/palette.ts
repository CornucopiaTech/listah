import { colourTokens } from "@/system/tokens/colors";

export const lightPalette = {
  primary: { main: colourTokens.bg.primary, dark: "green" },
  secondary: { main: colourTokens.bg.secondary },
  background: {
    default: "purple",
    paper: colourTokens.bg.surface
  },
  text: {
    primary: colourTokens.text.primary,
    secondary: colourTokens.text.secondary
  }
};
