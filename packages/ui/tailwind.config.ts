import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/config-tailwind';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [sharedConfig],
};

export default config;
