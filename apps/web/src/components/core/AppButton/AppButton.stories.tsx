// // Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
// import type { Meta, StoryObj } from '@storybook/react-vite';

// import { AppButton } from './AppButton';

// const meta = {
//   component: AppButton,
// } satisfies Meta<typeof AppButton>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const Primary: Story = {
//   args: {
//     // primary: true,
//     label: 'AppButton',
//   },
// };


import preview from '@/../.storybook/preview';

import { AppButton } from './AppButton';

const meta = preview.meta({
  component: AppButton,
});

export const Primary = meta.story({
  args: {
    primary: true,
    label: 'Button',
  },
});
