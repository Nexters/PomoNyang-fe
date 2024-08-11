/** @type {import('tailwindcss').Config} */

const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAF6F3',
    100: '#F3EEEB',
    200: '#DFD8D2',
    300: '#B8AFA8',
    400: '#A39A93',
    500: '#8F867E',
    600: '#665E57',
    700: '#524A44',
    800: '#3D3732',
    900: '#292621',
  },
  orange: {
    50: '#FFF2E6',
    100: '#FFDBBA',
    200: '#FFC48E',
    300: '#FFAD62',
    400: '#FF9636',
    500: '#F47A0A',
    600: '#CB6100',
    700: '#A24E00',
    800: '#7A3A00',
    900: '#512700',
  },
  red: {
    50: '#FFEBE7',
    100: '#FFC7BC',
    200: '#FFA290',
    300: '#FF7E65',
    400: '#FF5A3A',
    500: '#FE360F',
    600: '#D52300',
    700: '#AC1C00',
    800: '#841600',
    900: '#5B0F00',
  },
};

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        pretendard: ['Pretendard Variable', 'sans-serif'],
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 32,
      },
      borderRadius: {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
      },
      colors: {
        // 자동 생성
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // 커스텀
        background: {
          primary: colors.gray[50],
          secondary: colors.gray[100],
          tertiary: colors.gray[400],
          inverse: colors.gray[900],
          accent: {
            1: colors.orange[500],
            2: colors.orange[50],
          },
          hover: {
            primary: colors.orange[600],
          },
          pressed: {
            primary: colors.orange[700],
          },
        },

        text: {
          primary: colors.gray[800],
          secondary: colors.gray[600],
          tertiary: colors.gray[500],
          disabled: colors.gray[300],
          inverse: colors.white,
          accent: {
            1: colors.orange[500],
          },
        },

        icon: {
          primary: colors.gray[700],
          secondary: colors.gray[500],
          tertiary: colors.gray[300],
          disabled: colors.gray[200],
          inverse: colors.white,
        },

        accent: {
          red: colors.red[300],
        },

        ...colors,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      screens: {
        'h-sm': { raw: '(max-height: 640px)' },
        'h-md': { raw: '(min-height: 641px) and (max-height: 740px)' },
        'h-lg': { raw: '(min-height: 741px) and (max-height: 810px)' },
        'h-xl': { raw: '(min-height: 810px)' },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
