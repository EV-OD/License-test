
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
import MobileBackButtonHandler from '@/components/shared/MobileBackButtonHandler';

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
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#3498db', // Match primary color from globals.css & manifest
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
  other: { // For MS specific PWA tags not covered by browserconfig.xml or manifest
    'msapplication-TileColor': '#3498db', // Match theme
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
      {/* 
        The <head> tag is managed by Next.js based on the metadata export.
        Do not add a manual <head> tag here.
        The AdSense Script component will be placed correctly by Next.js based on its strategy.
        PWA meta tags are now part of the `metadata` object above.
      */}
      {showAds && (
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5479646105292963"
     crossOrigin="anonymous"></script>
      )}
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
