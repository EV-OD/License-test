
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck, Car, Bike as ScooterIcon, Layers, Bike as MotorcycleIcon } from 'lucide-react'; // Using Bike for Scooter and Motorcycle
import type { ExamCategoryType } from '@/lib/types'; // Ensure ExamCategoryType is exported

const pageUrl = `${SITE_URL}/real-exam`;

export const metadata: Metadata = {
  title: `Select Real Exam Category | ${SITE_NAME}`,
  description: `Choose your driving license category (A, B, K, or Mixed) to start a realistic Likhit exam simulation on ${SITE_NAME}.`,
  keywords: ['Nepal driving license real exam', 'Likhit exam category selection', 'driving test Nepal', 'real exam simulation category', `${SITE_NAME} exam types`],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Select Real Exam Category | ${SITE_NAME}`,
    description: `Choose your driving license category to start a realistic Likhit exam simulation.`,
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Select Real Exam Category | ${SITE_NAME}`,
    description: `Choose your driving license category for a real Likhit exam experience.`,
  },
};

interface ExamCategoryDetail {
  type: ExamCategoryType;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const EXAM_CATEGORIES_CONFIG: ExamCategoryDetail[] = [
  {
    type: 'A',
    name: 'Category A (Motorcycle)',
    description: 'Practice for your motorcycle license exam.',
    icon: MotorcycleIcon,
    href: '/real-exam/A'
  },
  {
    type: 'B',
    name: 'Category B (Car/Jeep/Van)',
    description: 'Prepare for the car, jeep, or van license exam.',
    icon: Car,
    href: '/real-exam/B'
  },
  {
    type: 'K',
    name: 'Category K (Scooter)',
    description: 'Get ready for your scooter license exam.',
    icon: ScooterIcon, // Using Bike icon for Scooter
    href: '/real-exam/K'
  },
  {
    type: 'Mixed',
    name: 'Mixed Exam (All Categories)',
    description: 'A comprehensive test covering all vehicle categories.',
    icon: Layers,
    href: '/real-exam/Mixed'
  }
];


export default function SelectRealExamCategoryPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Choose Your Real Exam Category
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select the vehicle category you want to take the real exam simulation for. Each exam has 25 questions and a 25-minute time limit.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {EXAM_CATEGORIES_CONFIG.map((category) => (
          <Card key={category.type} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4 pb-4">
              <category.icon className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{category.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={category.href}>
                  Start Exam for {category.type === 'Mixed' ? 'Mixed' : `Category ${category.type}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
