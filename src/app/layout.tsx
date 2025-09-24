
import "./globals.css";
import type { Metadata } from "next";


import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});


export const metadata: Metadata = {
  title: "CodeMate AI | Your Professional And Secured AI Pair Programmer",
  description: "This is my Next.js app",
  icons: {
    icon: "/Union.svg", // path relative to public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en" className="">
      <head>
        <title>CodeMate AI | Your Professional And Secured AI Pair Programmer</title>
      </head>
      <body
        className= {`${montserrat.className} antialiased bg-zinc-950 text-white dark`}
      >
        {children}
      </body>
    </html>
  );
}

