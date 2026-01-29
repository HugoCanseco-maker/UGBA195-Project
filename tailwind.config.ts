import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bloomberg-black': '#000000',
        'bloomberg-zinc': '#09090b',
        'bloomberg-orange': '#ff9900',
        'bloomberg-green': '#00ff00',
        'bloomberg-red': '#ff4444',
        'bloomberg-gray': '#888888',
        'bloomberg-dark-gray': '#1a1a1a',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
