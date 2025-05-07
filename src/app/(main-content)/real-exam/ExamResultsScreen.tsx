
'use client';

import type React from 'react';
import Image from 'next/image';
import type { MockExamResult, PracticeQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Added Card specific imports
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface ExamResultsScreenProps {
  examResult: MockExamResult;
  examQuestions: PracticeQuestion[];
  passPercentage: number;
  onClose: () => void;
  onRestartExam: () => void;
  t: (enText: string, npText: string) => string;
  language: 'en' | 'np';
  showResultsDialog: boolean; // Added prop to control dialog visibility
  setShowResultsDialog: (show: boolean) => void; // Added prop to control dialog visibility
}

export function ExamResultsScreen({
  examResult,
  examQuestions,
  passPercentage,
  onClose,
  onRestartExam,
  t,
  language,
  showResultsDialog,
  setShowResultsDialog,
}: ExamResultsScreenProps) {
  const passed = examResult.totalQuestions > 0 && (examResult.score / examResult.totalQuestions) >= passPercentage;

  const handleCloseAndReset = () => {
    setShowResultsDialog(false); // Close the dialog first
    onClose(); // Then call the original onClose logic
  };
  
  const handleRestartAndClose = () => {
    setShowResultsDialog(false); // Close the dialog
    onRestartExam(); // Call restart logic
  };

  return (
    <AlertDialog open={showResultsDialog} onOpenChange={(open) => {
      setShowResultsDialog(open);
      if (!open) {
        onClose(); // Call original onClose when dialog is dismissed by other means (e.g. Escape key)
      }
    }}>
      <AlertDialogContent className="max-h-[90vh] max-w-lg w-full overflow-y-auto rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">{t('Real Exam Results', 'वास्तविक परीक्षाको नतिजा')}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="my-6 space-y-4 text-center">
          <p className="text-3xl font-bold">
            {t('Your Score:', 'तपाईंको स्कोर:')} <span className={`${passed ? 'text-accent' : 'text-destructive'}`}>{examResult.score} / {examResult.totalQuestions}</span>
          </p>
          {examResult.totalQuestions > 0 && <Progress value={(examResult.score / examResult.totalQuestions) * 100} className="w-full h-3 rounded-full" />}
          <p className={`text-xl font-semibold ${passed ? 'text-accent' : 'text-destructive'}`}>
            {passed ? t('Congratulations! You Passed!', 'बधाई छ! तपाईं उत्तीर्ण हुनुभयो!') : t('Unfortunately, You Did Not Pass. Keep Practicing!', 'दुर्भाग्यवश, तपाईं उत्तीर्ण हुनुभएन। अभ्यास जारी राख्नुहोस्!')}
          </p>
          <p className="text-sm text-muted-foreground">{t(`(Passing score is ${passPercentage * 100}%)`, `(उत्तीर्ण अंक ${passPercentage * 100}%)`)}</p>

          <details className="mt-6 text-left">
            <summary className="cursor-pointer font-medium text-primary hover:underline text-center">{t('View Answer Details', 'उत्तर विवरण हेर्नुहोस्')}</summary>
            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto border p-4 rounded-md bg-muted/30">
              {examQuestions.map((q, idx) => {
                const ans = examResult.answers.find(a => a.questionId === q.id);
                if (!ans) return null;
                return (
                  <Card key={idx} className={`p-3 rounded-md ${ans.isCorrect ? 'border-accent bg-accent/5' : 'border-destructive bg-destructive/5'}`}>
                    <p className="font-semibold text-sm mb-1">{idx + 1}. {language === 'en' ? q.question_en : q.question_np}</p>
                    {(language === 'en' ? q.image_url_en : q.image_url_np) && (
                      <Image src={language === 'en' ? q.image_url_en! : q.image_url_np!} alt="Question image" width={150} height={75} className="my-1 rounded-sm border" data-ai-hint="question illustration" />
                    )}
                    <p className={`text-xs ${ans.isCorrect ? 'text-accent-foreground' : 'text-destructive-foreground'}`}>
                      <span className="font-medium">{t('Your answer:', 'तपाईंको उत्तर:')}</span> {ans.selectedOption !== null ? (language === 'en' ? q.options[ans.selectedOption].en.text : q.options[ans.selectedOption].np.text) : t('Not answered', 'उत्तर दिइएको छैन')}
                      {ans.isCorrect ? <CheckCircle className="inline ml-1 h-3 w-3 text-accent" /> : <XCircle className="inline ml-1 h-3 w-3 text-destructive" />}
                    </p>
                    {!ans.isCorrect && <p className="text-xs text-muted-foreground mt-0.5"><span className="font-medium">{t('Correct answer:', 'सही उत्तर:')}</span> {language === 'en' ? q.options[q.correct_option_index].en.text : q.options[q.correct_option_index].np.text}</p>}
                    {(q.explanation_en || q.explanation_np) && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{t('Explanation: ', 'स्पष्टीकरण: ')}{language === 'en' ? q.explanation_en : q.explanation_np}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </details>
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full sm:w-auto rounded-md" onClick={handleCloseAndReset}>{t('Close', 'बन्द गर्नुहोस्')}</Button>
          </AlertDialogCancel>
          <Button onClick={handleRestartAndClose} className="w-full sm:w-auto rounded-md">
            <RotateCcw className="mr-2 h-4 w-4" /> {t('Take New Real Exam', 'नयाँ वास्तविक परीक्षा दिनुहोस्')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
