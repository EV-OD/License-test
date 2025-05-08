
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: `${SITE_NAME} मा नेपालको ड्राइभिङ लाइसेन्स प्रक्रिया, लिखित परीक्षा, ट्राफिक नियमहरू बारे बारम्बार सोधिने प्रश्नहरूको उत्तर पाउनुहोस्।`,
};

// Monolingual FAQ data (Nepali)
const faqData = [
  {
    "id": "q1",
    "question": "लिखित परीक्षा के हो?",
    "answer": "लिखित परीक्षा एक कम्प्युटर-आधारित लिखित परीक्षा हो जसले तपाईंको ट्राफिक नियम, सडक संकेत, सवारी साधन मेकानिक्स, र सामान्य सडक सुरक्षा सम्बन्धी ज्ञानको मूल्याङ्कन गर्दछ। यो नेपालमा ड्राइभिङ लाइसेन्स प्राप्त गर्न अनिवार्य चरण हो।",
  },
  {
    "id": "q2",
    "question": "यो प्लेटफर्ममा कुन सवारी साधनका श्रेणीहरू समेटिएका छन्?",
    "answer": "हामीले श्रेणी A (मोटरसाइकल), श्रेणी B (कार, जीप, भ्यान - चाँडै आउँदैछ), र श्रेणी K (स्कुटर) का लागि अभ्यास प्रश्नहरू र सामग्रीहरू प्रदान गर्दछौं।",
  },
  {
    "id": "q3",
    "question": "वास्तविक परीक्षाहरू कसरी काम गर्छन्?",
    "answer": "हाम्रो वास्तविक परीक्षाहरूले आधिकारिक परीक्षा वातावरणको नक्कल गर्दछन्। यी समयबद्ध हुन्छन् (२५ मिनेट) र २५ प्रश्नहरू समावेश गर्दछन्। तपाईंले तत्काल नतिजा पाउनुहुन्छ र आफ्नो प्रगति ट्र्याक गर्न सक्नुहुन्छ।",
  },
  {
    "id": "q4",
    "question": "प्रश्न बैंक कति पटक अद्यावधिक गरिन्छ?",
    "answer": "हामी हाम्रो प्रश्न बैंक र ट्राफिक संकेत जानकारी यातायात व्यवस्था विभाग (DoTM) को नवीनतम नियमहरू अनुसार सकेसम्म अद्यावधिक राख्ने प्रयास गर्दछौं।",
  },
  {
    "id": "q5",
    "question": "के म यो प्लेटफर्म अफलाइन पहुँच गर्न सक्छु?",
    "answer": "अफलाइन पहुँच हाम्रो मोबाइल अनुप्रयोग मार्फत उपलब्ध छ। तपाईंले इन्टरनेट जडान नभएको बेला पनि अध्ययन गर्न अनुप्रयोग डाउनलोड गर्न सक्नुहुन्छ।",
  },
   {
    "id": "q6",
    "question": "लिखित परीक्षाको लागि उत्तीर्ण अंक कति हो?",
    "answer": "लिखित परीक्षाको लागि उत्तीर्ण अंक फरक हुन सक्छ र यो यातायात व्यवस्था विभाग द्वारा निर्धारण गरिन्छ। सामान्यतया, उत्तीर्ण हुनका लागि तपाईंले लगभग ७०% अंक प्राप्त गर्नुपर्छ, तर नवीनतम आधिकारिक दिशानिर्देशहरू जाँच गर्नु उत्तम हुन्छ। हाम्रा परीक्षाहरू तपाईंलाई उच्च अंकको लागि लक्ष्य राख्न मद्दत गर्न डिजाइन गरिएका छन्।",
  },
];

export default function FAQPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
         <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          बारम्बार सोधिने प्रश्नहरू
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          नेपाल ड्राइभिङ लाइसेन्स प्रक्रिया र हाम्रो प्लेटफर्म बारे सामान्य प्रश्नहरूको उत्तर खोज्नुहोस्।
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground">
          तपाईंले खोज्नु भएको उत्तर फेला पार्न सक्नुभएन?
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">सम्पर्क गर्नुहोस्</Link>
        </Button>
      </div>
    </div>
  );
}
