
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Question } from '@/lib/types'; // Updated type
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, Lightbulb, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type CategoryFilter = 'All' | 'A' | 'B' | 'K' | 'Traffic';

interface PracticeTestClientProps {
  allQuestions: Question[];
}

const QUESTIONS_PER_SET = 10; 

export function PracticeTestClient({ allQuestions }: PracticeTestClientProps) {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [currentSetQuestions, setCurrentSetQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null); // Store index
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  // Explanations are removed from the new Question type, so showExplanation state is removed.
  const [incorrectAnswers, setIncorrectAnswers] = useState<Question[]>([]);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_2;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_BOTTOM_MOBILE;

  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return [];
    if (category === 'All') return allQuestions;
    if (category === 'B' && allQuestions.filter(q => q.category === 'B').length === 0) {
        // Special handling for "Coming Soon" for category B
        return []; 
    }
    return allQuestions.filter(q => q.category === category);
  }, [allQuestions, category]);

  const startNewSet = () => {
    if (!filteredQuestions || filteredQuestions.length === 0) {
      if (category === 'B') { // Show coming soon specifically for B if it's empty
         setCurrentSetQuestions([]); // Ensure it's empty to trigger the "Coming Soon" message
      } else {
        setCurrentSetQuestions([]);
      }
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setShowAnswer(false);
      setScore(0);
      setQuizFinished(false); 
      setIncorrectAnswers([]);
      return;
    }
    
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SET);
    setCurrentSetQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
    setIncorrectAnswers([]);
  };
  
  useEffect(() => {
    startNewSet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, allQuestions]);


  const currentQuestion = currentSetQuestions && currentSetQuestions.length > 0 ? currentSetQuestions[currentQuestionIndex] : null;

  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null || !currentQuestion) return;
    setShowAnswer(true);
    const selectedAnswerText = currentQuestion.a4[selectedOptionIndex];
    if (selectedAnswerText === currentQuestion.an) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [...prev, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false); 
    setSelectedOptionIndex(null); 
    // setShowExplanation(false); // Removed

    if (currentQuestionIndex < currentSetQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const renderOption = (optionText: string, index: number) => {
    if (!currentQuestion) return null;
    const optionId = `option-practice-${currentQuestion.id}-${index}`;
    
    let optionStyle = "border-border hover:border-primary";
    if (showAnswer) {
      if (optionText === currentQuestion.an) { // Correct answer
        optionStyle = "border-accent bg-accent/10";
      } else if (selectedOptionIndex === index) { // User's incorrect selection
        optionStyle = "border-destructive bg-destructive/10";
      }
    } else if (selectedOptionIndex === index) { // User's current selection (before check)
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
            checked={selectedOptionIndex === index}
        />
        <Label htmlFor={optionId} className="flex-1 cursor-pointer text-base">
          {optionText}
          {/* Image rendering within options might be needed if data supports it */}
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
            <AlertTitle>कुनै प्रश्नहरू लोड भएनन्</AlertTitle>
            <AlertDescription>
                अभ्यास प्रश्नहरू लोड गर्न समस्या भयो। कृपया पृष्ठ ताजा गर्ने प्रयास गर्नुहोस्।
            </AlertDescription>
        </Alert>
      </div>
    )
  }
    
  if (filteredQuestions.length === 0 && category === 'B') {
    return (
        <div className="container py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">अभ्यास परीक्षा</h1>
            <div className="my-6 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-xl mx-auto">
                <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
                    <SelectTrigger className="w-full sm:w-[280px] mx-auto sm:mx-0">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="श्रेणी अनुसार फिल्टर गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">सबै श्रेणीहरू</SelectItem>
                        <SelectItem value="A">श्रेणी A (मोटरसाइकल)</SelectItem>
                        <SelectItem value="B">श्रेणी B (कार/जीप/भ्यान)</SelectItem>
                        <SelectItem value="K">श्रेणी K (स्कुटर)</SelectItem>
                        <SelectItem value="Traffic">ट्राफिक संकेत</SelectItem>
                    </SelectContent>
                </Select>
                 <Button onClick={startNewSet} variant="outline" className="w-full sm:w-auto">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  पुनः प्रयास गर्नुहोस्
                </Button>
            </div>
            <Alert variant="default" className="max-w-xl mx-auto">
                <AlertTitle>चाँडै आउँदैछ!</AlertTitle>
                <AlertDescription>
                    श्रेणी B (कार/जीप/भ्यान) को लागि प्रश्नहरू हाल उपलब्ध छैनन्। कृपया अर्को श्रेणी प्रयास गर्नुहोस्।
                </AlertDescription>
            </Alert>
        </div>
    );
  } else if (filteredQuestions.length === 0 && !quizFinished) {
       return (
        <div className="container py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">अभ्यास परीक्षा</h1>
            <div className="my-6 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-xl mx-auto">
                <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
                    <SelectTrigger className="w-full sm:w-[280px] mx-auto sm:mx-0">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="श्रेणी अनुसार फिल्टर गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">सबै श्रेणीहरू</SelectItem>
                        <SelectItem value="A">श्रेणी A (मोटरसाइकल)</SelectItem>
                        <SelectItem value="B">श्रेणी B (कार/जीप/भ्यान)</SelectItem>
                        <SelectItem value="K">श्रेणी K (स्कुटर)</SelectItem>
                        <SelectItem value="Traffic">ट्राफिक संकेत</SelectItem>
                    </SelectContent>
                </Select>
                 <Button onClick={startNewSet} variant="outline" className="w-full sm:w-auto">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  पुनः प्रयास गर्नुहोस्
                </Button>
            </div>
            <Alert variant="destructive" className="max-w-xl mx-auto">
                <AlertTitle>कुनै प्रश्नहरू उपलब्ध छैनन्</AlertTitle>
                <AlertDescription>
                    माफ गर्नुहोस्, चयन गरिएको श्रेणी: {category} को लागि कुनै प्रश्नहरू उपलब्ध छैनन्। कृपया अर्को श्रेणी प्रयास गर्नुहोस् वा पुनः लोड गर्ने प्रयास गर्नुहोस्।
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // Renamed loading state check
  if (currentSetQuestions.length === 0 && filteredQuestions.length > 0 && !quizFinished) {
    return (
      <div className="container py-8 text-center">
        <p>श्रेणीको लागि प्रश्नहरू लोड हुँदैछ...</p>
        <Button onClick={startNewSet} variant="outline" className="mt-4">
          <RotateCcw className="mr-2 h-4 w-4" />
          सेट पुनः लोड गर्नुहोस्
        </Button>
      </div>
    );
  }


  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        {renderAds('side')}
        <div className="flex-grow max-w-2xl w-full">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Select value={category} onValueChange={(value: CategoryFilter) => setCategory(value)}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="श्रेणी अनुसार फिल्टर गर्नुहोस्" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">सबै श्रेणीहरू</SelectItem>
                  <SelectItem value="A">श्रेणी A (मोटरसाइकल)</SelectItem>
                  <SelectItem value="B">श्रेणी B (कार/जीप/भ्यान)</SelectItem>
                  <SelectItem value="K">श्रेणी K (स्कुटर)</SelectItem>
                  <SelectItem value="Traffic">ट्राफिक संकेत</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={startNewSet} variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                नयाँ सेट
              </Button>
            </div>
            
            {!quizFinished && currentQuestion && (
              <Card className="shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle>प्रश्न {currentQuestionIndex + 1} / {currentSetQuestions.length}</CardTitle>
                  {currentSetQuestions.length > 0 && <Progress value={((currentQuestionIndex + 1) / currentSetQuestions.length) * 100} className="mt-2 h-2.5" />}
                  <CardDescription className="pt-6 text-xl font-semibold leading-relaxed">
                    {currentQuestion.qn} {/* Directly use qn */}
                  </CardDescription>
                  {currentQuestion.imageUrl && ( // Check for imageUrl
                    <div className="mt-4 flex justify-center">
                      <Image
                        src={currentQuestion.imageUrl}
                        alt="प्रश्न सम्बन्धित छवि"
                        width={300}
                        height={150}
                        className="rounded-md object-contain border"
                        data-ai-hint="traffic scenario diagram"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    key={`${currentQuestion.id}-${currentQuestionIndex}`}
                    value={selectedOptionIndex !== null ? selectedOptionIndex.toString() : undefined}
                    onValueChange={(value) => setSelectedOptionIndex(parseInt(value))}
                    className="space-y-3"
                  >
                    {currentQuestion.a4.map(renderOption)}
                  </RadioGroup>

                  {showAnswer && (
                    <Alert className={`mt-6 ${selectedOptionIndex !== null && currentQuestion.a4[selectedOptionIndex] === currentQuestion.an ? 'border-accent text-accent' : 'border-destructive text-destructive'}`}>
                      {selectedOptionIndex !== null && currentQuestion.a4[selectedOptionIndex] === currentQuestion.an ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      <AlertTitle>{selectedOptionIndex !== null && currentQuestion.a4[selectedOptionIndex] === currentQuestion.an ? 'सही!' : 'गलत!'}</AlertTitle>
                      <AlertDescription>
                        सही उत्तर हो: {currentQuestion.an}
                      </AlertDescription>
                      {/* Explanations removed */}
                    </Alert>
                  )}
                  {/* Explanation display removed */}
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                  <Button 
                    onClick={() => { 
                      if(currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(i => i-1); 
                        setSelectedOptionIndex(null); 
                        setShowAnswer(false);
                        // setShowExplanation(false); // Removed
                      }
                    }} 
                    variant="outline" 
                    disabled={currentQuestionIndex === 0 || showAnswer}
                    className="rounded-lg"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> अघिल्लो
                  </Button>
                  {showAnswer ? (
                    <Button onClick={handleNextQuestion} className="rounded-lg">
                      {currentQuestionIndex === currentSetQuestions.length - 1 ? 'नतिजा हेर्नुहोस्' : 'अर्को प्रश्न'}
                       {currentQuestionIndex < currentSetQuestions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  ) : (
                    <Button onClick={handleAnswerSubmit} disabled={selectedOptionIndex === null} className="rounded-lg">
                      उत्तर जाँच गर्नुहोस्
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}

            {quizFinished && (
              <Card className="max-w-xl mx-auto text-center shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">प्रश्नोत्तरी समाप्त भयो!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl">
                    तपाईंको स्कोर: <span className="font-bold text-primary">{score} / {currentSetQuestions.length}</span>
                  </p>
                  {currentSetQuestions.length > 0 && <Progress value={(score / currentSetQuestions.length) * 100} className="w-full h-3 rounded-full" />}
                  {currentSetQuestions.length > 0 && (
                      <p className={`text-lg font-semibold ${score / currentSetQuestions.length >= 0.7 ? 'text-accent' : 'text-destructive'}`}>
                      {score / currentSetQuestions.length >= 0.7 ? 'राम्रो काम! तपाईं उत्तीर्ण हुनुभयो।' : 'अभ्यास जारी राख्नुहोस्! तपाईं अझ राम्रो गर्न सक्नुहुन्छ।'}
                      </p>
                  )}
                  {currentSetQuestions.length === 0 && ( 
                      <p className="text-lg text-muted-foreground">यो सेटमा स्कोर गर्नका लागि कुनै प्रश्नहरू थिएनन्।</p>
                  )}
                  {incorrectAnswers.length > 0 && (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="rounded-lg">गलत उत्तरहरू समीक्षा गर्नुहोस्</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>गलत उत्तरहरू</AlertDialogTitle>
                          <AlertDialogDescription>
                            तपाईंले गलत उत्तर दिनुभएका प्रश्नहरूको समीक्षा गर्नुहोस्।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 my-4">
                          {incorrectAnswers.map((q, idx) => (
                            <Card key={idx} className="p-4 rounded-md border-destructive bg-destructive/5">
                              <p className="font-semibold">{q.qn || `प्रश्न ${q.n}`}</p>
                              {q.imageUrl && (
                                 <Image src={q.imageUrl} alt={`प्रश्न ${q.n} को छवि`} width={150} height={75} className="my-1 rounded-sm border" data-ai-hint="question illustration" />
                              )}
                              <p className="text-sm text-muted-foreground mt-1">सही उत्तर: {q.an}</p>
                            </Card>
                          ))}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">बन्द गर्नुहोस्</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={startNewSet} className="w-full rounded-lg">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    फेरि अभ्यास गर्नुहोस्
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
