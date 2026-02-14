// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import { definePreview } from '@storybook/react-vite';
import addonA11y from '@storybook/addon-a11y';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider, } from '@mui/material/styles';
// import { ThemeProvider } from 'styled-components';
// import theme from "../src/system/theme";



export default definePreview({
  // 👇 Add your addons here
  addons: [addonA11y()],
  parameters: {
    // type-safe!
    a11y: {
      options: { xpath: true },
    },
  },
  // decorators: [
  //   (Story) => (
  //     <ThemeProvider theme= "default" >
  //     {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */ }
  //     < Story />
  //     </ThemeProvider>
  //   ),
  // ],
});
