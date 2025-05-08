
import { RealExamClient } from '../RealExamClient';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';
import type { ExamCategoryType, Question as AppQuestionType } from '@/lib/types';
import { notFound } from 'next/navigation';

import akQuestionsData from '@/data/ak.json';
import trafficQuestionsData from '@/data/trafficqn.json';

const VALID_CATEGORIES: ExamCategoryType[] = ['A', 'B', 'Mixed', 'Traffic']; // K removed

interface RealExamPageProps {
  params: { category: ExamCategoryType };
}

function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'Category A (Bike/Scooter)'; // Updated
    case 'B': return 'Category B (Car/Jeep/Van)';
    case 'Traffic': return 'Traffic Signs';
    case 'Mixed': return 'Mixed Exam';
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
  const keywords = [
    `Nepal driving license real exam ${categoryDisplayName}`, 
    `Likhit exam ${categoryDisplayName}`, 
    `Nepal driving test ${categoryDisplayName}`, 
    `real exam simulation ${SITE_NAME}`, 
    `practice test ${categoryDisplayName}`,
    ...(category === 'A' ? ['bike license Nepal', 'scooter license Nepal'] : []),
    ...(category === 'B' ? ['car license Nepal'] : [])
  ];


  return {
    title: `Real Exam Simulation - ${categoryDisplayName} | ${SITE_NAME}`,
    description: `Take a timed real exam simulation for ${categoryDisplayName} on ${SITE_NAME}. Test your knowledge under official Nepal driving license Likhit exam conditions. 25 questions, 25 minutes.`,
    keywords: keywords,
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
      description: `Test your preparation for the ${categoryDisplayName} Likhit exam.`,
    },
  };
}

export default async function RealExamCategoryPage({ params }: RealExamPageProps) {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  let rawQuestions: any[] = [];

  // Category 'A' now handles both Bike and Scooter questions from ak.json
  if (category === 'A' || category === 'B') { 
    const categorySpecificQuestions = (akQuestionsData.questions || []).filter(q => q.category === category);
    rawQuestions.push(...categorySpecificQuestions);
  } else if (category === 'Traffic') {
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Mixed') {
    // For mixed, include all questions from ak.json (which now contains A and B)
    rawQuestions.push(...(akQuestionsData.questions || [])); 
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  }
  
  const allQuestions: AppQuestionType[] = rawQuestions
    .filter(q => q && q.n && q.category && Array.isArray(q.a4) && q.a4.length > 0 && typeof q.an === 'string')
    .map((q: any) => ({
      id: q.n, 
      n: q.n,
      category: q.category as 'A' | 'B' | 'Traffic', // Cast to narrower type
      qn: q.qn,
      imageUrl: q.imageUrl,
      a4: q.a4 as string[], 
      an: q.an as string,   
    }));

  const isCategoryBComingSoon = category === 'B' && allQuestions.filter(q => q.category === 'B').length === 0;
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
        <RealExamClient
            allQuestions={allQuestions}
            initialCategory={category}
            isCategoryBComingSoon={isCategoryBComingSoon}
        />
    </div>
  );
}
