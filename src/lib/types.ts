
import type { LucideIcon, Car, Bike, Layers, Home, FileText, TrafficCone, Timer, Rss, Film, HelpCircle, Mail, ListChecks, TrendingUp, WifiOff, BookOpen, Video, HelpCircleIcon, ClipboardCheck } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  avatarImage?: string;
  avatarFallback: string;
};

export type ResourceLink = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

// New Question type based on ak.json format and trafficqn.json requirements
export type Question = {
  id: string; // Unique identifier, can be same as 'n' or generated
  n: string; // Question number/identifier from source
  category: 'A' | 'B' | 'Traffic'; // Category of the question. 'A' now includes former 'K'.
  qn?: string; // Question text (for text-based questions like A, B)
  imageUrl?: string; // Image URL (for image-based questions like Traffic)
  a4: string[]; // Array of 4 option strings
  an: string; // The correct answer string (must be one of the strings in a4)
};


// Traffic Sign type for the /traffic-signs learning page
// Name, description, and category are now expected to be in English.
export type TrafficSign = {
  id: string;
  name: string; // English name
  image_url: string;
  description: string; // English description
  category: string; // English category
};

// Exam Types (Common structure for Real Exam)
export type ExamCategoryType = 'A' | 'B' | 'Mixed' | 'Traffic';

export type MockExamResult = {
  score: number;
  totalQuestions: number;
  date: string; // ISO string
  answers: { questionId: string; selectedOptionIndex: number | null; isCorrect: boolean }[]; // Storing index
  category: ExamCategoryType;
};
```