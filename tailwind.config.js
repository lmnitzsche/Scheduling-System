/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quest-primary': '#8B5CF6',
        'quest-secondary': '#06B6D4',
        'quest-accent': '#F59E0B',
        'quest-success': '#10B981',
        'quest-danger': '#EF4444',
        'quest-warning': '#F59E0B',
        'quest-dark': '#1F2937',
        'quest-darker': '#111827',
        'neon-green': '#39FF14',
        'neon-blue': '#00BFFF',
        'neon-pink': '#FF1493',
        'retro-orange': '#FF6B35',
      },
      fontFamily: {
        'pixel': ['monospace'],
        'game': ['Georgia', 'serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'levelup': 'levelup 0.6s ease-out',
        'coin-flip': 'coin-flip 0.8s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        levelup: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'coin-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      boxShadow: {
        'neon': '0 0 20px theme(colors.neon-green)',
        'neon-blue': '0 0 20px theme(colors.neon-blue)',
        'neon-pink': '0 0 20px theme(colors.neon-pink)',
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}