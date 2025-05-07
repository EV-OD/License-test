
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
import GoogleAd from '@/components/ads/GoogleAd';
import { cn } from '@/lib/utils';

type CategoryFilter = 'All' | 'A' | 'B' | 'K';

interface PracticeTestClientProps {
  allQuestions: PracticeQuestion[];
}

const QUESTIONS_PER_SET = 10; 

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

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_2;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_BOTTOM_MOBILE;

  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return [];
    if (category === 'All') return allQuestions;
    return allQuestions.filter(q => q.category === category);
  }, [allQuestions, category]);

  const startNewSet = () => {
    if (!filteredQuestions || filteredQuestions.length === 0) {
      setCurrentSetQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setScore(0);
      setQuizFinished(false); 
      setShowExplanation(false);
      setIncorrectAnswers([]);
      return;
    }
    
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SET);
    setCurrentSetQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null); // Reset selected answer for the new set
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
    setIncorrectAnswers([]);
  };
  
  useEffect(() => {
    startNewSet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, allQuestions]); // Only re-run if category or allQuestions change


  const currentQuestion = currentSetQuestions && currentSetQuestions.length > 0 ? currentSetQuestions[currentQuestionIndex] : null;

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
    setShowAnswer(false); 
    setSelectedAnswer(null); 
    setShowExplanation(false); 

    if (currentQuestionIndex < currentSetQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const renderOption = (option: QuestionOption, index: number) => {
    if (!currentQuestion) return null;
    const content = language === 'en' ? option.en : option.np;
    const optionId = `option-practice-${currentQuestion.id}-${index}`;
    
    let optionStyle = "border-border hover:border-primary";
    if (showAnswer) {
      if (index === currentQuestion.correct_option_index) {
        optionStyle = "border-accent bg-accent/10";
      } else if (selectedAnswer === index) {
        optionStyle = "border-destructive bg-destructive/10";
      }
    } else if (selectedAnswer === index) {
       optionStyle = "border-primary bg-primary/10";
    }


    return (
      <div key={optionId} className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border transition-all",
        optionStyle
      )}>
        <RadioGroupItem 
            value={index.toString()} 
            id={optionId} 
            className="shrink-0" 
            disabled={showAnswer} 
            checked={selectedAnswer === index}
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
              data-ai-hint="traffic sign diagram"
            />
          )}
        </Label>
      </div>
    );
  };

  const renderAds = (position: 'side' | 'bottom') => {
    if (!adClient) return null;

    if (position === 'side') {
      return (
        <div className="hidden lg:block w-48 space-y-4 shrink-0">
          {adSlotSide1 && (
            <GoogleAd
              adClient={adClient}
              adSlot={adSlotSide1}
              adFormat="auto"
              responsive={true}
              className="min-h-[250px] w-full"
            />
          )}
           {adSlotSide2 && (
             <GoogleAd
              adClient={adClient}
              adSlot={adSlotSide2} 
              adFormat="auto"
              responsive={true}
              className="min-h-[250px] w-full"
            />
           )}
        </div>
      );
    }
    if (position === 'bottom' && adSlotBottomMobile) {
      return (
        <div className="lg:hidden mt-8 w-full">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotBottomMobile}
            adFormat="auto"
            responsive={true}
            className="min-h-[100px] w-full"
          />
        </div>
      );
    }
    return null;
  };


  if (!allQuestions || allQuestions.length === 0) {
    return (
      <div className="container py-8 text-center">
         <Alert variant="destructive">
            <AlertTitle>{t('No Questions Loaded', 'कुनै प्रश्नहरू लोड भएनन्')}</AlertTitle>
            <AlertDescription>
                {t('There was an issue loading the practice questions. Please try refreshing the page.', 'अभ्यास प्रश्नहरू लोड गर्न समस्या भयो। कृपया पृष्ठ ताजा गर्ने प्रयास गर्नुहोस्।')}
            </AlertDescription>
        </Alert>
      </div>
    )
  }
    
  if (filteredQuestions.length === 0 && !quizFinished) { 
    return (
        <div className="container py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">{t('Practice Test', 'अभ्यास परीक्षा')}</h1>
            <div className="my-6 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-xl mx-auto">
                <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
                    <SelectTrigger className="w-full sm:w-[280px] mx-auto sm:mx-0">
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
                 <Button onClick={startNewSet} variant="outline" className="w-full sm:w-auto">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('Retry Load', 'पुनः प्रयास गर्नुहोस्')}
                </Button>
            </div>
            <Alert variant="destructive" className="max-w-xl mx-auto">
                <AlertTitle>{t('No Questions Available', 'कुनै प्रश्नहरू उपलब्ध छैनन्')}</AlertTitle>
                <AlertDescription>
                    {t(`Sorry, there are no questions available for the selected category: ${category}. Please try another category or retry loading.`, `माफ गर्नुहोस्, चयन गरिएको श्रेणी: ${category} को लागि कुनै प्रश्नहरू उपलब्ध छैनन्। कृपया अर्को श्रेणी प्रयास गर्नुहोस् वा पुनः लोड गर्ने प्रयास गर्नुहोस्।`)}
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (currentSetQuestions.length === 0 && filteredQuestions.length > 0 && !quizFinished) {
    return (
      <div className="container py-8 text-center">
        <p>{t('Loading questions for category...', 'श्रेणीको लागि प्रश्नहरू लोड हुँदैछ...')}</p>
        <Button onClick={startNewSet} variant="outline" className="mt-4">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('Reload Set', 'सेट पुनः लोड गर्नुहोस्')}
        </Button>
      </div>
    );
  }


  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        {renderAds('side')}
        <div className="flex-grow max-w-2xl w-full">
            {/* Header elements are moved to page.tsx for better structure */}
            
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
              <Button onClick={startNewSet} variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('New Set', 'नयाँ सेट')}
              </Button>
            </div>
            
            {!quizFinished && currentQuestion && (
              <Card className="shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle>{t(`Question ${currentQuestionIndex + 1} of ${currentSetQuestions.length}`, `प्रश्न ${currentQuestionIndex + 1} / ${currentSetQuestions.length}`)}</CardTitle>
                  {currentSetQuestions.length > 0 && <Progress value={((currentQuestionIndex + 1) / currentSetQuestions.length) * 100} className="mt-2 h-2.5" />}
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
                        data-ai-hint="traffic situation diagram"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    key={`${currentQuestion.id}-${currentQuestionIndex}`}
                    value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
                    onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                    className="space-y-3"
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
                        <Button variant="link" size="sm" onClick={() => setShowExplanation(!showExplanation)} className="p-0 mt-2 h-auto text-sm">
                           <Lightbulb className="mr-1 h-4 w-4" />
                          {showExplanation ? t('Hide Explanation', ' स्पष्टीकरण लुकाउनुहोस्') : t('Show Explanation', 'स्पष्टीकरण देखाउनुहोस्')}
                        </Button>
                      )}
                    </Alert>
                  )}
                  {showAnswer && showExplanation && (currentQuestion.explanation_en || currentQuestion.explanation_np) && (
                    <Card className="mt-4 bg-muted/30 border border-border">
                      <CardHeader><CardTitle className="text-base font-semibold">{t('Explanation', 'स्पष्टीकरण')}</CardTitle></CardHeader>
                      <CardContent className="text-sm">
                        {language === 'en' ? currentQuestion.explanation_en : currentQuestion.explanation_np}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                  <Button 
                    onClick={() => { 
                      if(currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(i => i-1); 
                        setSelectedAnswer(null); 
                        setShowAnswer(false);
                        setShowExplanation(false);
                      }
                    }} 
                    variant="outline" 
                    disabled={currentQuestionIndex === 0 || showAnswer}
                    className="rounded-lg"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> {t('Previous', 'अघिल्लो')}
                  </Button>
                  {showAnswer ? (
                    <Button onClick={handleNextQuestion} className="rounded-lg">
                      {currentQuestionIndex === currentSetQuestions.length - 1 ? t('View Results', 'नतिजा हेर्नुहोस्') : t('Next Question', 'अर्को प्रश्न')}
                       {currentQuestionIndex < currentSetQuestions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  ) : (
                    <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} className="rounded-lg">
                      {t('Check Answer', 'उत्तर जाँच गर्नुहोस्')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}

            {quizFinished && (
              <Card className="max-w-xl mx-auto text-center shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('Quiz Finished!', 'प्रश्नोत्तरी समाप्त भयो!')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl">
                    {t('Your Score:', 'तपाईंको स्कोर:')} <span className="font-bold text-primary">{score} / {currentSetQuestions.length}</span>
                  </p>
                  {currentSetQuestions.length > 0 && <Progress value={(score / currentSetQuestions.length) * 100} className="w-full h-3 rounded-full" />}
                  {currentSetQuestions.length > 0 && (
                      <p className={`text-lg font-semibold ${score / currentSetQuestions.length >= 0.7 ? 'text-accent' : 'text-destructive'}`}>
                      {score / currentSetQuestions.length >= 0.7 ? t('Great job! You passed.', 'राम्रो काम! तपाईं उत्तीर्ण हुनुभयो।') : t('Keep practicing! You can do better.', 'अभ्यास जारी राख्नुहोस्! तपाईं अझ राम्रो गर्न सक्नुहुन्छ।')}
                      </p>
                  )}
                  {currentSetQuestions.length === 0 && ( 
                      <p className="text-lg text-muted-foreground">{t('No questions were in this set to score.', 'यो सेटमा स्कोर गर्नका लागि कुनै प्रश्नहरू थिएनन्।')}</p>
                  )}
                  {incorrectAnswers.length > 0 && (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="rounded-lg">{t('Review Incorrect Answers', 'गलत उत्तरहरू समीक्षा गर्नुहोस्')}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('Incorrect Answers', 'गलत उत्तरहरू')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('Review the questions you answered incorrectly.', 'तपाईंले गलत उत्तर दिनुभएका प्रश्नहरूको समीक्षा गर्नुहोस्।')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 my-4">
                          {incorrectAnswers.map((q, idx) => (
                            <Card key={idx} className="p-4 rounded-md border-destructive bg-destructive/5">
                              <p className="font-semibold">{language === 'en' ? q.question_en : q.question_np}</p>
                              <p className="text-sm text-muted-foreground mt-1">{t('Correct Answer:', 'सही उत्तर:')} {language === 'en' ? q.options[q.correct_option_index].en.text : q.options[q.correct_option_index].np.text}</p>
                              {(q.explanation_en || q.explanation_np) && <p className="text-xs mt-1 text-muted-foreground italic">{language === 'en' ? q.explanation_en : q.explanation_np}</p>}
                            </Card>
                          ))}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">{t('Close', 'बन्द गर्नुहोस्')}</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={startNewSet} className="w-full rounded-lg">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('Practice Again', 'फेरि अभ्यास गर्नुहोस्')}
                  </Button>
                </CardFooter>
              </Card>
            )}
        </div>
        {renderAds('side')}
      </div>
      {renderAds('bottom')}
    </div>
  );
}
