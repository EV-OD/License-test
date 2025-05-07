
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PracticeQuestion, QuestionOption, MockExamResult } from '@/lib/types'; // Reusing MockExamResult type
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Timer, ChevronLeft, ChevronRight, History, ClipboardCheckIcon } from 'lucide-react';
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

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60; // 25 minutes in seconds
const PASS_PERCENTAGE = 0.7; // 70% to pass

type ExamCategory = 'A' | 'B' | 'K' | 'Mixed';

interface RealExamClientProps {
  allQuestions: PracticeQuestion[];
}

export function RealExamClient({ allQuestions }: RealExamClientProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [examCategory, setExamCategory] = useState<ExamCategory>('Mixed');
  const [examQuestions, setExamQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(REAL_EXAM_TIME_LIMIT_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showPastResultsDialog, setShowPastResultsDialog] = useState(false);
  const [pastResults, setPastResults] = useState<MockExamResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem('realExamResults');
    if (storedResults) {
      setPastResults(JSON.parse(storedResults));
    }
  }, []);

  const saveResult = useCallback((result: MockExamResult) => {
    const updatedResults = [result, ...pastResults].slice(0, 10);
    setPastResults(updatedResults);
    localStorage.setItem('realExamResults', JSON.stringify(updatedResults));
  }, [pastResults]);

  const finishExam = useCallback(() => {
    setExamFinished(currentExamFinished => {
      if (currentExamFinished) {
        return true; // Already finished
      }

      setExamStarted(false);

      let score = 0;
      const answerDetails = examQuestions.map((q, idx) => {
        const isCorrect = userAnswers[idx] === q.correct_option_index;
        if (isCorrect) score++;
        return { questionId: q.id, selectedOption: userAnswers[idx], isCorrect };
      });

      const resultData: MockExamResult = {
        score,
        totalQuestions: examQuestions.length,
        date: new Date().toISOString(),
        answers: answerDetails,
        category: examCategory,
      };
      setExamResult(resultData);
      saveResult(resultData);
      setShowResultsDialog(true);
      return true; // Set examFinished to true
    });
  }, [
    examQuestions,
    userAnswers,
    examCategory,
    saveResult,
    setExamStarted, // setExamStarted is stable
    setExamResult,   // setExamResult is stable
    setShowResultsDialog, // setShowResultsDialog is stable
    setExamFinished // setExamFinished is stable
  ]);

  const finishExamRef = useRef(finishExam);
  useEffect(() => {
    finishExamRef.current = finishExam;
  }, [finishExam]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            finishExamRef.current();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && examStarted && !examFinished) {
      // Fallback if re-render happens exactly when timeLeft is 0
      finishExamRef.current();
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);


  const startExam = useCallback(() => {
    let questionsForExam: PracticeQuestion[];
    if (examCategory === 'Mixed') {
      questionsForExam = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, REAL_EXAM_QUESTIONS_COUNT);
    } else {
      questionsForExam = allQuestions.filter(q => q.category === examCategory).sort(() => 0.5 - Math.random()).slice(0, REAL_EXAM_QUESTIONS_COUNT);
    }

    if (questionsForExam.length < REAL_EXAM_QUESTIONS_COUNT && questionsForExam.length > 0) {
       toast({
        title: t("Warning", "चेतावनी"),
        description: t(`Not enough questions for category ${examCategory} for a full real exam simulation. Using ${questionsForExam.length} questions. Target is ${REAL_EXAM_QUESTIONS_COUNT}.`, `श्रेणी ${examCategory} को लागि पूर्ण वास्तविक परीक्षा सिमुलेशनको लागि पर्याप्त प्रश्नहरू छैनन्। ${questionsForExam.length} प्रश्नहरू प्रयोग गर्दै। लक्ष्य ${REAL_EXAM_QUESTIONS_COUNT} हो।`),
        variant: "default",
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
    setTimeLeft(REAL_EXAM_TIME_LIMIT_SECONDS);
    setExamStarted(true);
    setExamFinished(false);
    setExamResult(null);
    setShowResultsDialog(false);
  }, [allQuestions, examCategory, t, toast]);


  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const currentQuestion = examQuestions[currentQuestionIndex];

  const renderOption = (option: QuestionOption, index: number) => {
    if (!currentQuestion) return null;
    const content = language === 'en' ? option.en : option.np;
    const optionId = `option-real-exam-${currentQuestion.id}-${index}`;
    return (
      <div key={optionId} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 transition-all">
        <RadioGroupItem value={index.toString()} id={optionId} className="shrink-0" />
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!examStarted && !examFinished) {
    return (
        <Card className="max-w-lg mx-auto shadow-xl rounded-xl">
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
            <Button onClick={startExam} className="w-full text-lg py-6 rounded-lg">
                <ClipboardCheckIcon className="mr-2 h-5 w-5" />
                {t('Start Real Exam', 'वास्तविक परीक्षा सुरु गर्नुहोस्')}
            </Button>
            {pastResults.length > 0 && (
               <AlertDialog open={showPastResultsDialog} onOpenChange={setShowPastResultsDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full rounded-lg"><History className="mr-2 h-4 w-4"/>{t('View Past Real Exam Results', 'विगतका वास्तविक परीक्षा नतिजाहरू हेर्नुहोस्')}</Button>
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
    );
  }

  if (examStarted && currentQuestion) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t(`Question ${currentQuestionIndex + 1} of ${examQuestions.length}`, `प्रश्न ${currentQuestionIndex + 1} / ${examQuestions.length}`)}</CardTitle>
              <div className="flex items-center text-lg font-semibold text-destructive">
                <Timer className="mr-2 h-5 w-5" /> {formatTime(timeLeft)}
              </div>
            </div>
            <Progress value={((currentQuestionIndex + 1) / examQuestions.length) * 100} className="mt-2 h-2.5" />
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
              key={`${currentQuestion.id}-${currentQuestionIndex}`}
              value={userAnswers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map(renderOption)}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              variant="outline"
              disabled={currentQuestionIndex === 0}
              className="rounded-lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> {t('Previous', 'अघिल्लो')}
            </Button>
            {currentQuestionIndex < examQuestions.length - 1 ? (
              <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="rounded-lg">
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
                    <AlertDialogAction onClick={finishExamRef.current} className="rounded-md">{t('Finish', 'समाप्त गर्नुहोस्')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (examFinished && examResult) {
    const passed = examResult.totalQuestions > 0 && (examResult.score / examResult.totalQuestions) >= PASS_PERCENTAGE;
    return (
      <AlertDialog open={showResultsDialog} onOpenChange={(open) => {
          setShowResultsDialog(open);
          if (!open) {
            setExamFinished(false);
            setExamResult(null);
            // Reset to exam setup screen
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
            <p className="text-sm text-muted-foreground">{t(`(Passing score is ${PASS_PERCENTAGE*100}%)`, `(उत्तीर्ण अंक ${PASS_PERCENTAGE*100}%)`)}</p>

            <details className="mt-6 text-left">
              <summary className="cursor-pointer font-medium text-primary hover:underline text-center">{t('View Answer Details', 'उत्तर विवरण हेर्नुहोस्')}</summary>
              <div className="mt-4 space-y-3 max-h-72 overflow-y-auto border p-4 rounded-md bg-muted/30">
                {examQuestions.map((q, idx) => {
                  const ans = examResult.answers.find(a => a.questionId === q.id);
                  if (!ans) return null;
                  return (
                    <Card key={idx} className={`p-3 rounded-md ${ans.isCorrect ? 'border-accent bg-accent/5' : 'border-destructive bg-destructive/5'}`}>
                      <p className="font-semibold text-sm mb-1">{idx+1}. {language === 'en' ? q.question_en : q.question_np}</p>
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
                <Button variant="outline" className="w-full sm:w-auto rounded-md" onClick={() => { setExamFinished(false); setExamResult(null); }}>{t('Close', 'बन्द गर्नुहोस्')}</Button>
             </AlertDialogCancel>
             <Button onClick={() => { setExamFinished(false); setExamResult(null); startExam(); }} className="w-full sm:w-auto rounded-md">
               <RotateCcw className="mr-2 h-4 w-4" /> {t('Take New Real Exam', 'नयाँ वास्तविक परीक्षा दिनुहोस्')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return null;
}
