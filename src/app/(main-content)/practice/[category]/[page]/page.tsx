
import { PracticeTestClient } from '../PracticeTestClient'; // Adjusted path
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { FileText } from 'lucide-react';
import type { Question as AppQuestionType } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import akQuestionsData from '@/data/ak.json';
import trafficQuestionsData from '@/data/trafficqn.json';

const QUESTIONS_PER_PAGE = 20;
const VALID_CATEGORIES = ['A', 'B'];


interface PracticeTestPageProps {
  params: { category: string; page: string };
}

function getCategoryDisplayName(categoryCode: string): string {
  const normalizedCategory = categoryCode.toUpperCase();
  if (normalizedCategory === 'A') return 'Category A (Bike/Scooter)';
  if (normalizedCategory === 'B') return 'Category B (Car/Jeep/Van)';
  return `Category ${normalizedCategory}`;
}


export async function generateMetadata({ params }: PracticeTestPageProps): Promise<Metadata> {
  const category = params.category.toUpperCase();
  const pageNumber = parseInt(params.page, 10);
  const categoryDisplayName = getCategoryDisplayName(category);

  if (!VALID_CATEGORIES.includes(category) || isNaN(pageNumber) || pageNumber < 1) {
    return {
      title: `Invalid Practice Test Page | ${SITE_NAME}`,
    };
  }

  const pageUrl = `${SITE_URL}/practice/${category}/${pageNumber}`;
  const title = `Practice Test: ${categoryDisplayName} - Page ${pageNumber} | ${SITE_NAME}`;
  const description = `Nepal driving license practice questions for ${categoryDisplayName}, page ${pageNumber}. Prepare for your Likhit exam with ${SITE_NAME}.`;

  return {
    title,
    description,
    keywords: [`Nepal driving license ${categoryDisplayName}`, `Likhit exam practice page ${pageNumber}`, `driving test questions ${category}`],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: { category: string; page: string }[] = [];

  for (const category of VALID_CATEGORIES) {
    let categoryQuestions: AppQuestionType[] = [];
    const textualQuestions = (akQuestionsData.questions || [])
      .filter(q => q.category === category || (category === 'A' && q.category === 'K')) // K is part of A
      .map(q => ({ ...q, id: q.n, category: category as 'A' | 'B' | 'Traffic' })); // Ensure consistent ID and narrow category type

    const allTrafficQuestions = (trafficQuestionsData.questions || [])
      .map(q => ({ ...q, id: q.n, category: 'Traffic' as 'Traffic' }));

    if (category === 'A') {
      categoryQuestions = [...textualQuestions, ...allTrafficQuestions];
    } else if (category === 'B') {
      // For now, Category B textual questions might be empty, but still include traffic
      categoryQuestions = [...textualQuestions, ...allTrafficQuestions];
      if (textualQuestions.length === 0) { // If no 'B' specific questions yet
        // console.log(`Category B has no specific textual questions, only traffic questions will be available if any.`);
      }
    }
    
    const totalPages = Math.ceil(categoryQuestions.length / QUESTIONS_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
      if (categoryQuestions.length > 0 || (category === 'B' && textualQuestions.length === 0)) { // Generate pages for B even if only traffic q's initially
         params.push({ category, page: i.toString() });
      }
    }
  }
  return params;
}

export default async function PaginatedPracticeTestPage({ params }: PracticeTestPageProps) {
  const category = params.category.toUpperCase();
  const page = parseInt(params.page, 10);

  if (!VALID_CATEGORIES.includes(category) || isNaN(page) || page < 1) {
    notFound();
  }

  let rawTextualQuestions: any[] = (akQuestionsData.questions || []);
  let categoryTextualQuestions: AppQuestionType[];

  if (category === 'A') {
    categoryTextualQuestions = rawTextualQuestions
      .filter(q => q.category === 'A' || q.category === 'K') // K questions are treated as 'A'
      .map(q => ({ ...q, id: q.n, category: 'A' as 'A' }));
  } else if (category === 'B') {
    categoryTextualQuestions = rawTextualQuestions
      .filter(q => q.category === 'B')
      .map(q => ({ ...q, id: q.n, category: 'B' as 'B' }));
  } else {
    notFound(); // Should not happen if generateStaticParams is correct
  }
  
  const allTrafficQuestions: AppQuestionType[] = (trafficQuestionsData.questions || [])
    .map(q => ({ ...q, id: q.n, category: 'Traffic' as 'Traffic' }));

  const allQuestionsForCategory: AppQuestionType[] = [...categoryTextualQuestions, ...allTrafficQuestions];

  if (allQuestionsForCategory.length === 0) {
    // This case implies category B might be truly empty or A has no questions (error in data)
    const message = category === 'B' ? "Category B questions are coming soon. Please check back later or try Category A."
                                    : "No questions are currently available for this category. Please try another category.";
    return (
      <div className="container py-8 md:py-12 text-center">
         <header className="mb-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Practice Test: {getCategoryDisplayName(category)}
            </h1>
        </header>
        <Alert variant={category === 'B' ? "default" : "destructive"} className="max-w-xl mx-auto">
          <AlertTitle>{category === 'B' ? "Coming Soon!" : "No Questions Available"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/practice">Back to Category Selection</Link>
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(allQuestionsForCategory.length / QUESTIONS_PER_PAGE);

  if (page > totalPages && totalPages > 0) { // Redirect to last valid page if requested page is too high
    redirect(`/practice/${category}/${totalPages}`);
  }
   if (page > totalPages && totalPages === 0) { // If no questions, but somehow reached here (e.g. manual URL)
     redirect(`/practice/${category}/1`); // Go to page 1 which will show the 'no questions' message
   }


  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const questionsForCurrentPage = allQuestionsForCategory.slice(startIndex, endIndex);

  if (questionsForCurrentPage.length === 0 && page === 1 && allQuestionsForCategory.length > 0) {
    // This should ideally not happen if totalPages logic is correct above.
    // But as a fallback if page 1 has no questions but there are questions in total.
    console.error(`Error: Page 1 for category ${category} has no questions, but total questions exist.`);
    notFound();
  }
  

  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Practice Test: {getCategoryDisplayName(category)}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Page {page} of {totalPages}. Sharpen your skills with these targeted practice questions.
            </p>
        </header>
        <PracticeTestClient 
            questionsForCurrentPage={questionsForCurrentPage}
            currentPage={page}
            totalPages={totalPages}
            category={category}
        />
    </div>
  );
}
