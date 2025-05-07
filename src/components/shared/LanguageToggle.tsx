
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button 
      variant="ghost" 
      size="default" // Changed from "icon" to allow text and icon to fit naturally
      onClick={toggleLanguage} 
      aria-label={t('Switch Language', 'भाषा बदल्नुहोस्')}
    >
      <Languages /> {/* Button component will style the SVG size (typically h-4 w-4) */}
      <span>{language === 'en' ? 'नेपाली' : 'English'}</span> {/* Button will provide text styling and spacing */}
    </Button>
  );
}

