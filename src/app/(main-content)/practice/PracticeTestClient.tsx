
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, Lightbulb, ChevronLeft, ChevronRight, Home, ListChecks } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

interface PracticeTestClientProps {
  questionsForCurrentPage: Question[];
  currentPage: number;
  totalPages: number;
  category: string; // 'A' or 'B'
}

export function PracticeTestClient({ 
  questionsForCurrentPage, 
  currentPage, 
  totalPages, 
  category 
}: PracticeTestClientProps) {
  const [currentQuestionIndexOnPage, setCurrentQuestionIndexOnPage] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scoreForPage, setScoreForPage] = useState(0);
  const [pageFinished, setPageFinished] = useState(false);
  const [incorrectAnswersOnPage, setIncorrectAnswersOnPage] = useState<Question[]>([]);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_SIDE_2;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_PRACTICE_BOTTOM_MOBILE;

  const startNewPage = () => {
    setCurrentQuestionIndexOnPage(0);
    setSelectedOptionIndex(null);
    setShowAnswer(false);
    setScoreForPage(0);
    setPageFinished(false);
    setIncorrectAnswersOnPage([]);
  };

  useEffect(() => {
    startNewPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsForCurrentPage, currentPage]);

  const currentQuestion = questionsForCurrentPage && questionsForCurrentPage.length > 0 ? questionsForCurrentPage[currentQuestionIndexOnPage] : null;

  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null || !currentQuestion) return;
    setShowAnswer(true);
    const selectedAnswerText = currentQuestion.a4[selectedOptionIndex];
    if (selectedAnswerText === currentQuestion.an) {
      setScoreForPage(prev => prev + 1);
    } else {
      setIncorrectAnswersOnPage(prev => [...prev, currentQuestion]);
    }
  };

  const handleNextQuestionOnPage = () => {
    setShowAnswer(false);
    setSelectedOptionIndex(null);

    if (currentQuestionIndexOnPage < questionsForCurrentPage.length - 1) {
      setCurrentQuestionIndexOnPage(prev => prev + 1);
    } else {
      setPageFinished(true);
    }
  };

  const renderOption = (optionText: string, index: number) => {
    if (!currentQuestion) return null;
    const optionId = `option-practice-${currentQuestion.id}-${index}-${currentPage}`;
    
    let optionStyle = "border-border hover:border-primary";
    if (showAnswer) {
      if (optionText === currentQuestion.an) {
        optionStyle = "border-accent bg-accent/10";
      } else if (selectedOptionIndex === index) {
        optionStyle = "border-destructive bg-destructive/10";
      }
    } else if (selectedOptionIndex === index) {
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
            <GoogleAd adClient={adClient} adSlot={adSlotSide1} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-20" />
          )}
          {adSlotSide2 && (
            <GoogleAd adClient={adClient} adSlot={adSlotSide2} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]" />
          )}
        </div>
      );
    }
    if (position === 'bottom' && adSlotBottomMobile) {
      return (
        <div className="lg:hidden mt-8 w-full">
          <GoogleAd adClient={adClient} adSlot={adSlotBottomMobile} adFormat="auto" responsive={true} className="min-h-[100px] w-full" />
        </div>
      );
    }
    return null;
  };

  if (!questionsForCurrentPage || questionsForCurrentPage.length === 0) {
    return (
      <div className="container py-8 text-center">
         <Alert variant="destructive">
            <AlertTitle>No Questions Loaded For This Page</AlertTitle>
            <AlertDescription>
                There was an issue loading questions for this page. Please try navigating or selecting a category again.
            </AlertDescription>
        </Alert>
         <Button asChild className="mt-6"><Link href="/practice"><Home className="mr-2 h-4 w-4"/>Back to Category Selection</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        {renderAds('side')}
        <div className="flex-grow max-w-2xl w-full">
            {!pageFinished && currentQuestion && (
              <Card className="shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle>प्रश्न {currentQuestionIndexOnPage + 1} / {questionsForCurrentPage.length} (Page {currentPage}/{totalPages})</CardTitle>
                  {questionsForCurrentPage.length > 0 && <Progress value={((currentQuestionIndexOnPage + 1) / questionsForCurrentPage.length) * 100} className="mt-2 h-2.5" />}
                  <CardDescription className="pt-6 text-xl font-semibold leading-relaxed">
                    {currentQuestion.qn || "चित्रमा आधारित प्रश्न:"}
                  </CardDescription>
                  {currentQuestion.imageUrl && (
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
                    key={`${currentQuestion.id}-${currentQuestionIndexOnPage}-${currentPage}-${selectedOptionIndex}`}
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
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                   <Button
                    onClick={() => {
                        if (currentQuestionIndexOnPage > 0) {
                            setCurrentQuestionIndexOnPage(i => i - 1);
                            setSelectedOptionIndex(null);
                            setShowAnswer(false);
                        }
                    }}
                    variant="outline"
                    disabled={currentQuestionIndexOnPage === 0 || showAnswer}
                    className="rounded-lg"
                    >
                    <ChevronLeft className="mr-2 h-4 w-4" /> अघिल्लो
                    </Button>
                  {showAnswer ? (
                    <Button onClick={handleNextQuestionOnPage} className="rounded-lg">
                      {currentQuestionIndexOnPage === questionsForCurrentPage.length - 1 ? 'Page Results' : 'अर्को प्रश्न'}
                       {currentQuestionIndexOnPage < questionsForCurrentPage.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  ) : (
                    <Button onClick={handleAnswerSubmit} disabled={selectedOptionIndex === null} className="rounded-lg">
                      उत्तर जाँच गर्नुहोस्
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}

            {pageFinished && (
              <Card className="max-w-xl mx-auto text-center shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Page {currentPage} Finished!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl">
                    Your score for this page: <span className="font-bold text-primary">{scoreForPage} / {questionsForCurrentPage.length}</span>
                  </p>
                  {questionsForCurrentPage.length > 0 && <Progress value={(scoreForPage / questionsForCurrentPage.length) * 100} className="w-full h-3 rounded-full" />}
                  
                  {incorrectAnswersOnPage.length > 0 && (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="rounded-lg mt-4">Review Incorrect Answers (This Page)</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Incorrect Answers - Page {currentPage}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Review the questions you answered incorrectly on this page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 my-4">
                          {incorrectAnswersOnPage.map((q, idx) => (
                            <Card key={`${q.id}-incorrect-${idx}`} className="p-4 rounded-md border-destructive bg-destructive/5">
                              <p className="font-semibold">{q.qn || `Question (Image ID: ${q.n})`}</p>
                              {q.imageUrl && (
                                 <Image src={q.imageUrl} alt={`Image for question ${q.n}`} width={150} height={75} className="my-1 rounded-sm border" data-ai-hint="question illustration" />
                              )}
                              <p className="text-sm text-muted-foreground mt-1">Correct Answer: {q.an}</p>
                            </Card>
                          ))}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
                <CardFooter className="flex-col sm:flex-row justify-center gap-3 pt-6">
                  {currentPage > 1 && (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href={`/practice/${category}/${currentPage - 1}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
                      </Link>
                    </Button>
                  )}
                  {currentPage < totalPages && (
                    <Button asChild className="w-full sm:w-auto">
                      <Link href={`/practice/${category}/${currentPage + 1}`}>
                        Next Page <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {(currentPage === totalPages) && (
                     <p className="text-center text-accent font-semibold w-full py-2">You've completed all pages for this category!</p>
                  )}
                   <Button asChild variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0">
                      <Link href="/practice">
                        <ListChecks className="mr-2 h-4 w-4" /> Choose Another Category
                      </Link>
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
