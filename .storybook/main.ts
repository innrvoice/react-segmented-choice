import type { StorybookConfig } from '@storybook/react-vite';

const allStories = ['../src/stories/**/*.stories.{ts,tsx}'];
const publicStories = [
  '../src/stories/showcase/**/*.stories.{ts,tsx}',
  '../src/stories/basics/**/*.stories.{ts,tsx}',
  '../src/stories/architecture/**/*.stories.{ts,tsx}',
  '../src/stories/customization/**/*.stories.{ts,tsx}',
];

const config: StorybookConfig = {
  stories: (_stories, { configType }) => (configType === 'PRODUCTION' ? publicStories : allStories),
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  features: {
    sidebarOnboardingChecklist: false,
  },
};

export default config;
