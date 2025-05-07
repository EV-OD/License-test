
'use client';

import type React from 'react';
import type { MockExamResult, ExamCategoryType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Select components are removed as category is now fixed by the route
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, ClipboardCheckIcon, Tag } from 'lucide-react';

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60;

interface ExamSetupScreenProps {
  fixedCategory: ExamCategoryType; // Category is now fixed and passed as a prop
  onStartExam: () => void;
  pastResults: MockExamResult[];
  showPastResultsDialog: boolean;
  setShowPastResultsDialog: (show: boolean) => void;
  t: (enText: string, npText: string) => string;
}

function getCategoryDisplayName(category: ExamCategoryType, t: (enText: string, npText: string) => string): string {
  switch (category) {
    case 'A': return t('Category A (Motorcycle)', 'श्रेणी A (मोटरसाइकल)');
    case 'B': return t('Category B (Car/Jeep/Van)', 'श्रेणी B (कार/जीप/भ्यान)');
    case 'K': return t('Category K (Scooter)', 'श्रेणी K (स्कुटर)');
    case 'Mixed': return t('Mixed (All Categories)', 'मिश्रित (सबै श्रेणीहरू)');
    default: return category;
  }
}


export function ExamSetupScreen({
  fixedCategory,
  onStartExam,
  pastResults,
  showPastResultsDialog,
  setShowPastResultsDialog,
  t,
}: ExamSetupScreenProps) {
  const categoryDisplayName = getCategoryDisplayName(fixedCategory, t);

  return (
    <div className="flex-grow max-w-lg w-full">
      <Card className="w-full shadow-xl rounded-xl">
        <CardHeader>
          {/* Title can remain generic or also include category if page title is very specific */}
          <CardTitle className="text-2xl">{t('Real Exam Setup', 'वास्तविक परीक्षा सेटअप')}</CardTitle>
          <CardDescription>{t('Prepare for the official Likhit exam experience for:', 'यस श्रेणीको लागि आधिकारिक लिखित परीक्षाको अनुभवको लागि तयारी गर्नुहोस्:')} <span className="font-semibold text-primary">{categoryDisplayName}</span>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection is removed */}
          {/* Displaying the fixed category */}
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="flex items-center mb-2">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold text-lg">{t('Selected Category', 'चयन गरिएको श्रेणी')}</h3>
            </div>
            <p className="text-xl font-bold text-primary">{categoryDisplayName}</p>
            {fixedCategory === 'Mixed' && (
                <p className="text-xs text-muted-foreground mt-1">{t('This provides the most realistic simulation of the official exam.', 'यसले आधिकारिक परीक्षाको सबैभन्दा यथार्थपरक सिमुलेशन प्रदान गर्दछ।')}</p>
            )}
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-semibold">{t('Exam Details:', 'परीक्षा विवरण:')}</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>{t(`Number of questions: ${REAL_EXAM_QUESTIONS_COUNT}`, `प्रश्नहरूको संख्या: ${REAL_EXAM_QUESTIONS_COUNT}`)}</li>
              <li>{t(`Time limit: ${REAL_EXAM_TIME_LIMIT_SECONDS / 60} minutes`, `समय सीमा: ${REAL_EXAM_TIME_LIMIT_SECONDS / 60} मिनेट`)}</li>
              <li>{t('Results shown after completion.', 'समाप्ति पछि नतिजा देखाइनेछ।')}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button onClick={onStartExam} className="w-full text-lg py-6 rounded-lg">
            <ClipboardCheckIcon className="mr-2 h-5 w-5" />
            {t('Start Real Exam', 'वास्तविक परीक्षा सुरु गर्नुहोस्')}
          </Button>
          {pastResults.length > 0 && (
            <AlertDialog open={showPastResultsDialog} onOpenChange={setShowPastResultsDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-lg"><History className="mr-2 h-4 w-4" />{t('View Past Results for This Category', 'यस श्रेणीका विगतका नतिजाहरू हेर्नुहोस्')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('Past Exam Results for', 'विगतका परीक्षा नतिजाहरू:')} {categoryDisplayName}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-3 my-4">
                  {pastResults.map((res, idx) => (
                    <Card key={idx} className="p-3 rounded-md">
                      <p>{t('Date:', 'मिति:')} {new Date(res.date).toLocaleDateString()} {res.category ? `(${t('Category', 'श्रेणी')}: ${getCategoryDisplayName(res.category, t)})` : ''}</p>
                      <p>{t('Score:', 'स्कोर:')} {res.score}/{res.totalQuestions}</p>
                    </Card>
                  ))}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">{t('Close', 'बन्द गर्नुहोस्')}</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
