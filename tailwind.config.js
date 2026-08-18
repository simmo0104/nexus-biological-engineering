/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy foundation
        void: '#050A14',
        abyss: '#080E1A',
        depth: '#0C1525',
        surface: '#111C2E',
        // Teal / biological signal
        signal: '#1B7B6E',
        'signal-light': '#2BA898',
        'signal-muted': '#124F47',
        // Muted emerald
        growth: '#1E5C3E',
        'growth-light': '#2E8A5E',
        // Subtle cyan
        pulse: '#4ECDC4',
        'pulse-dim': '#2A8A84',
        // Warm biological accent
        amber: '#C4813A',
        'amber-dim': '#8A5728',
        // Typography
        'ink-primary': '#EDF2F7',
        'ink-secondary': '#94A3B8',
        'ink-tertiary': '#64748B',
        'ink-accent': '#A8D5CF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest: '0.25em',
        'ultra-wide': '0.35em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
