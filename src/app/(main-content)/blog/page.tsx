
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rss } from 'lucide-react';
import Image from 'next/image';
import GoogleAd from '@/components/ads/GoogleAd';
import { getSortedPostsData, type BlogPost } from '@/lib/blog';

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description: `Tips, guides, and updates related to Nepal's driving license tests and road safety.`,
};

export default function BlogPage() {
  const blogPosts: BlogPost[] = getSortedPostsData();

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotBottom = process.env.NEXT_PUBLIC_AD_SLOT_BLOG_LIST_BOTTOM;

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {SITE_NAME} Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your source for tips, guides, and updates on Nepal driving license tests and road safety.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-56 w-full">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={post.dataAiHint || "blog image"} 
                />
              </div>
            </Link>
            <CardHeader>
              <p className="text-sm text-primary font-medium mb-1">{post.category}</p>
              <Link href={`/blog/${post.slug}`}>
                <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">{post.title}</CardTitle>
              </Link>
              <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="px-0 text-primary">
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {blogPosts.length === 0 && (
        <div className="text-center py-16">
          <Rss className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Blog Posts Yet</h2>
          <p className="text-muted-foreground mt-2">Check back soon for helpful articles and updates!</p>
        </div>
      )}

      {/* Ad Unit Section */}
      {adClient && adSlotBottom && (
        <div className="mt-12 w-full">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotBottom}
            adFormat="auto"
            responsive={true}
            className="min-h-[100px] w-full"
          />
        </div>
      )}
    </div>
  );
}
