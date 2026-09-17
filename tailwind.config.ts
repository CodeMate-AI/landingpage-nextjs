import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1025px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      spacing: {
        '6.5': '1.625rem',
        '14.5': '3.625rem',
        '15': '3.75rem',
        '16.5': '4.125rem',
        '17': '4.25rem',
        '17.5': '4.375rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '43': '10.75rem',
        '50': '12.5rem',
        '52.5': '13.125rem',
        '65': '16.25rem',
        '75': '18.75rem',
        '75.5': '18.875rem',
        '95': '23.75rem',
        '97.5': '24.375rem',
        '120': '30rem',
        '130': '32.5rem',
        '340': '85rem',
      },
      lineHeight: {
        '5.25': '1.3125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '12.5': '3.125rem',
        '13': '3.25rem',
      },
      zIndex: {
        '100': '100',
      },
      fontFamily: {
        heading: ['"Forma DJR Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        marquee: 'marquee var(--duration) infinite linear',
        shine: 'shine var(--duration) infinite linear',
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      colors: {
        'accent-blue': '#0A5BDF',
        'accent-hover': '#084CB8',
        navy: '#1a1a1a',
        'menu-text': '#3d3d3d',
        'light-blue': '#f7f7f9',
        'pale-blue': '#f5f5f5',
        'gray-text': '#485571',
        divider: '#e0e0e0',
        'divider-light': '#d3d2d2',
        clipPath: {
          'slash-cut': 'polygon(100% 0%, 100% 50%, 0 100%, 0 0%)'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

