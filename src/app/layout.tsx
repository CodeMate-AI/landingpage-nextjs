
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});


export const metadata: Metadata = {
  title: "CodeMate AI | Your Professional and Secured AI Pair Programmer",
  description: "Code 10x faster as CodeMate search, navigate and understand complex codebases for you.",
  alternates: {
    canonical: "https://codemate.ai",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "CodeMate AI | Your Professional and Secured AI Pair Programmer",
    description: "Code 10x faster as CodeMate search, navigate and understand complex codebases for you.",
    url: "https://codemate.ai",
    siteName: "CodeMate AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMate AI | Your Professional and Secured AI Pair Programmer",
    description: "Code 10x faster as CodeMate search, navigate and understand complex codebases for you.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <head>
        <title>CodeMate AI | Your Professional And Secured AI Pair Programmer</title>
      </head>
      <body
        className={`${montserrat.className} antialiased bg-zinc-950 text-white dark`}
      >
        {children}
      </body>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-DN8FPWQKRZ`}
      />
      <Script strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DN8FPWQKRZ', {
          page_path: window.location.pathname,
          });
        `}
      </Script>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "CodeMate AI",
            description:
              "Code 10x faster as CodeMate search, navigate and understand complex codebases for you.",
            operatingSystem: ["Web", "iOS", "Android", "Windows", "MacOS", "Linux", "VS Code Extension"],
          }),
        }}
      />

    </html>
  );
}

