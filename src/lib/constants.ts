
import type { NavItem, FeatureItem, Testimonial, ResourceLink } from '@/lib/types';
import { ListChecks, TrafficCone, Timer, Languages, TrendingUp, WifiOff, BookOpen, Video, HelpCircleIcon, Smartphone, Apple, Mail, MapPin, ClipboardCheck, Home, FileText, Rss, Film, HelpCircle, Phone, Car, Bike as MotorcycleIcon, Bike as ScooterIcon, Layers } from 'lucide-react';

export const SITE_NAME = "Nepal License Prep";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
export const SITE_LOGO_URL = `${SITE_URL}${process.env.NEXT_PUBLIC_SITE_LOGO_URL || '/icon-512.png'}`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/images/og-default.png`; // Ensure this image exists

// Navigation Links in English
export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/real-exam", label: "Real Exam", icon: ClipboardCheck },
  { href: "/practice", label: "Practice Test", icon: FileText },
  { href: "/traffic-signs", label: "Traffic Signs", icon: TrafficCone },
  { href: "/blog", label: "Blog", icon: Rss },
  { href: "/tutorials", label: "Tutorials", icon: Film },
  { href: "/faq", label: "FAQs", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", icon: Mail },
];

// Feature descriptions remain monolingual Nepali
export const KEY_FEATURES: FeatureItem[] = [
  {
    icon: ListChecks,
    title: "विस्तृत प्रश्न बैंक",
    description: "सवारी साधन श्रेणी A, B (चाँडै आउँदैछ), र K को लागि १०००+ अभ्यास प्रश्नहरू।",
  },
  {
    icon: TrafficCone,
    title: "ट्राफिक संकेत निपुणता",
    description: "अन्तरक्रियात्मक ट्राफिक संकेत ट्यूटोरियलहरू स्पष्ट दृश्य र विवरणहरू सहित।",
  },
  {
    icon: Timer,
    title: "यथार्थवादी परीक्षा सिमुलेशन",
    description: "वास्तविक परीक्षा सर्तहरूको नक्कल गर्ने समयबद्ध परीक्षाहरू।",
  },
  {
    icon: TrendingUp,
    title: "कार्यसम्पादन विश्लेषण",
    description: "आफ्नो प्रगति ट्र्याक गर्नुहोस् र सुधारका लागि क्षेत्रहरू पहिचान गर्नुहोस्।",
  },
  {
    icon: WifiOff,
    title: "अफलाइन पहुँच",
    description: "इन्टरनेट जडान बिना पनि, जुनसुकै बेला, कहीं पनि अध्ययन गर्नुहोस् (मोबाइल एप मार्फत)।",
  },
  {
    icon: Smartphone,
    title: "मोबाइल एप उपलब्ध",
    description: "हाम्रो मोबाइल एप डाउनलोड गरेर अन-द-गो तयारी गर्नुहोस्।"
  }
];

// Testimonials remain as they are user-generated content (Nepali)
export const TESTIMONIALS_DATA: Testimonial[] = [
   {
    quote: "यो प्लेटफर्मको मद्दतले मैले पहिलो प्रयासमा नै लिखित परीक्षा पास गरें! नमुना परीक्षणहरू अविश्वसनीय रूपमा उपयोगी थिए।",
    name: "सिता आर.",
    location: "काठमाडौं",
    avatarFallback: "सि",
    avatarImage: "https://picsum.photos/seed/sita/100/100",
  },
  {
    quote: "ट्राफिक संकेत ट्यूटोरियलहरू उत्कृष्ट छन्। मैले अन्ततः सबै संकेतहरू स्पष्ट रूपमा बुझें। अत्यधिक सिफारिश गरिन्छ!",
    name: "राम के.",
    location: "पोखरा",
    avatarFallback: "रा",
    avatarImage: "https://picsum.photos/seed/ram/100/100",
  },
  {
    quote: "नेपालीमा अभ्यास गर्न पाउनु मेरो लागि गेम चेन्जर थियो। यो लिखित तयारीको लागि उत्तम उपकरण हो।",
    name: "अन्जली जी.",
    location: "विराटनगर",
    avatarFallback: "अ",
    avatarImage: "https://picsum.photos/seed/anjali/100/100",
  },
];

// Additional Resources - Monolingual Nepali
export const ADDITIONAL_RESOURCES: ResourceLink[] = [
  {
    icon: BookOpen,
    title: "लिखित परीक्षा पास गर्ने १० टिप्स",
    description: "लिखित परीक्षामा उत्तीर्ण हुन मद्दत गर्ने हाम्रो विशेषज्ञ सल्लाह।",
    href: "/blog/top-10-tips",
  },
  {
    icon: Video,
    title: "नेपालका ट्राफिक संकेतहरू बुझ्दै",
    description: "विभिन्न ट्राफिक संकेतहरू व्याख्या गर्ने विस्तृत भिडियो ट्यूटोरियलहरू।",
    href: "/tutorials/traffic-signs-explained",
  },
  {
    icon: HelpCircleIcon,
    title: "ड्राइभिङ लाइसेन्स प्रक्रिया FAQs",
    description: "आफ्नो लाइसेन्स प्राप्त गर्ने बारे सामान्य प्रश्नहरूको उत्तर।",
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
  phone: "N/A"
};

// Real Exam Categories - Monolingual Nepali
export const REAL_EXAM_CATEGORIES = [
  { id: 'A', name: 'श्रेणी A (मोटरसाइकल)', icon: MotorcycleIcon, description: 'मोटरसाइकल लाइसेन्सको लागि अभ्यास गर्नुहोस्।' },
  { id: 'B', name: 'श्रेणी B (कार/जीप/भ्यान)', icon: Car, description: 'कार, जीप, वा भ्यान लाइसेन्सको लागि अभ्यास गर्नुहोस्। (चाँडै आउँदैछ)' },
  { id: 'K', name: 'श्रेणी K (स्कुटर)', icon: ScooterIcon, description: 'स्कुटर लाइसेन्सको लागि अभ्यास गर्नुहोस्।' },
  { id: 'Traffic', name: 'ट्राफिक संकेत', icon: TrafficCone, description: 'ट्राफिक संकेत प्रश्नहरूको अभ्यास गर्नुहोस्।' },
  { id: 'Mixed', name: 'मिश्रित परीक्षा', icon: Layers, description: 'सबै श्रेणीका प्रश्नहरू सहितको विस्तृत परीक्षा।' },
];

