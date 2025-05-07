
import type { NavItem, FeatureItem, Testimonial, ResourceLink } from '@/lib/types';
import { ListChecks, TrafficCone, Timer, Languages, TrendingUp, WifiOff, BookOpen, Video, HelpCircleIcon, Smartphone, Apple, Mail, MapPin, ClipboardCheck, Home, FileText, Rss, Film, HelpCircle, Phone } from 'lucide-react';

export const SITE_NAME = "Nepal License Prep";

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/real-exam", label: "Real Exam", icon: ClipboardCheck },
  { href: "/practice", label: "Practice Test", icon: FileText },
  { href: "/traffic-signs", label: "Traffic Signs", icon: TrafficCone },
  { href: "/mock-exam", label: "Mock Exam", icon: Timer },
  { href: "/blog", label: "Blog", icon: Rss },
  { href: "/tutorials", label: "Tutorials", icon: Film },
  { href: "/faq", label: "FAQs", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", icon: Mail },
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
    href: "/faq", 
  },
];

export const APP_DOWNLOAD_LINKS = {
  googlePlay: "#", 
  appleStore: "#", 
};

export const CONTACT_DETAILS = {
  email: "support@nepallicenseprep.com",
  address: "Kathmandu, Nepal",
  phone: "N/A" // Add phone if available
};
