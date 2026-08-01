import type { Config } from 'tailwindcss';
import sharedConfig from '@floodguard/config/tailwind';

const config: Config = {
  presets: [sharedConfig],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
