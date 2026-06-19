'use client'
import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-DN8FPWQKRZ`}
        onError={(err) => {
          console.warn("GTM script failed to load:", err);
        }}
      />
      <Script strategy="lazyOnload" id="gtm-init">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DN8FPWQKRZ', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
