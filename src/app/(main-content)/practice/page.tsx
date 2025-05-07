import { PracticeTestClient } from './PracticeTestClient';
import { practiceQuestions } from '@/data/practice-questions'; // Assuming data is moved here
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Practice Test | ${SITE_NAME}`,
  description: `Take practice tests for Nepal's driving license (Likhit) exam. Covers categories A (Motorcycle), B (Car/Jeep/Van), and K (Scooter).`,
};

export default async function PracticePage() {
  // In a real app, you might fetch this data or filter based on user selection
  // For now, we pass all questions. The client component will handle filtering.
  return <PracticeTestClient allQuestions={practiceQuestions} />;
}
