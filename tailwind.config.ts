import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d2d84',
          light: '#1a3a91',
          dark: '#0a2167',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'app-gradient': 'linear-gradient(to bottom right, #0d2d84, #1a1a2e)',
        'trendy-gradient': 'linear-gradient(135deg, #0d2d84 0%, #1e0f30 50%, #000000 100%)',
        'card-gradient': 'linear-gradient(to bottom, rgba(30, 15, 48, 0.7) 0%, rgba(13, 45, 132, 0.7) 100%)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [
    // @ts-ignore
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        },
        '.scrollbar-thumb-gray-500': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(100, 116, 139, 0.5)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(100, 116, 139, 0.7)',
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

export default config; 