
import { RealExamClient } from '../RealExamClient'; // Adjusted path
import practiceQuestionsData from '@/data/practice-questions.json';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';
import type { ExamCategoryType } from '@/lib/types';
import { notFound } from 'next/navigation';

const VALID_CATEGORIES: ExamCategoryType[] = ['A', 'B', 'K', 'Mixed'];

interface RealExamPageProps {
  params: { category: ExamCategoryType };
}

function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'Category A (Motorcycle)';
    case 'B': return 'Category B (Car/Jeep/Van)';
    case 'K': return 'Category K (Scooter)';
    case 'Mixed': return 'Mixed Categories';
    default: return 'Exam';
  }
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: RealExamPageProps): Promise<Metadata> {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    return {
      title: `Exam Category Not Found | ${SITE_NAME}`,
    }
  }

  const categoryDisplayName = getCategoryDisplayName(category);
  const pageUrl = `${SITE_URL}/real-exam/${category}`;

  return {
    title: `Real Exam Simulation - ${categoryDisplayName} | ${SITE_NAME}`,
    description: `Take a timed Real Exam Simulation for ${categoryDisplayName} on ${SITE_NAME}. Test your knowledge under official Nepal Driving License Likhit exam conditions. 25 questions, 25 minutes.`,
    keywords: [`Nepal driving license real exam ${category}`, `Likhit exam ${category}`, `driving test Nepal ${category}`, `real exam simulation ${SITE_NAME}`, `practice test ${category}`],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Real Exam - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `Experience the official Likhit exam conditions for ${categoryDisplayName}.`,
      url: pageUrl,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Real Exam - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `Test your readiness for the ${categoryDisplayName} Likhit exam.`,
    },
  };
}

export default async function RealExamCategoryPage({ params }: RealExamPageProps) {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const categoryDisplayName = getCategoryDisplayName(category);

  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Real Exam: {categoryDisplayName}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Test your knowledge under official exam conditions. 25 questions, 25 minutes.
            </p>
        </header>
        <RealExamClient allQuestions={practiceQuestionsData} initialCategory={category} />
    </div>
  );
}
