
import Link from 'next/link';
import { Car, Apple, ExternalLink } from 'lucide-react'; 
import { SITE_NAME, APP_DOWNLOAD_LINKS, NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Car className="h-7 w-7" />
              <span>{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Ace your Nepal driving license test with our comprehensive practice platform.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
               <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
               <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
               <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 font-semibold text-foreground">Download Our App</h3>
            <p className="text-sm text-muted-foreground mb-3">Prepare on-the-go with our mobile app.</p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button asChild variant="outline" className="w-full sm:w-auto justify-start">
                <Link href={APP_DOWNLOAD_LINKS.appleStore} target="_blank" rel="noopener noreferrer">
                  <Apple className="mr-2 h-5 w-5" />
                  App Store
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto justify-start">
                <Link href={APP_DOWNLOAD_LINKS.googlePlay} target="_blank" rel="noopener noreferrer">
                  {/* Using a generic icon as lucide-react doesn't have a Google Play specific one */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18C5.34315 18 4 16.6569 4 15V9C4 7.34315 5.34315 6 7 6H17C18.6569 6 20 7.34315 20 9V15C20 16.6569 18.6569 18 17 18H7ZM6 15C6 15.5523 6.44772 16 7 16H17C17.5523 16 18 15.5523 18 15V9C18 8.44772 17.5523 8 17 8H7C6.44772 8 6 8.44772 6 9V15ZM15 12L10 14.5V9.5L15 12Z" /></svg>
                  Google Play
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
