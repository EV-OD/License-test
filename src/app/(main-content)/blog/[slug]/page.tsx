
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MarkdownContent from '@/components/shared/MarkdownContent';
import GoogleAd from '@/components/ads/GoogleAd';
import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import SeoSchema from '@/components/shared/SeoSchema';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostData(params.slug);
  if (!post) {
    return {
      title: `Post Not Found | ${SITE_NAME}`,
      description: "The blog post you are looking for could not be found.",
    };
  }
  
  const postUrl = `${SITE_URL}/blog/${params.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      // If modifiedTime is available in your frontmatter, add it here
      // modifiedTime: new Date(post.modifiedDate).toISOString(), 
      authors: [SITE_NAME], // Or specific author if available
      images: [
        { 
          url: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`, // Ensure absolute URL
          alt: post.title,
          width: 800, // Provide image dimensions if known
          height: 400,
        }
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`], // Ensure absolute URL
       // creator: '@YourTwitterHandle', // Add your Twitter handle
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_BLOG_POST_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_BLOG_POST_SIDE_2;
  const adSlotSide3 = process.env.NEXT_PUBLIC_AD_SLOT_BLOG_POST_SIDE_3;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_BLOG_POST_BOTTOM_MOBILE;


  return (
    <>
      <SeoSchema blogPost={post} />
      <div className="container py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
          {/* Left Side Ad (Desktop) */}
          {adClient && adSlotSide1 && (
            <aside className="hidden lg:block w-48 space-y-6 shrink-0">
              <GoogleAd
                adClient={adClient}
                adSlot={adSlotSide1}
                adFormat="auto"
                responsive={true}
                className="min-h-[250px] w-full sticky top-20"
              />
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-grow max-w-3xl w-full">
            <article>
              <header className="mb-8">
                <Button asChild variant="ghost" className="mb-6 pl-0 text-primary hover:bg-transparent">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                  </Link>
                </Button>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-3">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4" />
                    <time dateTime={new Date(post.date).toISOString()}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1.5 h-4 w-4" />
                    <span>{post.category}</span>
                  </div>
                </div>
                {post.image && (
                  <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg mb-8">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                      priority
                      data-ai-hint={post.dataAiHint || "blog header image"} 
                    />
                  </div>
                )}
              </header>
              
              <Separator className="my-8" />

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-headings:font-semibold prose-headings:tracking-tight
                           prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-md prose-img:shadow-md"
              >
                <MarkdownContent content={post.content} />
              </div>
            </article>

            <Separator className="my-12" />

            <div className="text-center">
              <Button asChild>
                  <Link href="/practice">
                    Start Practicing Now
                  </Link>
              </Button>
            </div>
          </main>

          {/* Right Side Ad (Desktop) */}
           {adClient && (
            <aside className="hidden lg:block w-48 space-y-6 shrink-0">
              {adSlotSide2 && (
                <GoogleAd
                  adClient={adClient}
                  adSlot={adSlotSide2}
                  adFormat="auto"
                  responsive={true}
                  className="min-h-[250px] w-full sticky top-20"
                />
              )}
              {adSlotSide3 && (
                <GoogleAd 
                  adClient={adClient}
                  adSlot={adSlotSide3}
                  adFormat="auto"
                  responsive={true}
                  className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]" 
                />
              )}
            </aside>
          )}
        </div>

        {/* Bottom Ad (Mobile) */}
        {adClient && adSlotBottomMobile && (
          <div className="lg:hidden mt-8 w-full">
            <GoogleAd
              adClient={adClient}
              adSlot={adSlotBottomMobile}
              adFormat="auto"
              responsive={true}
              className="min-h-[100px] w-full"
            />
          </div>
        )}
      </div>
    </>
  );
}
