
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: `Find answers to frequently asked questions about Nepal's driving license process, Likhit exam, traffic rules, and more on ${SITE_NAME}.`,
};

// FAQ data translated to English
const faqData = [
  {
    "id": "q1",
    "question": "What is the Likhit exam?",
    "answer": "The Likhit exam is a computer-based written test that assesses your knowledge of traffic rules, road signs, vehicle mechanics, and general road safety. It is a mandatory step to obtain a driving license in Nepal.",
  },
  {
    "id": "q2",
    "question": "Which vehicle categories are covered on this platform?",
    "answer": "We provide practice questions and materials for Category A (Motorcycle), Category B (Car, Jeep, Van - coming soon), and Category K (Scooter).",
  },
  {
    "id": "q3",
    "question": "How do the real exam simulations work?",
    "answer": "Our real exam simulations mimic the official test environment. They are timed (25 minutes) and include 25 questions. You receive instant results and can track your progress.",
  },
  {
    "id": "q4",
    "question": "How often is the question bank updated?",
    "answer": "We strive to keep our question bank and traffic sign information as up-to-date as possible according to the latest regulations from the Department of Transport Management (DoTM).",
  },
  {
    "id": "q5",
    "question": "Can I access this platform offline?",
    "answer": "Offline access is available through our mobile application. You can download the app to study even when you don't have an internet connection.",
  },
   {
    "id": "q6",
    "question": "What is the passing score for the Likhit exam?",
    "answer": "The passing score for the Likhit exam can vary and is determined by the Department of Transport Management. Generally, you need to score around 70% to pass, but it's best to check the latest official guidelines. Our tests are designed to help you aim for a high score.",
  },
];

export default function FAQPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
         <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find answers to common questions about the Nepal driving license process and our platform.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground">
          Can't find the answer you're looking for?
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}