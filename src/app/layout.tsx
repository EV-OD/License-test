
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/mono'; // Removed due to "Module not found" error
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME}: Car & Bike Practice Exams`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Prepare for Nepal's car and bike driving license tests with free online practice questions, mock exams, traffic signs, and bilingual support.",
  keywords: ['Nepal driving license', 'Likhit exam', 'driving test practice', 'traffic signs Nepal', 'vehicle license Nepal'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: `${SITE_NAME}: Car & Bike Practice Exams`,
    description: "Prepare for Nepal's car and bike driving license tests with free online practice questions, mock exams, traffic signs, and bilingual support.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', 
    siteName: SITE_NAME,
    // images: [ // Add a default OG image later
    //   {
    //     url: '/og-image.png', // Replace with actual image path
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US', 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}: Car & Bike Practice Exams`,
    description: "Prepare for Nepal's car and bike driving license tests with free online practice questions, mock exams, traffic signs, and bilingual support.",
    // images: ['/twitter-image.png'], // Replace with actual image path
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
      </head>
      <body className="antialiased bg-background text-foreground">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
