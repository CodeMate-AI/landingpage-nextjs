import { Montserrat, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

// Forma DJR Display local font configuration with preloading and fallback metrics
export const formaDJRDisplay = localFont({
  src: '../app/fonts/formadjrdisplay-regular.woff2',
  variable: '--font-forma-djr',
  weight: '400',
  style: 'normal',
  display: 'swap',
});
