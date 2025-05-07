'use client';

import { useState, useMemo } from 'react';
import type { TrafficSign } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Tag } from 'lucide-react';

interface TrafficSignsClientProps {
  allSigns: TrafficSign[];
}

type SignCategoryFilter = 'All' | 'Mandatory' | 'Warning' | 'Informative' | 'Priority' | 'Prohibitory' | 
                          'अनिवार्य' | 'चेतावनी' | 'जानकारीमूलक' | ' प्राथमिकता संकेतहरू' | 'निषेधात्मक संकेतहरू';


export function TrafficSignsClient({ allSigns }: TrafficSignsClientProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SignCategoryFilter>('All');

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allSigns.forEach(sign => categories.add(language === 'en' ? sign.category_en : sign.category_np));
    return ['All', ...Array.from(categories)];
  }, [allSigns, language]);


  const filteredSigns = useMemo(() => {
    return allSigns.filter(sign => {
      const name = language === 'en' ? sign.name_en : sign.name_np;
      const description = language === 'en' ? sign.description_en : sign.description_np;
      const category = language === 'en' ? sign.category_en : sign.category_np;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [allSigns, searchTerm, categoryFilter, language]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('Traffic Signs', 'ट्राफिक संकेतहरू')}</h1>
      <p className="text-muted-foreground text-center mb-8">{t('Learn and understand various traffic signs in Nepal.', 'नेपालका विभिन्न ट्राफिक संकेतहरू सिक्नुहोस् र बुझ्नुहोस्।')}</p>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Search signs by name or description...', 'नाम वा विवरणद्वारा संकेतहरू खोज्नुहोस्...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value: SignCategoryFilter) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <Tag className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('Filter by Category', 'श्रेणी अनुसार फिल्टर गर्नुहोस्')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('Sign Categories', 'संकेत श्रेणीहरू')}</SelectLabel>
              {uniqueCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'All' ? t('All Categories', 'सबै श्रेणीहरू') : cat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredSigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSigns.map((sign) => (
            <Card key={sign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative w-full bg-muted">
                  <Image
                    src={sign.image_url}
                    alt={language === 'en' ? sign.name_en : sign.name_np}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-4"
                    data-ai-hint="traffic sign illustration"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="text-lg font-semibold mb-1">{language === 'en' ? sign.name_en : sign.name_np}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground flex-grow">
                  {language === 'en' ? sign.description_en : sign.description_np}
                </CardDescription>
                <p className="mt-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full self-start">
                  {language === 'en' ? sign.category_en : sign.category_np}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrafficCone className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold">{t('No Traffic Signs Found', 'कुनै ट्राफिक संकेतहरू फेला परेनन्')}</p>
          <p className="text-muted-foreground">{t('Try adjusting your search or filter criteria.', 'आफ्नो खोज वा फिल्टर मापदण्ड समायोजन गर्ने प्रयास गर्नुहोस्।')}</p>
        </div>
      )}
    </div>
  );
}

// Helper icon for TrafficCone if not available from lucide-react
const TrafficCone = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2l7.5 15H4.5L12 2z"/>
    <path d="M8 10h8"/>
    <path d="M6 14h12"/>
    <path d="M4 18h16"/>
  </svg>
);
