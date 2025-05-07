'use client';

import { useState, useMemo, useEffect } from 'react';
import type { PracticeQuestion, QuestionOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, Lightbulb, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

type CategoryFilter = 'All' | 'A' | 'B' | 'K';

interface PracticeTestClientProps {
  allQuestions: PracticeQuestion[];
}

const QUESTIONS_PER_SET = 10; // Number of questions per practice set

export function PracticeTestClient({ allQuestions }: PracticeTestClientProps) {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [currentSetQuestions, setCurrentSetQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<PracticeQuestion[]>([]);

  const filteredQuestions = useMemo(() => {
    if (category === 'All') return allQuestions;
    return allQuestions.filter(q => q.category === category);
  }, [allQuestions, category]);

  const startNewSet = () => {
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SET);
    setCurrentSetQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
    setIncorrectAnswers([]);
  };
  
  useEffect(startNewSet, [category, filteredQuestions]); // Restart set if category or base questions change

  const currentQuestion = currentSetQuestions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    setShowAnswer(true);
    if (selectedAnswer === currentQuestion.correct_option_index) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [...prev, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSetQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const renderOption = (option: QuestionOption, index: number) => {
    const content = language === 'en' ? option.en : option.np;
    return (
      <div key={index} className="flex items-start space-x-3">
        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
          <p>{content.text}</p>
          {content.image_url && (
            <Image
              src={content.image_url}
              alt={t(`Option ${index + 1} image`, `विकल्प ${index + 1} छवि`)}
              width={200}
              height={100}
              className="mt-2 rounded-md object-contain"
              data-ai-hint="traffic sign diagram"
            />
          )}
        </Label>
      </div>
    );
  };

  if (currentSetQuestions.length === 0 && filteredQuestions.length > 0) {
    // Initial load or category change triggered a restart, but questions haven't been set yet
    return (
      <div className="container py-8 text-center">
        <p>{t('Loading questions...', 'प्रश्नहरू लोड हुँदैछ...')}</p>
      </div>
    );
  }
  
  if (filteredQuestions.length === 0) {
    return (
        <div className="container py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">{t('Practice Test', 'अभ्यास परीक्षा')}</h1>
            <Alert variant="destructive">
                <AlertTitle>{t('No Questions Available', 'कुनै प्रश्नहरू उपलब्ध छैनन्')}</AlertTitle>
                <AlertDescription>
                    {t(`Sorry, there are no questions available for the selected category: ${category}. Please try another category.`, `माफ गर्नुहोस्, चयन गरिएको श्रेणी: ${category} को लागि कुनै प्रश्नहरू उपलब्ध छैनन्। कृपया अर्को श्रेणी प्रयास गर्नुहोस्।`)}
                </AlertDescription>
            </Alert>
             <div className="my-6">
                <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
                    <SelectTrigger className="w-full sm:w-[280px] mx-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder={t('Filter by Category', 'श्रेणी अनुसार फिल्टर गर्नुहोस्')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">{t('All Categories', 'सबै श्रेणीहरू')}</SelectItem>
                        <SelectItem value="A">{t('Category A (Motorcycle)', 'श्रेणी A (मोटरसाइकल)')}</SelectItem>
                        <SelectItem value="B">{t('Category B (Car/Jeep/Van)', 'श्रेणी B (कार/जीप/भ्यान)')}</SelectItem>
                        <SelectItem value="K">{t('Category K (Scooter)', 'श्रेणी K (स्कुटर)')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
  }


  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('Practice Test', 'अभ्यास परीक्षा')}</h1>
      <p className="text-muted-foreground text-center mb-6">{t('Test your knowledge for the Likhit exam.', 'लिखित परीक्षाको लागि आफ्नो ज्ञान परीक्षण गर्नुहोस्।')}</p>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('Filter by Category', 'श्रेणी अनुसार फिल्टर गर्नुहोस्')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t('All Categories', 'सबै श्रेणीहरू')}</SelectItem>
            <SelectItem value="A">{t('Category A (Motorcycle)', 'श्रेणी A (मोटरसाइकल)')}</SelectItem>
            <SelectItem value="B">{t('Category B (Car/Jeep/Van)', 'श्रेणी B (कार/जीप/भ्यान)')}</SelectItem>
            <SelectItem value="K">{t('Category K (Scooter)', 'श्रेणी K (स्कुटर)')}</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={startNewSet} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('New Set', 'नयाँ सेट')}
        </Button>
      </div>
      
      {!quizFinished && currentQuestion && (
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle>{t(`Question ${currentQuestionIndex + 1} of ${currentSetQuestions.length}`, `प्रश्न ${currentQuestionIndex + 1} / ${currentSetQuestions.length}`)}</CardTitle>
            <Progress value={((currentQuestionIndex + 1) / currentSetQuestions.length) * 100} className="mt-2" />
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
                  data-ai-hint="traffic situation diagram"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              disabled={showAnswer}
              className="space-y-4"
            >
              {currentQuestion.options.map(renderOption)}
            </RadioGroup>

            {showAnswer && (
              <Alert className={`mt-6 ${selectedAnswer === currentQuestion.correct_option_index ? 'border-accent text-accent' : 'border-destructive text-destructive'}`}>
                {selectedAnswer === currentQuestion.correct_option_index ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <AlertTitle>{selectedAnswer === currentQuestion.correct_option_index ? t('Correct!', 'सही!') : t('Incorrect!', 'गलत!')}</AlertTitle>
                <AlertDescription>
                  {t('Correct answer is:', 'सही उत्तर हो:')} {language === 'en' ? currentQuestion.options[currentQuestion.correct_option_index].en.text : currentQuestion.options[currentQuestion.correct_option_index].np.text}
                </AlertDescription>
                {(currentQuestion.explanation_en || currentQuestion.explanation_np) && (
                  <Button variant="link" size="sm" onClick={() => setShowExplanation(!showExplanation)} className="p-0 mt-2 h-auto">
                     <Lightbulb className="mr-1 h-4 w-4" />
                    {showExplanation ? t('Hide Explanation', ' स्पष्टीकरण लुकाउनुहोस्') : t('Show Explanation', 'स्पष्टीकरण देखाउनुहोस्')}
                  </Button>
                )}
              </Alert>
            )}
            {showAnswer && showExplanation && (currentQuestion.explanation_en || currentQuestion.explanation_np) && (
              <Card className="mt-4 bg-muted/50">
                <CardHeader><CardTitle className="text-base">{t('Explanation', 'स्पष्टीकरण')}</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  {language === 'en' ? currentQuestion.explanation_en : currentQuestion.explanation_np}
                </CardContent>
              </Card>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => { if(currentQuestionIndex > 0) setCurrentQuestionIndex(i => i-1); setSelectedAnswer(null); setShowAnswer(false); }} variant="outline" disabled={currentQuestionIndex === 0 || showAnswer}>
              <ChevronLeft className="mr-2 h-4 w-4" /> {t('Previous', 'अघिल्लो')}
            </Button>
            {showAnswer ? (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === currentSetQuestions.length - 1 ? t('View Results', 'नतिजा हेर्नुहोस्') : t('Next Question', 'अर्को प्रश्न')}
                 {currentQuestionIndex < currentSetQuestions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            ) : (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                {t('Check Answer', 'उत्तर जाँच गर्नुहोस्')}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {quizFinished && (
        <Card className="max-w-xl mx-auto text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{t('Quiz Finished!', 'प्रश्नोत्तरी समाप्त भयो!')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl">
              {t('Your Score:', 'तपाईंको स्कोर:')} <span className="font-bold text-primary">{score} / {currentSetQuestions.length}</span>
            </p>
            <Progress value={(score / currentSetQuestions.length) * 100} className="w-full" />
            <p className={`text-lg font-semibold ${score / currentSetQuestions.length >= 0.7 ? 'text-accent' : 'text-destructive'}`}>
              {score / currentSetQuestions.length >= 0.7 ? t('Great job! You passed.', 'राम्रो काम! तपाईं उत्तीर्ण हुनुभयो।') : t('Keep practicing! You can do better.', 'अभ्यास जारी राख्नुहोस्! तपाईं अझ राम्रो गर्न सक्नुहुन्छ।')}
            </p>
            {incorrectAnswers.length > 0 && (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">{t('Review Incorrect Answers', 'गलत उत्तरहरू समीक्षा गर्नुहोस्')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Incorrect Answers', 'गलत उत्तरहरू')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('Review the questions you answered incorrectly.', 'तपाईंले गलत उत्तर दिनुभएका प्रश्नहरूको समीक्षा गर्नुहोस्।')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4 my-4">
                    {incorrectAnswers.map((q, idx) => (
                      <Card key={idx} className="p-4">
                        <p className="font-semibold">{language === 'en' ? q.question_en : q.question_np}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t('Correct Answer:', 'सही उत्तर:')} {language === 'en' ? q.options[q.correct_option_index].en.text : q.options[q.correct_option_index].np.text}</p>
                        {(q.explanation_en || q.explanation_np) && <p className="text-xs mt-1 text-muted-foreground">{language === 'en' ? q.explanation_en : q.explanation_np}</p>}
                      </Card>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Close', 'बन्द गर्नुहोस्')}</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={startNewSet} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('Practice Again', 'फेरि अभ्यास गर्नुहोस्')}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
