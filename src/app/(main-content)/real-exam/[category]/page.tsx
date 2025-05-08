
import { RealExamClient } from '../RealExamClient';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';
import type { ExamCategoryType, Question as AppQuestionType } from '@/lib/types';
import { notFound } from 'next/navigation';

import akQuestionsData from '@/data/ak.json';
import trafficQuestionsData from '@/data/trafficqn.json';

const VALID_CATEGORIES: ExamCategoryType[] = ['A', 'B', 'K', 'Mixed', 'Traffic'];

interface RealExamPageProps {
  params: { category: ExamCategoryType };
}

// Returns English display names for categories
function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'Category A (Motorcycle)';
    case 'B': return 'Category B (Car/Jeep/Van)';
    case 'K': return 'Category K (Scooter)';
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

  return {
    title: `Real Exam Simulation - ${categoryDisplayName} | ${SITE_NAME}`,
    description: `Take a timed real exam simulation for ${categoryDisplayName} on ${SITE_NAME}. Test your knowledge under official Nepal driving license Likhit exam conditions. 25 questions, 25 minutes.`,
    keywords: [`Nepal driving license real exam ${category}`, `Likhit exam ${category}`, `Nepal driving test ${category}`, `real exam simulation ${SITE_NAME}`, `practice test ${category}`],
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

  if (category === 'A' || category === 'K' || category === 'B') { 
    const categorySpecificQuestions = (akQuestionsData.questions || []).filter(q => q.category === category);
    rawQuestions.push(...categorySpecificQuestions);
  } else if (category === 'Traffic') {
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Mixed') {
    rawQuestions.push(...(akQuestionsData.questions || [])); 
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  }
  
  const allQuestions: AppQuestionType[] = rawQuestions
    .filter(q => q && q.n && q.category && Array.isArray(q.a4) && q.a4.length > 0 && typeof q.an === 'string')
    .map((q: any) => ({
      id: q.n, 
      n: q.n,
      category: q.category as ExamCategoryType, 
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
