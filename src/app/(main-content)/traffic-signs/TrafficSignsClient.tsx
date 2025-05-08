
'use client';

import { useState, useMemo } from 'react';
import type { TrafficSign } from '@/lib/types'; // Updated type
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Search, Tag, TrafficCone as TrafficConeIconLucide } from 'lucide-react';
import GoogleAd from '@/components/ads/GoogleAd';

interface TrafficSignsClientProps {
  allSigns: TrafficSign[];
}

type SignCategoryFilter = string; // Now just strings


export function TrafficSignsClient({ allSigns }: TrafficSignsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SignCategoryFilter>('All');

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotBottom = process.env.NEXT_PUBLIC_AD_SLOT_TRAFFIC_SIGNS_BOTTOM;

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allSigns.forEach(sign => categories.add(sign.category)); // Directly use category
    return ['All', ...Array.from(categories)];
  }, [allSigns]);


  const filteredSigns = useMemo(() => {
    return allSigns.filter(sign => {
      const name = sign.name;
      const description = sign.description;
      const category = sign.category;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [allSigns, searchTerm, categoryFilter]);

  const renderAds = (position: 'bottom') => {
    if (!adClient || !adSlotBottom) return null;

    if (position === 'bottom') {
      return (
        <div className="mt-8 w-full">
          <GoogleAd
            adClient={adClient}
            adSlot={adSlotBottom}
            adFormat="auto"
            responsive={true}
            className="min-h-[100px] w-full"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">ट्राफिक संकेतहरू</h1>
      <p className="text-muted-foreground text-center mb-8">नेपालका विभिन्न ट्राफिक संकेतहरू सिक्नुहोस् र बुझ्नुहोस्।</p>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="नाम वा विवरणद्वारा संकेतहरू खोज्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value: SignCategoryFilter) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <Tag className="mr-2 h-4 w-4" />
            <SelectValue placeholder="श्रेणी अनुसार फिल्टर गर्नुहोस्" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>संकेत श्रेणीहरू</SelectLabel>
              {uniqueCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'All' ? 'सबै श्रेणीहरू' : cat}
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
                    alt={sign.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-4"
                    data-ai-hint="traffic sign illustration"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="text-lg font-semibold mb-1">{sign.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground flex-grow">
                  {sign.description}
                </CardDescription>
                <p className="mt-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full self-start">
                  {sign.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrafficConeIconLucide className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold">कुनै ट्राफिक संकेतहरू फेला परेनन्</p>
          <p className="text-muted-foreground">आफ्नो खोज वा फिल्टर मापदण्ड समायोजन गर्ने प्रयास गर्नुहोस्।</p>
        </div>
      )}
      {renderAds('bottom')}
    </div>
  );
}
