import { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|js)'],
  framework: {
    name: '@storybook/angular',
    options: {
      builder: {
        useProjectTsConfig: true,
      },
    },
  },
};

export default config;
