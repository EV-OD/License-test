
'use client';

import type React from 'react';
import Image from 'next/image';
import type { PracticeQuestion, QuestionOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamInProgressScreenProps {
  currentQuestion: PracticeQuestion;
  currentQuestionIndex: number;
  examQuestionsLength: number;
  timeLeftFormatted: string;
  userAnswers: (number | null)[];
  onAnswerSelect: (optionIndex: number) => void;
  onNavigateQuestion: (direction: 'next' | 'prev') => void;
  onConfirmFinishExam: () => void;
  t: (enText: string, npText: string) => string;
  language: 'en' | 'np';
}

export function ExamInProgressScreen({
  currentQuestion,
  currentQuestionIndex,
  examQuestionsLength,
  timeLeftFormatted,
  userAnswers,
  onAnswerSelect,
  onNavigateQuestion,
  onConfirmFinishExam,
  t,
  language,
}: ExamInProgressScreenProps) {

  const renderOption = (option: QuestionOption, index: number) => {
    const content = language === 'en' ? option.en : option.np;
    const optionId = `option-real-exam-${currentQuestion.id}-${index}`;
    return (
      <div key={optionId} className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border transition-all",
        userAnswers[currentQuestionIndex] === index ? "border-primary bg-primary/10" : "border-border hover:border-primary"
      )}>
        <RadioGroupItem
          value={index.toString()}
          id={optionId}
          className="shrink-0"
          checked={userAnswers[currentQuestionIndex] === index}
        />
        <Label htmlFor={optionId} className="flex-1 cursor-pointer text-base">
          <p>{content.text}</p>
          {content.image_url && (
            <Image
              src={content.image_url}
              alt={t(`Option ${index + 1} image`, `विकल्प ${index + 1} छवि`)}
              width={200}
              height={100}
              className="mt-2 rounded-md object-contain"
              data-ai-hint="traffic diagram option"
            />
          )}
        </Label>
      </div>
    );
  };

  return (
    <div className="flex-grow max-w-2xl w-full">
      <Card className="w-full shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t(`Question ${currentQuestionIndex + 1} of ${examQuestionsLength}`, `प्रश्न ${currentQuestionIndex + 1} / ${examQuestionsLength}`)}</CardTitle>
            <div className="flex items-center text-lg font-semibold text-destructive">
              <Timer className="mr-2 h-5 w-5" /> {timeLeftFormatted}
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / examQuestionsLength) * 100} className="mt-2 h-2.5" />
          <CardDescription className="pt-6 text-xl font-semibold leading-relaxed">
            {language === 'en' ? currentQuestion.question_en : currentQuestion.question_np}
          </CardDescription>
          {(language === 'en' ? currentQuestion.image_url_en : currentQuestion.image_url_np) && (
            <div className="mt-4 flex justify-center">
              <Image
                src={language === 'en' ? currentQuestion.image_url_en! : currentQuestion.image_url_np!}
                alt={t('Question related image', 'प्रश्न सम्बन्धित छवि')}
                width={300}
                height={150}
                className="rounded-md object-contain border"
                data-ai-hint="traffic scenario"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            key={`${currentQuestion.id}-${currentQuestionIndex}`} // Ensures component re-renders when question changes
            value={userAnswers[currentQuestionIndex] !== null ? userAnswers[currentQuestionIndex]!.toString() : undefined}
            onValueChange={(value) => onAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map(renderOption)}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button
            onClick={() => onNavigateQuestion('prev')}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="rounded-lg"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('Previous', 'अघिल्लो')}
          </Button>
          {currentQuestionIndex < examQuestionsLength - 1 ? (
            <Button onClick={() => onNavigateQuestion('next')} className="rounded-lg">
              {t('Next', 'अर्को')} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-lg">{t('Finish Exam', 'परीक्षा समाप्त गर्नुहोस्')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('Confirm Finish', 'समाप्त गर्न निश्चित गर्नुहोस्')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('Are you sure you want to finish the exam? Unanswered questions will be marked incorrect.', 'के तपाईं परीक्षा समाप्त गर्न निश्चित हुनुहुन्छ? अनुत्तरित प्रश्नहरू गलत चिन्ह लगाइनेछन्।')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">{t('Cancel', 'रद्द गर्नुहोस्')}</AlertDialogCancel>
                  <AlertDialogAction onClick={onConfirmFinishExam} className="rounded-md">{t('Finish', 'समाप्त गर्नुहोस्')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
