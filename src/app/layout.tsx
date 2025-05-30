
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/mono'; // Removed due to "Module not found" error
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE_URL, SITE_LOGO_URL } from '@/lib/constants';
import MobileBackButtonHandler from '@/components/shared/MobileBackButtonHandler';
// import { Analytics } from "@vercel/analytics/next" // Commented out to fix module not found error
const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
  keywords: ['Nepal driving license', 'Likhit exam', 'driving test Nepal', 'practice questions', 'real exam', 'traffic signs Nepal', 'vehicle license Nepal', 'Category A license', 'Category B license', 'bike license Nepal', 'scooter license Nepal'],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#3498db', 
  openGraph: {
    title: {
        default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
    url: siteUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Driving License Preparation`,
      },
    ],
    locale: 'en_US', 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Ace your Nepal driving license (Likhit) test for car & bike/scooter (Category A, B) with ${SITE_NAME}. Free online practice questions, realistic real exam simulations, traffic sign tutorials, and more. Start preparing today!`,
    images: [DEFAULT_OG_IMAGE_URL], 
  },
  robots: { 
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: `${siteUrl}/manifest.json`, 
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  other: { 
    'msapplication-TileColor': '#3498db', 
    'msapplication-tap-highlight': 'no',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isProduction = process.env.NODE_ENV === 'production';
  const showAds = isProduction && adSenseClientId && adSenseClientId !== "ca-pub-0000000000000000" && adSenseClientId !== "YOUR_ADSENSE_CLIENT_ID";

  return (
    <html lang="en" className={`${GeistSans.variable} font-sans`} suppressHydrationWarning>
      {showAds && (
         <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
         crossOrigin="anonymous" strategy="lazyOnload" />
      )}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-YFT5GSJYRX"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YFT5GSJYRX');
        `}
      </Script>
      <body className="antialiased bg-background text-foreground">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <MobileBackButtonHandler />
          {/* <Analytics/> */} {/* Commented out to fix module not found error */}
      </body>
    </html>
  );
}
