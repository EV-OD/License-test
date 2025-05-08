
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck, Car, Bike as ScooterIcon, Layers, Bike as MotorcycleIcon, TrafficCone } from 'lucide-react'; // Added TrafficCone
import type { ExamCategoryType } from '@/lib/types';

const pageUrl = `${SITE_URL}/real-exam`;

export const metadata: Metadata = {
  title: `वास्तविक परीक्षा श्रेणी चयन गर्नुहोस् | ${SITE_NAME}`,
  description: `${SITE_NAME} मा यथार्थपरक लिखित परीक्षा सिमुलेशन सुरु गर्न आफ्नो ड्राइभिङ लाइसेन्स श्रेणी (A, B, K, Traffic, वा Mixed) छान्नुहोस्।`,
  keywords: ['नेपाल ड्राइभिङ लाइसेन्स वास्तविक परीक्षा', 'लिखित परीक्षा श्रेणी चयन', 'नेपाल ड्राइभिङ टेस्ट', 'वास्तविक परीक्षा सिमुलेशन श्रेणी', `${SITE_NAME} परीक्षा प्रकार`],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `वास्तविक परीक्षा श्रेणी चयन गर्नुहोस् | ${SITE_NAME}`,
    description: `यथार्थपरक लिखित परीक्षा सिमुलेशन सुरु गर्न आफ्नो ड्राइभिङ लाइसेन्स श्रेणी छान्नुहोस्।`,
    url: pageUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `वास्तविक परीक्षा श्रेणी चयन गर्नुहोस् | ${SITE_NAME}`,
    description: `वास्तविक लिखित परीक्षा अनुभवको लागि आफ्नो ड्राइभिङ लाइसेन्स श्रेणी छान्नुहोस्।`,
  },
};

interface ExamCategoryDetail {
  type: ExamCategoryType;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const EXAM_CATEGORIES_CONFIG: ExamCategoryDetail[] = [
  {
    type: 'A',
    name: 'श्रेणी A (मोटरसाइकल)',
    description: 'तपाईंको मोटरसाइकल लाइसेन्स परीक्षाको लागि अभ्यास गर्नुहोस्।',
    icon: MotorcycleIcon,
    href: '/real-exam/A'
  },
  {
    type: 'B',
    name: 'श्रेणी B (कार/जीप/भ्यान)',
    description: 'कार, जीप, वा भ्यान लाइसेन्स परीक्षाको लागि तयारी गर्नुहोस्। (चाँडै आउँदैछ)',
    icon: Car,
    href: '/real-exam/B'
  },
  {
    type: 'K',
    name: 'श्रेणी K (स्कुटर)',
    description: 'तपाईंको स्कुटर लाइसेन्स परीक्षाको लागि तयार हुनुहोस्।',
    icon: ScooterIcon,
    href: '/real-exam/K'
  },
  {
    type: 'Traffic', // Added Traffic category
    name: 'ट्राफिक संकेत',
    description: 'ट्राफिक संकेत सम्बन्धित प्रश्नहरूको अभ्यास गर्नुहोस्।',
    icon: TrafficCone,
    href: '/real-exam/Traffic'
  },
  {
    type: 'Mixed',
    name: 'मिश्रित परीक्षा (सबै श्रेणीहरू)',
    description: 'सबै सवारी साधनका श्रेणीहरू समावेश गर्ने विस्तृत परीक्षा।',
    icon: Layers,
    href: '/real-exam/Mixed'
  }
];


export default function SelectRealExamCategoryPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
        <ClipboardCheck className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          आफ्नो वास्तविक परीक्षा श्रेणी छान्नुहोस्
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          तपाईंले वास्तविक परीक्षा सिमुलेशन लिन चाहनुभएको सवारी साधनको श्रेणी चयन गर्नुहोस्। प्रत्येक परीक्षामा २५ प्रश्न र २५ मिनेटको समय सीमा हुन्छ।
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {EXAM_CATEGORIES_CONFIG.map((category) => (
          <Card key={category.type} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4 pb-4">
              <category.icon className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{category.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={category.href}>
                  {category.type === 'Mixed' ? 'मिश्रित' : (category.type === 'Traffic' ? 'ट्राफिक संकेत' : `श्रेणी ${category.type}`)} को लागि परीक्षा सुरु गर्नुहोस्
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
