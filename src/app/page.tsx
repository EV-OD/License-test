
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SITE_NAME, KEY_FEATURES, TESTIMONIALS_DATA, ADDITIONAL_RESOURCES, APP_DOWNLOAD_LINKS } from '@/lib/constants';
import { ClipboardCheck, Download, ArrowRight, Apple } from 'lucide-react'; 


export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          {/* Decorative background elements can be added here */}
        </div>
        <div className="container relative text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Ace Your Nepal Driving</span>
            <span className="block text-primary">License Test</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Master the Likhit exam with interactive quizzes, traffic sign tutorials, and real-time mock tests. For both Car & Bike.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/real-exam"> 
                <ClipboardCheck className="mr-2 h-5 w-5" /> 
                Start Real Exam 
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="#download-app">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose {SITE_NAME}?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to pass your Likhit exam with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {KEY_FEATURES.map((feature) => (
              <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold pt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hear From Our Successful Users</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Thousands have passed their exam using {SITE_NAME}.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS_DATA.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col justify-between shadow-lg">
                <CardContent className="pt-6">
                  <blockquote className="text-lg text-foreground italic">"{testimonial.quote}"</blockquote>
                </CardContent>
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatarImage} alt={testimonial.name} data-ai-hint="person face" />
                      <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-md font-semibold">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore More Resources</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Helpful guides and information to support your preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {ADDITIONAL_RESOURCES.map((resource) => (
              <Card key={resource.title} className="group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="bg-primary/10 p-2 rounded-full">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                    <CardTitle className="text-xl font-semibold">{resource.title}</CardTitle>
                  </div>
                   <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0 group-hover:text-primary">
                    <Link href={resource.href}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support Callout */}
       <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Need Help?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg">
            Have questions or need assistance with your preparation? Our team is here to support you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/faq">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section id="download-app" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-secondary/30 p-8 md:p-16 rounded-xl shadow-xl">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Prepare On-The-Go!
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Download our mobile application for offline access, progress tracking, and all features in your pocket. Available on Google Play Store and Apple App Store.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="text-lg px-6 py-4">
                  <Link href={APP_DOWNLOAD_LINKS.googlePlay} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18C5.34315 18 4 16.6569 4 15V9C4 7.34315 5.34315 6 7 6H17C18.6569 6 20 7.34315 20 9V15C20 16.6569 18.6569 18 17 18H7ZM6 15C6 15.5523 6.44772 16 7 16H17C17.5523 16 18 15.5523 18 15V9C18 8.44772 17.5523 8 17 8H7C6.44772 8 6 8.44772 6 9V15ZM15 12L10 14.5V9.5L15 12Z" /></svg>
                    Google Play
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-6 py-4">
                  <Link href={APP_DOWNLOAD_LINKS.appleStore} target="_blank" rel="noopener noreferrer">
                    <Apple className="mr-2 h-6 w-6" />
                    App Store
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Image 
                src="https://picsum.photos/seed/appmockup/400/500" 
                alt={`${SITE_NAME} Mobile App Mockup`}
                width={300} 
                height={375}
                className="rounded-lg shadow-2xl object-cover"
                data-ai-hint="mobile app mockup"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
