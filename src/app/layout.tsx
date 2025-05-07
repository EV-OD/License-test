
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/mono'; // Removed due to "Module not found" error
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE_URL, SITE_LOGO_URL } from '@/lib/constants';
import MobileBackButtonHandler from '@/components/shared/MobileBackButtonHandler'; // Added import

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Ace your Nepal driving license (Likhit) test for car & bike (Category A, B, K) with ${SITE_NAME}. Free online practice questions, realistic mock exams, traffic sign tutorials, and bilingual support (English/Nepali). Start preparing today!`,
  keywords: ['Nepal driving license', 'Likhit exam', 'driving test Nepal', 'practice questions', 'mock exam', 'traffic signs Nepal', 'vehicle license Nepal', 'Category A license', 'Category B license', 'Category K license', 'नेपाल ड्राइभिङ लाइसेन्स', 'लिखित परीक्षा'],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: {
        default: `${SITE_NAME}: Nepal Driving License Practice Exams (Likhit)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: `Ace your Nepal driving license (Likhit) test for car & bike (Category A, B, K) with ${SITE_NAME}. Free online practice questions, realistic mock exams, traffic sign tutorials, and bilingual support (English/Nepali). Start preparing today!`,
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
    description: `Ace your Nepal driving license (Likhit) test for car & bike (Category A, B, K) with ${SITE_NAME}. Free online practice questions, realistic mock exams, traffic sign tutorials, and bilingual support (English/Nepali). Start preparing today!`,
    images: [DEFAULT_OG_IMAGE_URL], 
    // creator: `@YourTwitterHandle`, // Optional: Add your Twitter handle
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
  // alternates: { // If you have multiple languages for the same page
  //   languages: {
  //     'en-US': `${siteUrl}/en`,
  //     'ne-NP': `${siteUrl}/np`,
  //   },
  // },
  // Add manifest for PWA capabilities, which can also be used by Capacitor
  manifest: `${siteUrl}/manifest.json`, 
  // Add icons for favicons and app icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' }, // Example SVG icon
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' }, // Example Apple touch icon
    ],
  },
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
      <head>
        {showAds && (
           <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
        {/* Basic PWA meta tags, can be expanded in manifest.json */}
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" /> {/* Example color */}
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ffffff" /> {/* Example theme color */}

      </head>
      <body className="antialiased bg-background text-foreground">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <MobileBackButtonHandler />
        </LanguageProvider>
      </body>
    </html>
  );
}
