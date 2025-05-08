
'use client';

import type React from 'react';
import type { MockExamResult, ExamCategoryType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, ClipboardCheckIcon, Tag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Import Alert components

const REAL_EXAM_QUESTIONS_COUNT = 25;
const REAL_EXAM_TIME_LIMIT_SECONDS = 25 * 60;

interface ExamSetupScreenProps {
  fixedCategory: ExamCategoryType;
  onStartExam: () => void;
  pastResults: MockExamResult[];
  showPastResultsDialog: boolean;
  setShowPastResultsDialog: (show: boolean) => void;
  isCategoryBComingSoon: boolean; // Add prop to indicate coming soon status
}

// Helper to get category display name (monolingual)
function getCategoryDisplayName(category: ExamCategoryType): string {
  switch (category) {
    case 'A': return 'श्रेणी A (मोटरसाइकल)';
    case 'B': return 'श्रेणी B (कार/जीप/भ्यान)';
    case 'K': return 'श्रेणी K (स्कुटर)';
    case 'Traffic': return 'ट्राफिक संकेत';
    case 'Mixed': return 'मिश्रित (सबै श्रेणीहरू)';
    default: return category;
  }
}


export function ExamSetupScreen({
  fixedCategory,
  onStartExam,
  pastResults,
  showPastResultsDialog,
  setShowPastResultsDialog,
  isCategoryBComingSoon, // Use the prop
}: ExamSetupScreenProps) {
  const categoryDisplayName = getCategoryDisplayName(fixedCategory);

  return (
    <div className="flex-grow max-w-lg w-full">
      <Card className="w-full shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">वास्तविक परीक्षा सेटअप</CardTitle>
          <CardDescription>यस श्रेणीको लागि आधिकारिक लिखित परीक्षाको अनुभवको लागि तयारी गर्नुहोस्: <span className="font-semibold text-primary">{categoryDisplayName}</span>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="flex items-center mb-2">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-semibold text-lg">चयन गरिएको श्रेणी</h3>
            </div>
            <p className="text-xl font-bold text-primary">{categoryDisplayName}</p>
            {fixedCategory === 'Mixed' && (
                <p className="text-xs text-muted-foreground mt-1">यसले आधिकारिक परीक्षाको सबैभन्दा यथार्थपरक सिमुलेशन प्रदान गर्दछ।</p>
            )}
          </div>

           {/* Display "Coming Soon" message for Category B */}
          {isCategoryBComingSoon && (
             <Alert variant="default">
                {/* <AlertTitle>चाँडै आउँदैछ!</AlertTitle> */}
                <AlertDescription>
                    श्रेणी B (कार/जीप/भ्यान) को लागि प्रश्नहरू हाल उपलब्ध छैनन्।
                </AlertDescription>
            </Alert>
          )}

          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-semibold">परीक्षा विवरण:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>प्रश्नहरूको संख्या: {REAL_EXAM_QUESTIONS_COUNT}</li>
              <li>समय सीमा: {REAL_EXAM_TIME_LIMIT_SECONDS / 60} मिनेट</li>
              <li>समाप्ति पछि नतिजा देखाइनेछ।</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button onClick={onStartExam} className="w-full text-lg py-6 rounded-lg" disabled={isCategoryBComingSoon}>
            <ClipboardCheckIcon className="mr-2 h-5 w-5" />
            वास्तविक परीक्षा सुरु गर्नुहोस्
          </Button>
          {pastResults.length > 0 && (
            <AlertDialog open={showPastResultsDialog} onOpenChange={setShowPastResultsDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-lg" disabled={isCategoryBComingSoon}><History className="mr-2 h-4 w-4" />यस श्रेणीका विगतका नतिजाहरू हेर्नुहोस्</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-h-[80vh] overflow-y-auto rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>विगतका परीक्षा नतिजाहरू: {categoryDisplayName}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-3 my-4">
                  {pastResults.map((res, idx) => (
                    <Card key={idx} className="p-3 rounded-md">
                      <p>मिति: {new Date(res.date).toLocaleDateString('ne-NP')} {res.category ? `(श्रेणी: ${getCategoryDisplayName(res.category)})` : ''}</p>
                      <p>स्कोर: {res.score}/{res.totalQuestions}</p>
                    </Card>
                  ))}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-md">बन्द गर्नुहोस्</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
