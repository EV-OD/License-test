
import { PracticeTestClient } from './PracticeTestClient';
import practiceQuestionsData from '@/data/practice-questions.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: `Practice Test | ${SITE_NAME}`,
  description: `Take practice tests for Nepal's driving license (Likhit) exam on ${SITE_NAME}. Covers categories A (Motorcycle), B (Car/Jeep/Van), and K (Scooter).`,
};

export default async function PracticePage() {
  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Practice Test
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Hone your skills with targeted practice questions. Choose your category and start learning!
            </p>
        </header>
        {/* The PracticeTestClient now handles its own internal layout for ads */}
        <PracticeTestClient allQuestions={practiceQuestionsData} />
    </div>
  );
}

