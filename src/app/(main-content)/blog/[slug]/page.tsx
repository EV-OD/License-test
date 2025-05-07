
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MarkdownContent from '@/components/shared/MarkdownContent';
import GoogleAd from '@/components/ads/GoogleAd'; // Added import

// Placeholder blog posts data - in a real app, this would come from a CMS or markdown files
const blogPostsData = [
  {
    slug: "top-10-tips",
    title: "Top 10 Tips to Pass the Likhit Exam",
    date: "2024-07-28",
    excerpt: "Master the Nepal driving license written test with these essential tips and strategies. From study techniques to exam day advice, we've got you covered.",
    image: "https://picsum.photos/seed/blog1/800/400",
    dataAiHint: "study books notes",
    category: "Exam Preparation",
    content: `
Passing the Likhit (written) exam is the first crucial step towards getting your driving license in Nepal. While it might seem daunting, with the right preparation, you can ace it on your first try. Here are our top 10 tips:

### 1. Understand the Syllabus Thoroughly
Familiarize yourself with all the topics covered in the exam. This usually includes traffic rules, road signs, vehicle mechanics, and first aid. Knowing what to expect is half the battle.

### 2. Study the Official Materials
The Department of Transport Management (DoTM) often provides official handbooks or materials. These are your primary source of information. Make sure to study them carefully.

### 3. Master Traffic Signs
Traffic signs are a significant portion of the exam. Use our [interactive traffic sign tutorials](/traffic-signs) to learn them visually and by meaning. Don't just memorize; understand their purpose.

### 4. Take Regular Practice Tests
Consistent practice is key. Utilize platforms like ours that offer [practice questions](/practice) and [mock exams](/mock-exam). This helps you get used to the question format and time constraints.

### 5. Analyze Your Mistakes
When you get a question wrong in a practice test, don't just move on. Understand why you made the mistake. This is crucial for learning and improvement.

### 6. Time Management
During mock exams, practice managing your time effectively. Don't spend too long on a single question. If you're unsure, mark it and come back later if time permits.

### 7. Stay Updated
Traffic rules and regulations can sometimes be updated. Ensure you are aware of any recent changes. Our platform strives to keep content current.

### 8. Group Study (Optional)
Discussing difficult topics with friends or fellow applicants can provide new perspectives and help solidify your understanding.

### 9. Stay Calm on Exam Day
Get a good night's sleep before the exam. Arrive at the test center early. Read each question carefully before answering. Stay calm and focused.

### 10. Read Instructions Carefully
Before starting the exam, read all instructions provided by the invigilators or on the exam paper itself. Misunderstanding instructions can lead to unnecessary errors.

By following these tips and dedicating sufficient time to your studies, you'll significantly increase your chances of passing the Nepal driving license Likhit exam. Good luck!
    `,
  },
   {
    slug: "common-mistakes",
    title: "Common Mistakes to Avoid in Your Driving Test",
    date: "2024-07-20",
    excerpt: "Learn about the frequent errors candidates make during the practical driving test in Nepal and how to steer clear of them for a successful outcome.",
    image: "https://picsum.photos/seed/blog2/800/400",
    dataAiHint: "car driving lesson",
    category: "Driving Tips",
    content: `
The practical driving test, or "trial," is often the most nerve-wracking part of getting a driving license in Nepal. While practice is essential, knowing common pitfalls can also help you prepare better. Here are some frequent mistakes to avoid:

### 1. Poor Observation
Failing to check mirrors (rear-view and side mirrors) regularly, especially before changing lanes, turning, or stopping. Also, not checking blind spots is a major error.

### 2. Incorrect Use of Signals
Signaling too late, too early, or not at all. Ensure your signals accurately reflect your intentions and are given in good time.

### 3. Speed Control Issues
Driving too fast for the conditions or too slowly, impeding traffic flow. Maintain appropriate speed according to speed limits and road/traffic situations.

### 4. Steering Control Problems
Over-steering, under-steering, or jerky movements. Aim for smooth and controlled steering, especially during turns and maneuvers like the "8" shape.

### 5. Difficulty with Maneuvers
Struggling with specific trial components like the figure "8", u-turn, incline start (ukalo), or parking. Practice these maneuvers extensively until you are confident.

### 6. Not Following Traffic Signs or Markings
Ignoring stop signs, lane discipline, or other road markings. This shows a lack of understanding of basic traffic rules.

### 7. Hesitation or Lack of Confidence
Being overly cautious can be as problematic as being reckless. Examiners look for confident, decisive driving. Hesitation at junctions, for example, can be marked down.

### 8. Poor Clutch Control (for manual vehicles)
Stalling the vehicle, especially on an incline, or jerky gear changes due to improper clutch use.

### 9. Incorrect Positioning on the Road
Driving too close to the curb, too far into the center of the road, or incorrect positioning for turns.

### 10. Panicking Under Pressure
Letting nerves get the better of you. Try to stay calm, breathe, and focus on one step at a time. If you make a small mistake, don't dwell on it; focus on recovering and driving safely.

Remember, the driving test assesses your ability to control the vehicle safely and follow traffic rules. Practice, awareness of these common mistakes, and a calm demeanor will significantly improve your chances of success. Good luck with your trial!
    `,
  },
  {
    slug: "understanding-nepali-traffic-rules",
    title: "Understanding Nepali Traffic Rules: A Comprehensive Guide",
    date: "2024-07-15",
    excerpt: "A deep dive into the essential traffic laws and regulations in Nepal that every driver must know. Stay safe and legal on the roads.",
    image: "https://picsum.photos/seed/blog3/800/400",
    dataAiHint: "traffic rules city",
    category: "Traffic Rules",
    content: `
Navigating the roads of Nepal requires a solid understanding of its traffic rules. This guide provides an overview of key regulations to help you drive safely and legally.

### General Rules of the Road

*   **Keep Left:** In Nepal, traffic keeps to the left side of the road.
*   **Overtaking:** Overtake from the right, ensuring the way is clear. Do not overtake on bends, junctions, or when visibility is poor.
*   **Speed Limits:** Adhere to posted speed limits. General limits may apply in areas without specific signage (e.g., 40 km/h in urban areas, 80 km/h on highways, but always check local signs).
*   **Seatbelts:** Compulsory for drivers and front-seat passengers in cars.
*   **Helmets:** Compulsory for both rider and pillion passenger on motorcycles and scooters.

### Traffic Signals

*   **Red Light:** Stop before the stop line. Do not proceed until the light turns green.
*   **Yellow (Amber) Light:** Prepare to stop. If you are too close to stop safely when it appears, you may proceed with caution.
*   **Green Light:** Proceed if the way is clear.

### Priority at Junctions

*   **Roundabouts:** Give way to traffic approaching from your right already in the roundabout.
*   **Uncontrolled Junctions:** Give way to traffic on the major road, or if roads are of equal importance, typically to traffic from your right (local practices can vary, be cautious).
*   **Pedestrian Crossings:** Give way to pedestrians on or about to step onto a pedestrian crossing.

### Parking Regulations

*   Do not park where 'No Parking' signs are displayed.
*   Avoid parking on bends, near junctions, on bridges, or where your vehicle may obstruct traffic or pedestrians.
*   Park on the left side of the road, in the direction of traffic flow.

### Documents to Carry

*   Valid Driving License
*   Vehicle Registration Certificate (Blue Book)
*   Vehicle Tax Receipt (paid up to date)
*   Third-Party Insurance Certificate

### Prohibitions

*   **Driving under the influence (DUI):** Strictly prohibited. Zero tolerance for alcohol.
*   **Using mobile phones:** Not allowed while driving, unless using a hands-free system.
*   **Overloading:** Do not exceed the vehicle's permitted carrying capacity for passengers or goods.

This is not an exhaustive list. Always refer to official publications from the Department of Transport Management (DoTM) for the most current and complete information. Drive defensively and prioritize safety.
    `,
  }
];


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPostsData.find(p => p.slug === params.slug);
  if (!post) {
    return {
      title: `Post Not Found | ${SITE_NAME}`,
      description: "The blog post you are looking for could not be found.",
    };
  }
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      images: [{ url: post.image }],
    },
  };
}

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPostsData.find(p => p.slug === params.slug);

  const adClient = "YOUR_ADSENSE_CLIENT_ID";
  const adSlotSide1 = "YOUR_AD_SLOT_ID_BLOG_SIDE_1";
  const adSlotSide2 = "YOUR_AD_SLOT_ID_BLOG_SIDE_2";
  const adSlotBottom = "YOUR_AD_SLOT_ID_BLOG_BOTTOM";

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        {/* Left Side Ad (Desktop) */}
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotSide1}
            adFormat="auto"
            responsive={true}
            className="min-h-[250px] w-full sticky top-20" // Added sticky for better visibility
          />
        </aside>

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
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                    data-ai-hint={post.dataAiHint} 
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
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotSide2}
            adFormat="auto"
            responsive={true}
            className="min-h-[250px] w-full sticky top-20" // Added sticky for better visibility
          />
           <GoogleAd // Optional: Second ad in right sidebar
            adClient={adClient}
            adSlot={adSlotSide2 + "_alt"} // Ensure unique slot or use same if design allows
            adFormat="auto"
            responsive={true}
            className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]" // Adjust top based on first ad and spacing
          />
        </aside>
      </div>

      {/* Bottom Ad (Mobile) */}
      <div className="lg:hidden mt-8 w-full">
        <GoogleAd
          adClient={adClient}
          adSlot={adSlotBottom}
          adFormat="auto"
          responsive={true}
          className="min-h-[100px] w-full"
        />
      </div>
    </div>
  );
}
