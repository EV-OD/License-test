import type { NavItem, FeatureItem, Testimonial, ResourceLink } from '@/lib/types';
import { ListChecks, TrafficCone, Timer, Languages, TrendingUp, WifiOff, BookOpen, Video, HelpCircleIcon, Smartphone, Apple, Mail, MapPin } from 'lucide-react';

export const SITE_NAME = "LicensePrep Nepal";

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice Test" },
  { href: "/traffic-signs", label: "Traffic Signs" },
  { href: "/mock-exam", label: "Mock Exam" },
  { href: "/blog", label: "Blog" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
];

export const KEY_FEATURES: FeatureItem[] = [
  {
    icon: ListChecks,
    title: "Extensive Question Bank",
    description: "Over 1,000 practice questions covering vehicle categories A, B, and K.",
  },
  {
    icon: TrafficCone,
    title: "Traffic Sign Mastery",
    description: "Interactive traffic sign tutorials with clear visuals and bilingual explanations.",
  },
  {
    icon: Timer,
    title: "Realistic Mock Exams",
    description: "Timed mock exams that simulate real test conditions to build your confidence.",
  },
  {
    icon: Languages,
    title: "Bilingual Support",
    description: "Full support for both English and Nepali languages throughout the platform.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your progress and identify areas for improvement with detailed analytics.",
  },
  {
    icon: WifiOff,
    title: "Offline Access",
    description: "Study anytime, anywhere, even without an internet connection (via our mobile app).",
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    quote: "I passed my Likhit exam on the first try thanks to this platform! The mock tests were incredibly helpful.",
    name: "Sita R.",
    location: "Kathmandu",
    avatarFallback: "SR",
    avatarImage: "https://picsum.photos/seed/sita/100/100",
  },
  {
    quote: "The traffic sign tutorials are fantastic. I finally understand all the signs clearly. Highly recommended!",
    name: "Ram K.",
    location: "Pokhara",
    avatarFallback: "RK",
    avatarImage: "https://picsum.photos/seed/ram/100/100",
  },
  {
    quote: "Being able to practice in Nepali was a game-changer for me. This is the best Likhit preparation tool out there.",
    name: "Anjali G.",
    location: "Biratnagar",
    avatarFallback: "AG",
    avatarImage: "https://picsum.photos/seed/anjali/100/100",
  },
];

export const ADDITIONAL_RESOURCES: ResourceLink[] = [
  {
    icon: BookOpen,
    title: "Top 10 Tips to Pass the Likhit Exam",
    description: "Our expert advice to help you ace the written test.",
    href: "/blog/top-10-tips",
  },
  {
    icon: Video,
    title: "Understanding Nepal's Traffic Signs",
    description: "Comprehensive video tutorials explaining various traffic signs.",
    href: "/tutorials/traffic-signs-explained",
  },
  {
    icon: HelpCircleIcon,
    title: "Driving License Process FAQs",
    description: "Answers to common questions about obtaining your license.",
    href: "/faq/license-process",
  },
];

export const APP_DOWNLOAD_LINKS = {
  googlePlay: "#", // Placeholder
  appleStore: "#", // Placeholder
};

export const CONTACT_DETAILS = {
  email: "support@licenseprepnepal.com",
  address: "Kathmandu, Nepal",
};
