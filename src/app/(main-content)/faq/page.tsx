import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: `Find answers to frequently asked questions about Nepal's driving license process, Likhit exams, traffic rules, and using ${SITE_NAME}.`,
};

const faqData = [
  {
    "id": "q1",
    "question_en": "What is the Likhit exam?",
    "question_np": "लिखित परीक्षा के हो?",
    "answer_en": "The Likhit exam is a computer-based written test that assesses your knowledge of traffic rules, road signs, vehicle mechanics, and general road safety. It is a mandatory step in obtaining a driving license in Nepal.",
    "answer_np": "लिखित परीक्षा एक कम्प्युटर-आधारित लिखित परीक्षा हो जसले तपाईंको ट्राफिक नियम, सडक संकेत, सवारी साधन मेकानिक्स, र सामान्य सडक सुरक्षा सम्बन्धी ज्ञानको मूल्याङ्कन गर्दछ। यो नेपालमा ड्राइभिङ लाइसेन्स प्राप्त गर्न अनिवार्य चरण हो।",
  },
  {
    "id": "q2",
    "question_en": "Which vehicle categories are covered on this platform?",
    "question_np": "यो प्लेटफर्ममा कुन सवारी साधनका श्रेणीहरू समेटिएका छन्?",
    "answer_en": "We provide practice questions and materials for Category A (Motorcycle), Category B (Car, Jeep, Van), and Category K (Scooter).",
    "answer_np": "हामीले श्रेणी A (मोटरसाइकल), श्रेणी B (कार, जीप, भ्यान), र श्रेणी K (स्कुटर) का लागि अभ्यास प्रश्नहरू र सामग्रीहरू प्रदान गर्दछौं।",
  },
  {
    "id": "q3",
    "question_en": "How do the mock exams work?",
    "question_np": "नमुना परीक्षाहरू कसरी काम गर्छन्?",
    "answer_en": "Our mock exams simulate the real test environment. They are timed and consist of a set number of questions, similar to the actual Likhit exam. You get immediate results and can track your progress.",
    "answer_np": "हाम्रो नमुना परीक्षाहरूले वास्तविक परीक्षा वातावरणको नक्कल गर्दछन्। यी समयबद्ध हुन्छन् र वास्तविक लिखित परीक्षा जस्तै प्रश्नहरूको निश्चित संख्या समावेश गर्दछन्। तपाईंले तत्काल नतिजा पाउनुहुन्छ र आफ्नो प्रगति ट्र्याक गर्न सक्नुहुन्छ।",
  },
  {
    "id": "q4",
    "question_en": "Is the content available in Nepali?",
    "question_np": "के सामग्री नेपालीमा उपलब्ध छ?",
    "answer_en": "Yes, our platform offers full bilingual support. You can switch between English and Nepali for questions, tutorials, and all other content.",
    "answer_np": "हो, हाम्रो प्लेटफर्मले पूर्ण द्विभाषी समर्थन प्रदान गर्दछ। तपाईंले प्रश्न, ट्युटोरियल, र अन्य सबै सामग्रीका लागि अंग्रेजी र नेपाली बीच स्विच गर्न सक्नुहुन्छ।",
  },
  {
    "id": "q5",
    "question_en": "How often is the question bank updated?",
    "question_np": "प्रश्न बैंक कति पटक अद्यावधिक गरिन्छ?",
    "answer_en": "We strive to keep our question bank and traffic sign information as up-to-date as possible with the latest regulations from the Department of Transport Management (DoTM).",
    "answer_np": "हामी हाम्रो प्रश्न बैंक र ट्राफिक संकेत जानकारी यातायात व्यवस्था विभाग (DoTM) को नवीनतम नियमहरू अनुसार सकेसम्म अद्यावधिक राख्ने प्रयास गर्दछौं।",
  },
  {
    "id": "q6",
    "question_en": "Can I access this platform offline?",
    "question_np": "के म यो प्लेटफर्म अफलाइन पहुँच गर्न सक्छु?",
    "answer_en": "Offline access is available through our mobile application. You can download the app to study even when you don't have an internet connection.",
    "answer_np": "अफलाइन पहुँच हाम्रो मोबाइल अनुप्रयोग मार्फत उपलब्ध छ। तपाईंले इन्टरनेट जडान नभएको बेला पनि अध्ययन गर्न अनुप्रयोग डाउनलोड गर्न सक्नुहुन्छ।",
  },
   {
    "id": "q7",
    "question_en": "What is the passing score for the Likhit exam?",
    "question_np": "लिखित परीक्षाको लागि उत्तीर्ण अंक कति हो?",
    "answer_en": "The passing score for the Likhit exam can vary and is set by the Department of Transport Management. Generally, you need to score around 70-80% to pass, but it's best to check the latest official guidelines. Our mock exams are designed to help you aim for a high score.",
    "answer_np": "लिखित परीक्षाको लागि उत्तीर्ण अंक फरक हुन सक्छ र यो यातायात व्यवस्था विभाग द्वारा निर्धारण गरिन्छ। सामान्यतया, उत्तीर्ण हुनका लागि तपाईंले लगभग ७०-८०% अंक प्राप्त गर्नुपर्छ, तर नवीनतम आधिकारिक दिशानिर्देशहरू जाँच गर्नु उत्तम हुन्छ। हाम्रा नमुना परीक्षाहरू तपाईंलाई उच्च अंकको लागि लक्ष्य राख्न मद्दत गर्न डिजाइन गरिएका छन्।",
  },
];


// A client component to handle language context for FAQ
// This is to avoid making the whole page client-side if not necessary,
// though for this specific page, using a client component at the top level might be simpler.
function FaqAccordionClient({ faqs }: { faqs: typeof faqData }) {
  // const { t } = useLanguage(); // If needed for dynamic text outside accordion items

  return (
     <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem value={faq.id} key={faq.id}>
            <AccordionTrigger className="text-left hover:no-underline">
              {/* For bilingual, one option is to use a client component for the trigger text or pass 't' function */}
              {/* Simple approach for now: always show English, or add a toggle within trigger */}
              <span className="font-semibold text-base">{faq.question_en} / {faq.question_np}</span>
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed">
              <p className="mb-2">{faq.answer_en}</p>
              <hr className="my-2"/>
              <p>{faq.answer_np}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
  );
}


export default function FAQPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 text-center">
         <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find answers to common queries about the Nepal driving license process and our platform.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <FaqAccordionClient faqs={faqData} />
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground">
          Can't find the answer you're looking for?
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
