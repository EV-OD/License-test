
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

function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'श्रेणी A (मोटरसाइकल)';
    case 'B': return 'श्रेणी B (कार/जीप/भ्यान)';
    case 'K': return 'श्रेणी K (स्कुटर)';
    case 'Traffic': return 'ट्राफिक संकेत';
    case 'Mixed': return 'मिश्रित';
    default: return 'परीक्षा';
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
      title: `परीक्षा श्रेणी फेला परेन | ${SITE_NAME}`,
    }
  }

  const categoryDisplayName = getCategoryDisplayName(category);
  const pageUrl = `${SITE_URL}/real-exam/${category}`;

  return {
    title: `वास्तविक परीक्षा सिमुलेशन - ${categoryDisplayName} | ${SITE_NAME}`,
    description: `${SITE_NAME} मा ${categoryDisplayName} को लागि समयबद्ध वास्तविक परीक्षा सिमुलेशन लिनुहोस्। आधिकारिक नेपाल ड्राइभिङ लाइसेन्स लिखित परीक्षाको अवस्था अन्तर्गत आफ्नो ज्ञान परीक्षण गर्नुहोस्। २५ प्रश्न, २५ मिनेट।`,
    keywords: [`नेपाल ड्राइभिङ लाइसेन्स वास्तविक परीक्षा ${category}`, `लिखित परीक्षा ${category}`, `नेपाल ड्राइभिङ टेस्ट ${category}`, `वास्तविक परीक्षा सिमुलेशन ${SITE_NAME}`, `अभ्यास परीक्षा ${category}`],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `वास्तविक परीक्षा - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `${categoryDisplayName} को लागि आधिकारिक लिखित परीक्षाको अवस्था अनुभव गर्नुहोस्।`,
      url: pageUrl,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `वास्तविक परीक्षा - ${categoryDisplayName} | ${SITE_NAME}`,
      description: `${categoryDisplayName} लिखित परीक्षाको लागि आफ्नो तयारी परीक्षण गर्नुहोस्।`,
    },
  };
}

export default async function RealExamCategoryPage({ params }: RealExamPageProps) {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  let rawQuestions: any[] = [];

  // Populate rawQuestions based on the category
  if (category === 'A' || category === 'K') {
    rawQuestions.push(...(akQuestionsData.questions || []).filter(q => q.category === category));
  } else if (category === 'Traffic') {
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  } else if (category === 'Mixed') {
    rawQuestions.push(...(akQuestionsData.questions || []));
    rawQuestions.push(...(trafficQuestionsData.questions || []));
  }
  // For category 'B', rawQuestions remains empty, handled by isCategoryBComingSoon logic

  // Filter and map rawQuestions to AppQuestionType, ensuring data integrity
  const allQuestions: AppQuestionType[] = rawQuestions
    .filter(q => q && q.n && q.category && Array.isArray(q.a4) && q.a4.length > 0 && typeof q.an === 'string')
    .map((q: any) => ({
      id: q.n, // Use n as id, assuming n is unique
      n: q.n,
      category: q.category as ExamCategoryType, // Cast category
      qn: q.qn,
      imageUrl: q.imageUrl,
      a4: q.a4 as string[], // Cast a4
      an: q.an as string,   // Cast an
    }));

  // Determine if category B is "Coming Soon"
  // This specific check for 'B' might be simplified if rawQuestions for B are always empty
  const isCategoryBComingSoon = category === 'B' && allQuestions.filter(q => q.category === 'B').length === 0;
  const categoryDisplayName = getCategoryDisplayName(category);

  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                वास्तविक परीक्षा: {categoryDisplayName}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                आधिकारिक परीक्षा शर्तहरू अन्तर्गत आफ्नो ज्ञान परीक्षण गर्नुहोस्। २५ प्रश्न, २५ मिनेट।
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
