
'use client';

import type React from 'react';
import type { MockExamResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, ClipboardCheckIcon } from 'lucide-react';

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60;

type ExamCategory = 'A' | 'B' | 'K' | 'Mixed';

interface ExamSetupScreenProps {
  examCategory: ExamCategory;
  setExamCategory: (category: ExamCategory) => void;
  onStartExam: () => void;
  pastResults: MockExamResult[];
  showPastResultsDialog: boolean;
  setShowPastResultsDialog: (show: boolean) => void;
  t: (enText: string, npText: string) => string;
}

export function ExamSetupScreen({
  examCategory,
  setExamCategory,
  onStartExam,
  pastResults,
  showPastResultsDialog,
  setShowPastResultsDialog,
  t,
}: ExamSetupScreenProps) {
  return (
    <div className="flex-grow max-w-lg w-full">
      <Card className="w-full shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t('Real Exam Setup', 'वास्तविक परीक्षा सेटअप')}</CardTitle>
          <CardDescription>{t('Prepare for the official Likhit exam experience.', 'आधिकारिक लिखित परीक्षाको अनुभवको लागि तयारी गर्नुहोस्।')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="examCategory">{t('Select Category (Optional)', 'श्रेणी चयन गर्नुहोस् (ऐच्छिक)')}</Label>
            <Select value={examCategory} onValueChange={(value: ExamCategory) => setExamCategory(value)}>
              <SelectTrigger id="examCategory" className="w-full mt-1">
                <SelectValue placeholder={t('Select category', 'श्रेणी चयन गर्नुहोस्')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mixed">{t('Mixed (All Categories - Recommended for Real Simulation)', 'मिश्रित (सबै श्रेणीहरू - वास्तविक सिमुलेशनको लागि सिफारिश गरिएको)')}</SelectItem>
                <SelectItem value="A">{t('Category A (Motorcycle)', 'श्रेणी A (मोटरसाइकल)')}</SelectItem>
                <SelectItem value="B">{t('Category B (Car/Jeep/Van)', 'श्रेणी B (कार/जीप/भ्यान)')}</SelectItem>
                <SelectItem value="K">{t('Category K (Scooter)', 'श्रेणी K (स्कुटर)')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">{t('Choosing "Mixed" provides the most realistic simulation.', '"मिश्रित" छनोट गर्दा सबैभन्दा यथार्थपरक सिमुलेशन प्रदान गर्दछ।')}</p>
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
                <Button variant="outline" className="w-full rounded-lg"><History className="mr-2 h-4 w-4" />{t('View Past Real Exam Results', 'विगतका वास्तविक परीक्षा नतिजाहरू हेर्नुहोस्')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('Past Real Exam Results', 'विगतका वास्तविक परीक्षा नतिजाहरू')}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-3 my-4">
                  {pastResults.map((res, idx) => (
                    <Card key={idx} className="p-3 rounded-md">
                      <p>{t('Date:', 'मिति:')} {new Date(res.date).toLocaleDateString()} {res.category ? `(${t('Category', 'श्रेणी')}: ${res.category})` : ''}</p>
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
