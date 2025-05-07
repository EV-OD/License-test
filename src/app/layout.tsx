import type { Metadata } from 'next';
import { GeistSans } from 'geist/sans';
import { GeistMono } from 'geist/mono';
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
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', // Replace with actual site URL
    siteName: SITE_NAME,
    // images: [ // Add a default OG image later
    //   {
    //     url: '/og-image.png', // Replace with actual image path
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US', // Can be dynamic with ne_NP based on context later if needed
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}: Car & Bike Practice Exams`,
    description: "Prepare for Nepal's car and bike driving license tests with free online practice questions, mock exams, traffic signs, and bilingual support.",
    // images: ['/twitter-image.png'], // Replace with actual image path
  },
  // viewport: 'width=device-width, initial-scale=1', // Next.js handles this by default
  // icons: { // Favicon can be added later
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
