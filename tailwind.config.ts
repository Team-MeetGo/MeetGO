import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-to-review': 'linear-gradient(90deg, rgba(208,161,255,1) 35%, rgba(174,226,255,1) 100%)',
        'gradient-to-main': 'linear-gradient(180deg, rgba(255,202,220,1) 0%, rgba(196,191,255,1) 100%)',
        'gradient-to-main2': 'linear-gradient(90deg, rgba(199,140,234,1) 0%, rgba(133,87,252,1) 100%)'
      },
      colors: {
        mainColor: '#7238D2',
        secondMainColor: '#6758FF',
        purpleSecondary: '#F2EAFA',
        purpleThird: '#E4D4F4',
        gray1: '#D4D4D8',
        gray2: '#6B7280',
        gray3: '#595757',
        gray4: '#F8F8F8',
        grayBlack: '#111827',
        hotPink: '#F31260',
        blue: '#006FEE',
        lightPurple: '#D0A1FF',
        lightBlue: '#AEE2FF',
        borderSecondary: '#E2E2E2',
        boxSecondary: '#F9FAFB',
        requiredRed: '#F43F5E'
      },
      animation: { 'slideTop-animation': 'sildeTop 3s linear' },
      keyframes: {
        slideTop: {
          from: { top: '-150px' },
          to: { top: '0px' }
        }
      },
      fontSize: {
        '2xs': '0.7rem'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
export default config;
