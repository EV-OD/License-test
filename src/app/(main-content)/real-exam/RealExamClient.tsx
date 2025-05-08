
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
  isCategoryBComingSoon: boolean; // Add this prop
}

export function RealExamClient({ allQuestions, initialCategory, isCategoryBComingSoon }: RealExamClientProps) {
  const { toast } = useToast();

  const [examCategory] = useState<ExamCategoryType>(initialCategory);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]); // Stores selected option index
  const [timeLeft, setTimeLeft] = useState(REAL_EXAM_TIME_LIMIT_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showPastResultsDialog, setShowPastResultsDialog] = useState(false);
  const [pastResults, setPastResults] = useState<MockExamResult[]>([]);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_2;
  const adSlotSide3 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_3;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_BOTTOM_MOBILE;

  // Filter questions based on the fixed category
  const categoryQuestions = useMemo(() => {
    if (examCategory === 'Mixed') return allQuestions;
    return allQuestions.filter(q => q.category === examCategory);
  }, [allQuestions, examCategory]);


  useEffect(() => {
    const storedResults = localStorage.getItem(`realExamResults_${examCategory}`);
    if (storedResults) {
      try {
        setPastResults(JSON.parse(storedResults));
      } catch (e) {
        console.error("Failed to parse past results:", e);
        localStorage.removeItem(`realExamResults_${examCategory}`); // Clear invalid data
      }
    } else {
        setPastResults([]); // Ensure it's an empty array if nothing is stored
    }
  }, [examCategory]);


  const saveResult = useCallback((result: MockExamResult) => {
     const currentResults = localStorage.getItem(`realExamResults_${examCategory}`);
    let existingResults: MockExamResult[] = [];
    if (currentResults) {
        try {
            existingResults = JSON.parse(currentResults);
             if (!Array.isArray(existingResults)) { // Basic validation
               existingResults = [];
             }
        } catch (e) {
            console.error("Error parsing existing results:", e);
            existingResults = []; // Reset if parsing fails
        }
    }
    const updatedResults = [result, ...existingResults].slice(0, 10); // Prepend new result and limit
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
    // Use the pre-filtered questions for the current category
    const questionsForExam = [...categoryQuestions].sort(() => 0.5 - Math.random()).slice(0, REAL_EXAM_QUESTIONS_COUNT);

    if (questionsForExam.length < REAL_EXAM_QUESTIONS_COUNT && questionsForExam.length > 0) {
      toast({
        title: "चेतावनी",
        description: `श्रेणी ${examCategory} को लागि पूर्ण वास्तविक परीक्षा सिमुलेशनको लागि पर्याप्त प्रश्नहरू छैनन्। ${questionsForExam.length} प्रश्नहरू प्रयोग गर्दै। लक्ष्य ${REAL_EXAM_QUESTIONS_COUNT} हो।`,
        variant: "default",
      });
    } else if (questionsForExam.length === 0) {
       if (examCategory !== 'B') { // Only show error if not category B (handled by coming soon)
           toast({
             title: "त्रुटि",
             description: `श्रेणी ${examCategory} को लागि कुनै प्रश्नहरू उपलब्ध छैनन्। परीक्षा सुरु गर्न सकिँदैन।`,
             variant: "destructive",
           });
        }
      return; // Don't start exam if no questions or if category B is coming soon
    }

    setExamQuestions(questionsForExam);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questionsForExam.length).fill(null));
    setTimeLeft(REAL_EXAM_TIME_LIMIT_SECONDS);
    setExamStarted(true);
    setExamFinished(false);
    setExamResult(null);
    setShowResultsDialog(false);
  }, [categoryQuestions, examCategory, toast]); 

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
        {adClient && adSlotSide1 && (
            <aside className="hidden lg:block w-48 space-y-6 shrink-0 sticky top-20">
                <GoogleAd adClient={adClient} adSlot={adSlotSide1} adFormat="auto" responsive={true} className="min-h-[250px] w-full"/>
            </aside>
        )}
        {!(adClient && adSlotSide1) && <div className="hidden lg:block w-48 shrink-0"></div> }

        <ExamSetupScreen
          fixedCategory={examCategory}
          onStartExam={startExam}
          pastResults={pastResults}
          showPastResultsDialog={showPastResultsDialog}
          setShowPastResultsDialog={setShowPastResultsDialog}
          isCategoryBComingSoon={isCategoryBComingSoon} // Pass the prop
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
           <div className="lg:block w-48 shrink-0">
            <QuestionStatusIndicator
              questions={examQuestions}
              userAnswers={userAnswers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleSelectQuestionFromIndicator}
              // t function removed as it's monolingual now
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
            // t and language props removed
          />

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
                className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]"
              />
            )}
             {!adClient && <div className="min-h-[250px] w-full sticky top-20"/>}
          </aside>
        </div>

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
              // t removed
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
        <div className="hidden lg:block w-48 shrink-0 space-y-6">
            {adClient && adSlotSide1 ? (
                <GoogleAd adClient={adClient} adSlot={adSlotSide1} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-20"/>
            ) : examQuestions.length > 0 ? (
                 <QuestionStatusIndicator
                    questions={examQuestions}
                    userAnswers={userAnswers} 
                    currentQuestionIndex={-1} 
                    onQuestionSelect={() => {}}
                    // t removed
                    layout="desktop"
                    className="sticky top-20 opacity-70" 
                />
            ) : <div className="w-48 shrink-0" />}
        </div>
         <ExamResultsScreen
            examResult={examResult}
            examQuestions={examQuestions}
            passPercentage={PASS_PERCENTAGE}
            onClose={handleCloseResults} 
            onRestartExam={handleRestartExam} 
            // t and language removed
            showResultsDialog={showResultsDialog}
            setShowResultsDialog={setShowResultsDialog}
        />
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
            {adClient && adSlotSide2 && (<GoogleAd adClient={adClient} adSlot={adSlotSide2} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-20"/>)}
            {adClient && adSlotSide3 && (<GoogleAd adClient={adClient} adSlot={adSlotSide3} adFormat="auto" responsive={true} className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]"/>)}
            {!adClient && <div className="w-48 shrink-0"/>}
        </aside>

        <div className="lg:hidden mt-8 w-full">
          {adClient && adSlotBottomMobile ? (
            <GoogleAd adClient={adClient} adSlot={adSlotBottomMobile} adFormat="auto" responsive={true} className="min-h-[100px] w-full"/>
          ) : examQuestions.length > 0 ? (
            <QuestionStatusIndicator
                questions={examQuestions}
                userAnswers={userAnswers}
                currentQuestionIndex={-1}
                onQuestionSelect={() => {}}
                // t removed
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
