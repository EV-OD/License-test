'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label={t('Switch Language', 'भाषा बदल्नुहोस्')}>
      <Languages className="h-5 w-5" />
      <span className="ml-2 text-sm font-medium">{language === 'en' ? 'नेपाली' : 'English'}</span>
    </Button>
  );
}
