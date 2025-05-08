
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Bike as MotorcycleIcon, Car } from 'lucide-react';
import type { ExamCategoryType } from '@/lib/types';

const pageUrl = `${SITE_URL}/practice`;

export const metadata: Metadata = {
  title: `Select Practice Test Category | ${SITE_NAME}`,
  description: `Choose your driving license category (A for Bike/Scooter, B for Car/Jeep/Van) to start a comprehensive practice test on ${SITE_NAME}. Covers all questions with pagination.`,
  keywords: ['Nepal driving license practice test', 'Likhit exam practice category', 'Nepal driving test A', 'Nepal driving test B', `${SITE_NAME} practice questions`],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Select Practice Test Category | ${SITE_NAME}`,
    description: `Choose your driving license category for a comprehensive Likhit exam practice.`,
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Select Practice Test Category | ${SITE_NAME}`,
    description: `Select your category and start practicing for the Likhit exam.`,
  },
};

interface PracticeCategoryDetail {
  type: 'A' | 'B'; // Only A and B for now
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  comingSoon?: boolean;
}

const PRACTICE_CATEGORIES_CONFIG: PracticeCategoryDetail[] = [
  {
    type: 'A',
    name: 'Category A (Bike/Scooter)',
    description: 'Comprehensive practice for all Category A (motorcycle, scooter) textual questions and all traffic sign questions.',
    icon: MotorcycleIcon,
    href: '/practice/A/1', // Link to the first page
  },
  {
    type: 'B',
    name: 'Category B (Car/Jeep/Van)',
    description: 'Comprehensive practice for all Category B (car, jeep, van) textual questions and all traffic sign questions. (Category B questions coming soon)',
    icon: Car,
    href: '/practice/B/1', // Link to the first page
    comingSoon: true, // Mark B as coming soon for now
  },
];

export default function SelectPracticeCategoryPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Practice Test Category
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select the vehicle category for your practice test. Each category includes all relevant textual questions and all traffic sign questions, presented in paginated sets.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto">
        {PRACTICE_CATEGORIES_CONFIG.map((category) => (
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
              <Button asChild className="w-full" disabled={category.comingSoon}>
                <Link href={category.href}>
                  Start Practice Test
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
