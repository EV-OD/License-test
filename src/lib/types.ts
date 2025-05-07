
import type { LucideIcon, Car, Bike, Layers, Home, FileText, TrafficCone, Timer, Rss, Film, HelpCircle, Mail, ListChecks, TrendingUp, WifiOff, BookOpen, Video, HelpCircleIcon, ClipboardCheck } from 'lucide-react'; // Added specific icons for clarity, though LucideIcon usually covers all.

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon; // Make icon optional as not all nav items might have one
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

export type Language = 'en' | 'np';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (enText: string, npText: string) => string;
}

// Practice Question Types
export type OptionContent = {
  text: string;
  image_url?: string;
};

export type QuestionOption = {
  en: OptionContent;
  np: OptionContent;
};

export type PracticeQuestion = {
  id: string;
  category: 'A' | 'B' | 'K'; // A: Motorcycle, B: Car/Jeep/Van, K: Scooter
  question_en: string;
  question_np: string;
  options: QuestionOption[];
  correct_option_index: number;
  image_url_en?: string; 
  image_url_np?: string; 
  explanation_en?: string;
  explanation_np?: string;
};

// Traffic Sign Types
export type TrafficSign = {
  id: string;
  name_en: string;
  name_np: string;
  image_url: string;
  description_en: string;
  description_np: string;
  category_en: 'Mandatory' | 'Warning' | 'Informative' | 'Priority' | 'Prohibitory';
  category_np: 'अनिवार्य' | 'चेतावनी' | 'जानकारीमूलक' | ' प्राथमिकता संकेतहरू' | 'निषेधात्मक संकेतहरू';
};

// Exam Types (Common structure for Mock and Real Exam)
export type ExamCategoryType = 'A' | 'B' | 'K' | 'Mixed';

export type MockExamResult = { // This type is used by MockExamClient and RealExamClient
  score: number;
  totalQuestions: number;
  date: string; // ISO string
  answers: { questionId: string; selectedOption: number | null; isCorrect: boolean }[];
  category: ExamCategoryType; 
};
