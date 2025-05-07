
import { RealExamClient } from './RealExamClient';
import practiceQuestionsData from '@/data/practice-questions.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { ClipboardCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: `Real Exam Simulation | ${SITE_NAME}`,
  description: `Experience the conditions of the official Nepal Driving License Likhit exam. This timed test features 25 questions to assess your readiness on ${SITE_NAME}.`,
};

export default async function RealExamPage() {
  return (
    <div className="container py-8 md:py-12">
        <header className="mb-10 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Real Exam Simulation
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Test your knowledge under official exam conditions. 25 questions, 25 minutes.
            </p>
        </header>
        <RealExamClient allQuestions={practiceQuestionsData} />
    </div>
  );
}
