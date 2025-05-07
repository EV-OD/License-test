'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { PracticeQuestion, MockExamResult, QuestionOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, Timer, ChevronLeft, ChevronRight, History, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const MOCK_EXAM_QUESTIONS_COUNT = 20; // Standard number of questions for a Likhit mock exam
const MOCK_EXAM_TIME_LIMIT_SECONDS = 20 * 60; // 20 minutes in seconds

type ExamCategory = 'A' | 'B' | 'K' | 'Mixed'; // Mixed for questions from all categories

interface MockExamClientProps {
  allQuestions: PracticeQuestion[];
}

export function MockExamClient({ allQuestions }: MockExamClientProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [examCategory, setExamCategory] = useState<ExamCategory>('Mixed');
  const [examQuestions, setExamQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(MOCK_EXAM_TIME_LIMIT_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [pastResults, setPastResults] = useState<MockExamResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem('mockExamResults');
    if (storedResults) {
      setPastResults(JSON.parse(storedResults));
    }
  }, []);

  const saveResult = (result: MockExamResult) => {
    const updatedResults = [result, ...pastResults].slice(0, 10); // Keep last 10 results
    setPastResults(updatedResults);
    localStorage.setItem('mockExamResults', JSON.stringify(updatedResults));
  };
  
  const startExam = useCallback(() => {
    let questionsForExam: PracticeQuestion[];
    if (examCategory === 'Mixed') {
      questionsForExam = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, MOCK_EXAM_QUESTIONS_COUNT);
    } else {
      questionsForExam = allQuestions.filter(q => q.category === examCategory).sort(() => 0.5 - Math.random()).slice(0, MOCK_EXAM_QUESTIONS_COUNT);
    }

    if (questionsForExam.length < MOCK_EXAM_QUESTIONS_COUNT && questionsForExam.length > 0) {
       toast({
        title: t("Warning", "चेतावनी"),
        description: t(`Not enough questions for category ${examCategory}. Using ${questionsForExam.length} questions.`, `श्रेणी ${examCategory} को लागि पर्याप्त प्रश्नहरू छैनन्। ${questionsForExam.length} प्रश्नहरू प्रयोग गर्दै।`),
        variant: "default", // or a warning variant if you have one
      });
    } else if (questionsForExam.length === 0) {
       toast({
        title: t("Error", "त्रुटि"),
        description: t(`No questions available for category ${examCategory}. Cannot start exam.`, `श्रेणी ${examCategory} को लागि कुनै प्रश्नहरू उपलब्ध छैनन्। परीक्षा सुरु गर्न सकिँदैन।`),
        variant: "destructive",
      });
      return;
    }
    
    setExamQuestions(questionsForExam);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questionsForExam.length).fill(null));
    setTimeLeft(MOCK_EXAM_TIME_LIMIT_SECONDS);
    setExamStarted(true);
    setExamFinished(false);
    setExamResult(null);
  }, [allQuestions, examCategory, t, toast]);

  useEffect(() => {
    if (!examStarted || examFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const finishExam = () => {
    setExamFinished(true);
    setExamStarted(false); // Stop timer and further interactions
    
    let score = 0;
    const answerDetails = examQuestions.map((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correct_option_index;
      if (isCorrect) score++;
      return { questionId: q.id, selectedOption: userAnswers[idx], isCorrect };
    });

    const result: MockExamResult = {
      score,
      totalQuestions: examQuestions.length,
      date: new Date().toISOString(),
      answers: answerDetails,
    };
    setExamResult(result);
    saveResult(result);
    setShowResultsDialog(true);
  };
  
  const currentQuestion = examQuestions[currentQuestionIndex];

  const renderOption = (option: QuestionOption, index: number) => {
    const content = language === 'en' ? option.en : option.np;
    return (
      <div key={index} className="flex items-start space-x-3">
        <RadioGroupItem value={index.toString()} id={`option-exam-${index}`} className="mt-1" />
        <Label htmlFor={`option-exam-${index}`} className="flex-1 cursor-pointer">
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!examStarted && !examFinished) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">{t('Mock Exam', 'नमुना परीक्षा')}</h1>
        <p className="text-muted-foreground mb-8">{t('Simulate the real Likhit exam conditions.', 'वास्तविक लिखित परीक्षाको अवस्थाको नक्कल गर्नुहोस्।')}</p>
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>{t('Exam Setup', 'परीक्षा सेटअप')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="examCategory">{t('Select Category', 'श्रेणी चयन गर्नुहोस्')}</Label>
              <Select value={examCategory} onValueChange={(value: ExamCategory) => setExamCategory(value)}>
                <SelectTrigger id="examCategory" className="w-full mt-1">
                  <SelectValue placeholder={t('Select category', 'श्रेणी चयन गर्नुहोस्')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mixed">{t('Mixed (All Categories)', 'मिश्रित (सबै श्रेणीहरू)')}</SelectItem>
                  <SelectItem value="A">{t('Category A (Motorcycle)', 'श्रेणी A (मोटरसाइकल)')}</SelectItem>
                  <SelectItem value="B">{t('Category B (Car/Jeep/Van)', 'श्रेणी B (कार/जीप/भ्यान)')}</SelectItem>
                  <SelectItem value="K">{t('Category K (Scooter)', 'श्रेणी K (स्कुटर)')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(`Number of questions: ${MOCK_EXAM_QUESTIONS_COUNT}`, `प्रश्नहरूको संख्या: ${MOCK_EXAM_QUESTIONS_COUNT}`)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(`Time limit: ${MOCK_EXAM_TIME_LIMIT_SECONDS / 60} minutes`, `समय सीमा: ${MOCK_EXAM_TIME_LIMIT_SECONDS / 60} मिनेट`)}
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button onClick={startExam} className="w-full">{t('Start Mock Exam', 'नमुना परीक्षा सुरु गर्नुहोस्')}</Button>
            {pastResults.length > 0 && (
              <AlertDialog open={showPastResultsDialog} onOpenChange={setShowPastResultsDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full"><History className="mr-2 h-4 w-4"/>{t('View Past Results', 'विगतका नतिजाहरू हेर्नुहोस्')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Past Exam Results', 'विगतका परीक्षा नतिजाहरू')}</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="space-y-3 my-4">
                    {pastResults.map((res, idx) => (
                      <Card key={idx} className="p-3">
                        <p>{t('Date:', 'मिति:')} {new Date(res.date).toLocaleDateString()}</p>
                        <p>{t('Score:', 'स्कोर:')} {res.score}/{res.totalQuestions}</p>
                      </Card>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Close', 'बन्द गर्नुहोस्')}</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (examStarted && currentQuestion) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t(`Question ${currentQuestionIndex + 1} of ${examQuestions.length}`, `प्रश्न ${currentQuestionIndex + 1} / ${examQuestions.length}`)}</CardTitle>
              <div className="flex items-center text-lg font-semibold text-destructive">
                <Timer className="mr-2 h-5 w-5" /> {formatTime(timeLeft)}
              </div>
            </div>
            <Progress value={((currentQuestionIndex + 1) / examQuestions.length) * 100} className="mt-2" />
            <CardDescription className="pt-4 text-lg font-semibold">
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
              value={userAnswers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map(renderOption)}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} 
              variant="outline" 
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> {t('Previous', 'अघिल्लो')}
            </Button>
            {currentQuestionIndex < examQuestions.length - 1 ? (
              <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                {t('Next', 'अर्को')} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t('Finish Exam', 'परीक्षा समाप्त गर्नुहोस्')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Confirm Finish', 'समाप्त गर्न निश्चित गर्नुहोस्')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('Are you sure you want to finish the exam? Unanswered questions will be marked incorrect.', 'के तपाईं परीक्षा समाप्त गर्न निश्चित हुनुहुन्छ? अनुत्तरित प्रश्नहरू गलत चिन्ह लगाइनेछन्।')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel', 'रद्द गर्नुहोस्')}</AlertDialogCancel>
                    <AlertDialogAction onClick={finishExam}>{t('Finish', 'समाप्त गर्नुहोस्')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // This state primarily handles the results dialog after finishing.
  // If examFinished is true but examResult is not yet set (edge case), it can show a loading or redirect.
  // For a cleaner flow, the results display is handled by the AlertDialog triggered by setShowResultsDialog.
  if (examFinished && examResult) {
    return (
      <AlertDialog open={showResultsDialog} onOpenChange={(open) => {
          setShowResultsDialog(open);
          if (!open) { // When dialog closes, reset to initial state
            setExamFinished(false); 
            setExamResult(null);
          }
        }}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">{t('Exam Results', 'परीक्षाको नतिजा')}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="my-4 space-y-3">
            <p className="text-xl">
              {t('Your Score:', 'तपाईंको स्कोर:')} <span className="font-bold text-primary">{examResult.score} / {examResult.totalQuestions}</span>
            </p>
            <Progress value={(examResult.score / examResult.totalQuestions) * 100} className="w-full" />
             <p className={`text-lg font-semibold ${examResult.score / examResult.totalQuestions >= 0.7 ? 'text-accent' : 'text-destructive'}`}>
              {examResult.score / examResult.totalQuestions >= 0.7 ? t('Congratulations! You Passed!', 'बधाई छ! तपाईं उत्तीर्ण हुनुभयो!') : t('Better Luck Next Time!', 'अर्को पटक राम्रो भाग्य!')}
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer font-medium text-primary hover:underline">{t('View Answer Details', 'उत्तर विवरण हेर्नुहोस्')}</summary>
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md">
                {examResult.answers.map((ans, idx) => {
                  const q = examQuestions.find(ques => ques.id === ans.questionId);
                  if (!q) return null;
                  return (
                    <Card key={idx} className={`p-3 ${ans.isCorrect ? 'border-accent' : 'border-destructive'}`}>
                      <p className="font-semibold text-sm">{language === 'en' ? q.question_en : q.question_np}</p>
                      <p className={`text-xs ${ans.isCorrect ? 'text-accent' : 'text-destructive'}`}>
                        {t('Your answer:', 'तपाईंको उत्तर:')} {ans.selectedOption !== null ? (language === 'en' ? q.options[ans.selectedOption].en.text : q.options[ans.selectedOption].np.text) : t('Not answered', 'उत्तर दिइएको छैन')}
                        {ans.isCorrect ? <CheckCircle className="inline ml-1 h-3 w-3" /> : <XCircle className="inline ml-1 h-3 w-3" />}
                      </p>
                      {!ans.isCorrect && <p className="text-xs text-muted-foreground">{t('Correct answer:', 'सही उत्तर:')} {language === 'en' ? q.options[q.correct_option_index].en.text : q.options[q.correct_option_index].np.text}</p>}
                    </Card>
                  );
                })}
              </div>
            </details>
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
             <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setExamFinished(false); setExamResult(null); }}>{t('Close', 'बन्द गर्नुहोस्')}</Button>
             </AlertDialogCancel>
             <Button onClick={() => { setExamFinished(false); setExamResult(null); startExam(); }} className="w-full sm:w-auto">
               <RotateCcw className="mr-2 h-4 w-4" /> {t('Take New Exam', 'नयाँ परीक्षा दिनुहोस्')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return null; // Fallback if no state matches, should ideally not be reached
}
