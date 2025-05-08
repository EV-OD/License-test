
import { PracticeTestClient } from './PracticeTestClient';
import practiceQuestionsData from '@/data/practice-questions.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { FileText } from 'lucide-react';
import type { Question as AppQuestionType } from '@/lib/types';

export const metadata: Metadata = {
  title: `अभ्यास परीक्षा | ${SITE_NAME}`,
  description: `${SITE_NAME} मा नेपालको ड्राइभिङ लाइसेन्स (लिखित) परीक्षाको अभ्यास गर्नुहोस्। श्रेणी A (मोटरसाइकल), B (कार/जीप/भ्यान), र K (स्कुटर) समावेश गर्दछ।`,
};

// The practiceQuestionsData is now expected to directly conform to AppQuestionType items
// or a very similar structure.
export default async function PracticePage() {
  // Map the raw data from JSON to ensure it strictly conforms to AppQuestionType
  // This handles potential minor discrepancies or ensures all fields are present.
  const questions: AppQuestionType[] = (practiceQuestionsData as any[]).map(q => ({
    id: q.id || q.n, // Use id if present, fallback to n
    n: q.n,
    category: q.category,
    qn: q.qn,
    imageUrl: q.imageUrl,
    a4: q.a4, // Directly use a4 as it's an array of strings
    an: q.an, // Directly use an as it's the correct answer string
  }));

  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                अभ्यास परीक्षा
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                लक्षित अभ्यास प्रश्नहरूको साथ आफ्नो सीप तिखार्नुहोस्। आफ्नो श्रेणी छान्नुहोस् र सिक्न सुरु गर्नुहोस्!
            </p>
        </header>
        <PracticeTestClient allQuestions={questions} />
    </div>
  );
}
