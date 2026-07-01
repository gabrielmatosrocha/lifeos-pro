import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lifeos: {
          dark: '#0F172A',
          blue: '#2563EB',
          green: '#22C55E',
          amber: '#F59E0B',
          red: '#EF4444',
          background: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}

export default config
