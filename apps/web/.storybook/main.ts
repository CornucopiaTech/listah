// import type { StorybookConfig } from '@storybook/react-vite';

// const config: StorybookConfig = {
//   // ...
//   framework: '@storybook/react-vite', // 👈 Add this
// };

// export default config;


// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
});
