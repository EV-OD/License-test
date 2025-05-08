
import { RealExamClient } from '../RealExamClient';
import practiceQuestionsData from '@/data/practice-questions.json'; // Load consolidated data
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';
import type { ExamCategoryType, Question } from '@/lib/types'; // Import Question type
import { notFound } from 'next/navigation';

// Updated valid categories to include Traffic
const VALID_CATEGORIES: ExamCategoryType[] = ['A', 'B', 'K', 'Mixed', 'Traffic'];

interface RealExamPageProps {
  params: { category: ExamCategoryType };
}

// Monolingual category display names
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

  // Ensure data conforms to Question type and add 'id' if missing
  const allQuestions: Question[] = practiceQuestionsData.map(q => ({ ...q, id: q.n }));

  // Check if Category B has actual questions or is "Coming Soon"
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
            isCategoryBComingSoon={isCategoryBComingSoon} // Pass the status
        />
    </div>
  );
}
