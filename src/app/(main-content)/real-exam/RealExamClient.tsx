
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Question, MockExamResult, ExamCategoryType } from '@/lib/types'; // Updated types
import { useToast } from '@/hooks/use-toast';
import GoogleAd from '@/components/ads/GoogleAd';
import { ExamSetupScreen } from './ExamSetupScreen';
import { ExamInProgressScreen } from './ExamInProgressScreen';
import { ExamResultsScreen } from './ExamResultsScreen';
import { QuestionStatusIndicator } from '@/components/shared/QuestionStatusIndicator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Import Alert

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60; // 25 minutes
const PASS_PERCENTAGE = 0.7; // 70% to pass

interface RealExamClientProps {
  allQuestions: Question[];
  initialCategory: ExamCategoryType;
  isCategoryBComingSoon: boolean; 
}

export function RealExamClient({ allQuestions, initialCategory, isCategoryBComingSoon }: RealExamClientProps) {
  const { toast } = useToast();

  const [examCategory] = useState<ExamCategoryType>(initialCategory);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]); 
  const [timeLeft, setTimeLeft] = useState(REAL_EXAM_TIME_LIMIT_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showPastResultsDialog, setShowPastResultsDialog] = useState(false);
  const [pastResults, setPastResults] = useState<MockExamResult[]>([]);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_1; // This is now for QuestionStatusIndicator
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_2;
  const adSlotSide3 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_3;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_BOTTOM_MOBILE;

  const categoryQuestions = useMemo(() => {
    if (examCategory === 'Mixed') return allQuestions;
    return allQuestions.filter(q => q.category === examCategory);
  }, [allQuestions, examCategory]);


  useEffect(() => {
    const storedResults = localStorage.getItem(`realExamResults_${examCategory}`);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        if (Array.isArray(parsedResults)) {
          setPastResults(parsedResults);
        } else {
          setPastResults([]);
          localStorage.removeItem(`realExamResults_${examCategory}`);
        }
      } catch (e) {
        console.error("Failed to parse past results:", e);
        setPastResults([]);
        localStorage.removeItem(`realExamResults_${examCategory}`); 
      }
    } else {
        setPastResults([]); 
    }
  }, [examCategory]);


  const saveResult = useCallback((result: MockExamResult) => {
     const currentResults = localStorage.getItem(`realExamResults_${examCategory}`);
    let existingResults: MockExamResult[] = [];
    if (currentResults) {
        try {
            existingResults = JSON.parse(currentResults);
             if (!Array.isArray(existingResults)) { 
               existingResults = [];
             }
        } catch (e) {
            console.error("Error parsing existing results:", e);
            existingResults = []; 
        }
    }
    const updatedResults = [result, ...existingResults].slice(0, 10); 
    setPastResults(updatedResults);
    localStorage.setItem(`realExamResults_${examCategory}`, JSON.stringify(updatedResults));
  }, [examCategory]);

  const finishExamCallback = useCallback(() => {
    setExamFinished(currentExamFinished => {
      if (currentExamFinished) { 
        return true;
      }

      setExamStarted(false); 

      let score = 0;
      const answerDetails = examQuestions.map((q, idx) => {
        const selectedIndex = userAnswers[idx];
        const isCorrect = selectedIndex !== null && q.a4[selectedIndex] === q.an;
        if (isCorrect) score++;
        return { questionId: q.id, selectedOptionIndex: selectedIndex, isCorrect };
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
      return true; 
    });
  }, [examQuestions, userAnswers, examCategory, saveResult]);

  const finishExamRef = useRef(finishExamCallback);
  useEffect(() => {
    finishExamRef.current = finishExamCallback;
  }, [finishExamCallback]);

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
        finishExamRef.current();
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);


  const startExam = useCallback(() => {
    const questionsForExam = [...categoryQuestions].sort(() => 0.5 - Math.random()).slice(0, REAL_EXAM_QUESTIONS_COUNT);

    if (questionsForExam.length < REAL_EXAM_QUESTIONS_COUNT && questionsForExam.length > 0) {
      toast({
        title: "Warning",
        description: `Not enough questions for category ${examCategory} for a full real exam simulation. Using ${questionsForExam.length} questions. Target is ${REAL_EXAM_QUESTIONS_COUNT}.`,
        variant: "default",
      });
    } else if (questionsForExam.length === 0) {
       if (examCategory !== 'B' || (examCategory === 'B' && !isCategoryBComingSoon)) { 
           toast({
             title: "Error",
             description: `No questions available for category ${examCategory}. Cannot start the exam.`,
             variant: "destructive",
           });
        }
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
  }, [categoryQuestions, examCategory, toast, isCategoryBComingSoon]); 

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNavigateQuestion = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentQuestionIndex(prev => Math.min(examQuestions.length - 1, prev + 1));
    } else {
      setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleSelectQuestionFromIndicator = (index: number) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const handleConfirmFinishExam = () => {
    finishExamRef.current();
  };

  const currentQuestion = examQuestions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleCloseResults = () => {
    setExamFinished(false); 
    setExamResult(null);
    setShowResultsDialog(false); 
  };

  const handleRestartExam = () => {
    setShowResultsDialog(false);
    startExam();
  };


  if (!examStarted && !examFinished) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start">
        {/* Desktop Left Sidebar Slot: Ad or empty placeholder if no ad for QuestionStatusIndicator */}
        <aside className="hidden lg:block w-48 space-y-6 shrink-0 sticky top-20">
            {adClient && adSlotSide1 && ( // This ad slot can be for general purposes on setup screen
                <GoogleAd adClient={adClient} adSlot={adSlotSide1} adFormat="auto" responsive={true} className="min-h-[250px] w-full"/>
            )}
            {/* If no ad, this space will be empty or can hold other content if needed */}
        </aside>
        {!adClient && <div className="hidden lg:block w-48 shrink-0"></div> } {/* Ensure layout consistency */}


        <ExamSetupScreen
          fixedCategory={examCategory}
          onStartExam={startExam}
          pastResults={pastResults}
          showPastResultsDialog={showPastResultsDialog}
          setShowPastResultsDialog={setShowPastResultsDialog}
          isCategoryBComingSoon={isCategoryBComingSoon} 
        />
        
        <aside className="hidden lg:block w-48 space-y-6 shrink-0 sticky top-20">
          {adClient && adSlotSide2 && (
            <GoogleAd adClient={adClient} adSlot={adSlotSide2} adFormat="auto" responsive={true} className="min-h-[250px] w-full"/>
          )}
           {adClient && adSlotSide3 && (
            <GoogleAd adClient={adClient} adSlot={adSlotSide3} adFormat="auto" responsive={true} className="min-h-[250px] w-full mt-6"/>
          )}
        </aside>
        {!(adClient && (adSlotSide2 || adSlotSide3)) && <div className="hidden lg:block w-48 shrink-0"></div> }


        {adClient && adSlotBottomMobile && (
          <div className="lg:hidden mt-8 w-full">
            <GoogleAd adClient={adClient} adSlot={adSlotBottomMobile} adFormat="auto" responsive={true} className="min-h-[100px] w-full"/>
          </div>
        )}
      </div>
    );
  }

  if (examStarted && currentQuestion && !examFinished) {
    return (
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
          {/* Desktop Left Sidebar: QuestionStatusIndicator */}
           <div className="hidden lg:block w-48 shrink-0">
            <QuestionStatusIndicator
              questions={examQuestions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleSelectQuestionFromIndicator}
              layout="desktop"
              className="sticky top-20" 
            />
          </div>

          <ExamInProgressScreen
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            examQuestionsLength={examQuestions.length}
            timeLeftFormatted={formatTime(timeLeft)}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNavigateQuestion={handleNavigateQuestion}
            onConfirmFinishExam={handleConfirmFinishExam}
          />

          {/* Desktop Right Sidebar: Ads */}
          <aside className="hidden lg:block w-48 space-y-6 shrink-0">
            {adClient && adSlotSide2 && (
              <GoogleAd
                adClient={adClient}
                adSlot={adSlotSide2}
                adFormat="auto"
                responsive={true}
                className="min-h-[250px] w-full sticky top-20"
              />
            )}
            {adClient && adSlotSide3 && (
              <GoogleAd
                adClient={adClient}
                adSlot={adSlotSide3}
                adFormat="auto"
                responsive={true}
                className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]" // Adjust top position
              />
            )}
             {!adClient && <div className="min-h-[250px] w-full sticky top-20"/>} {/* Placeholder if no ads */}
          </aside>
        </div>

        {/* Mobile Bottom: Ad or QuestionStatusIndicator */}
        <div className="lg:hidden mt-8 w-full">
          {adClient && adSlotBottomMobile ? (
            <GoogleAd
              adClient={adClient}
              adSlot={adSlotBottomMobile}
              adFormat="auto"
              responsive={true}
              className="min-h-[100px] w-full"
            />
          ) : (
            <QuestionStatusIndicator
              questions={examQuestions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleSelectQuestionFromIndicator}
              layout="mobile"
            />
          )}
        </div>
      </div>
    );
  }

  if (examFinished && examResult) {
     return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start w-full">
        {/* Desktop Left Sidebar: QuestionStatusIndicator (optional, could be an ad too) */}
        <div className="hidden lg:block w-48 shrink-0 space-y-6">
            {examQuestions.length > 0 ? (
                 <QuestionStatusIndicator
                    questions={examQuestions}
                    userAnswers={userAnswers} 
                    currentQuestionIndex={-1} // Indicates exam is finished
                    onQuestionSelect={() => {}} // No action on select
                    layout="desktop"
                    className="sticky top-20 opacity-70" // Dimmed appearance
                />
            ) : adClient && adSlotSide1 ? ( // Fallback to ad if no questions somehow
                <GoogleAd adClient={adClient} adSlot={adSlotSide1} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-20"/>
            ) : <div className="w-48 shrink-0" />}
        </div>

         <ExamResultsScreen
            examResult={examResult}
            examQuestions={examQuestions}
            passPercentage={PASS_PERCENTAGE}
            onClose={handleCloseResults} 
            onRestartExam={handleRestartExam} 
            showResultsDialog={showResultsDialog}
            setShowResultsDialog={setShowResultsDialog}
        />

        {/* Desktop Right Sidebar: Ads */}
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
            {adClient && adSlotSide2 && (<GoogleAd adClient={adClient} adSlot={adSlotSide2} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-20"/>)}
            {adClient && adSlotSide3 && (<GoogleAd adClient={adClient} adSlot={adSlotSide3} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]"/>)}
            {!adClient && <div className="w-48 shrink-0"/>}
        </aside>

        {/* Mobile Bottom: Ad or QuestionStatusIndicator */}
        <div className="lg:hidden mt-8 w-full">
          {adClient && adSlotBottomMobile ? (
            <GoogleAd adClient={adClient} adSlot={adSlotBottomMobile} adFormat="auto" responsive={true} className="min-h-[100px] w-full"/>
          ) : examQuestions.length > 0 ? (
            <QuestionStatusIndicator
                questions={examQuestions}
                userAnswers={userAnswers}
                currentQuestionIndex={-1}
                onQuestionSelect={() => {}}
                layout="mobile"
                className="opacity-70" 
            />
          ): null}
        </div>
      </div>
    );
  }

  return null; 
}
