
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PracticeQuestion, MockExamResult, ExamCategoryType } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import GoogleAd from '@/components/ads/GoogleAd';
import { ExamSetupScreen } from './ExamSetupScreen';
import { ExamInProgressScreen } from './ExamInProgressScreen';
import { ExamResultsScreen } from './ExamResultsScreen';

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60; // 25 minutes
const PASS_PERCENTAGE = 0.7; // 70% to pass

interface RealExamClientProps {
  allQuestions: PracticeQuestion[];
  initialCategory: ExamCategoryType;
}

export function RealExamClient({ allQuestions, initialCategory }: RealExamClientProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  // examCategory is now determined by the route and passed as initialCategory
  const [examCategory] = useState<ExamCategoryType>(initialCategory);
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

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotSide1 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_1;
  const adSlotSide2 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_2;
  const adSlotSide3 = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_SIDE_3;
  const adSlotBottomMobile = process.env.NEXT_PUBLIC_AD_SLOT_REAL_EXAM_BOTTOM_MOBILE;

  useEffect(() => {
    const storedResults = localStorage.getItem(`realExamResults_${examCategory}`);
    if (storedResults) {
      setPastResults(JSON.parse(storedResults));
    }
  }, [examCategory]);

  const saveResult = useCallback((result: MockExamResult) => {
    const updatedResults = [result, ...pastResults].slice(0, 10); // Keep last 10 results for this category
    setPastResults(updatedResults);
    localStorage.setItem(`realExamResults_${examCategory}`, JSON.stringify(updatedResults));
  }, [pastResults, examCategory]);

  const finishExamCallback = useCallback(() => {
    setExamFinished(currentExamFinished => {
      if (currentExamFinished) { // Prevent multiple calls
        return true;
      }

      setExamStarted(false); // Stop the timer and exam flow

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
        category: examCategory, // Category is fixed
      };
      setExamResult(resultData);
      saveResult(resultData);
      setShowResultsDialog(true); // Trigger results display
      return true; // Mark as finished
    });
  }, [examQuestions, userAnswers, examCategory, saveResult]);

  // Using a ref for finishExam to ensure the useEffect for the timer always has the latest version
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
            finishExamRef.current(); // Call the latest version of finishExam
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && examStarted && !examFinished) {
        // This condition ensures finishExam is called if timeLeft hits 0 directly
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
  }, [allQuestions, examCategory, t, toast]); // examCategory is stable as it comes from props

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
  
  const handleConfirmFinishExam = () => {
    finishExamRef.current();
  };

  const currentQuestion = examQuestions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderAds = (position: 'side-left' | 'side-right' | 'bottom-mobile') => {
    if (!adClient) return null;

    if (position === 'side-left' && adSlotSide1) {
      return (
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotSide1}
            adFormat="auto"
            responsive={true}
            className="min-h-[250px] w-full sticky top-20"
          />
        </aside>
      );
    }
    if (position === 'side-right') {
      return (
        <aside className="hidden lg:block w-48 space-y-6 shrink-0">
          {adSlotSide2 && (
            <GoogleAd
              adClient={adClient}
              adSlot={adSlotSide2}
              adFormat="auto"
              responsive={true}
              className="min-h-[250px] w-full sticky top-20"
            />
          )}
          {adSlotSide3 && (
            <GoogleAd
              adClient={adClient}
              adSlot={adSlotSide3}
              adFormat="auto"
              responsive={true}
              className="min-h-[250px] w-full sticky top-[calc(20px+250px+24px)]"
            />
          )}
        </aside>
      );
    }
    if (position === 'bottom-mobile' && adSlotBottomMobile) {
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

  const handleCloseResults = () => {
    setExamFinished(false); // Reset to setup screen
    setExamResult(null);
    // setShowResultsDialog(false); // Dialog state is managed by ExamResultsScreen
  };

  const handleRestartExam = () => {
    // Reset states and start new exam with the same (initial) category
    startExam();
  };


  if (!examStarted && !examFinished) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start">
        {renderAds('side-left')}
        <ExamSetupScreen
          fixedCategory={examCategory} // Pass the fixed category
          onStartExam={startExam}
          pastResults={pastResults}
          showPastResultsDialog={showPastResultsDialog}
          setShowPastResultsDialog={setShowPastResultsDialog}
          t={t}
        />
        {renderAds('side-right')}
        {renderAds('bottom-mobile')}
      </div>
    );
  }

  if (examStarted && currentQuestion && !examFinished) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full">
        {renderAds('side-left')}
        <ExamInProgressScreen
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          examQuestionsLength={examQuestions.length}
          timeLeftFormatted={formatTime(timeLeft)}
          userAnswers={userAnswers}
          onAnswerSelect={handleAnswerSelect}
          onNavigateQuestion={handleNavigateQuestion}
          onConfirmFinishExam={handleConfirmFinishExam}
          t={t}
          language={language}
        />
        {renderAds('side-right')}
        {renderAds('bottom-mobile')}
      </div>
    );
  }

  if (examFinished && examResult) {
     return (
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-start w-full">
        {/* Ads can remain for results screen if desired */}
        {renderAds('side-left')}
         <ExamResultsScreen
            examResult={examResult}
            examQuestions={examQuestions}
            passPercentage={PASS_PERCENTAGE}
            onClose={handleCloseResults} // This will take user back to ExamSetupScreen for the same category
            onRestartExam={handleRestartExam} // This will restart exam for the same category
            t={t}
            language={language}
            showResultsDialog={showResultsDialog}
            setShowResultsDialog={setShowResultsDialog}
        />
        {renderAds('side-right')}
        {renderAds('bottom-mobile')}
      </div>
    );
  }

  return null; // Should not be reached if logic is correct
}
