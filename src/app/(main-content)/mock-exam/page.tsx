
import { MockExamClient } from './MockExamClient';
import { practiceQuestions } from '@/data/practice-questions'; 
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Mock Exam | ${SITE_NAME}`,
  description: `Take timed mock exams simulating real Nepal driving license (Likhit) test conditions. Track your progress and get detailed results on ${SITE_NAME}.`,
};

export default async function MockExamPage() {
  // In a real app, mock exam questions might be different or specifically curated
  // For now, we'll use a subset of practice questions.
  return <MockExamClient allQuestions={practiceQuestions} />;
}
