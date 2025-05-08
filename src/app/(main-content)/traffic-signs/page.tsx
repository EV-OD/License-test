
import { TrafficSignsClient } from './TrafficSignsClient';
import rawTrafficSignsData from '@/data/traffic-signs.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import type { TrafficSign } from '@/lib/types';

export const metadata: Metadata = {
  title: `Traffic Signs | ${SITE_NAME}`,
  description: `Learn and understand traffic signs in Nepal on ${SITE_NAME}. Includes mandatory, warning, informative, priority, and prohibitory signs.`,
};

export default async function TrafficSignsPage() {
  // Map raw data to the TrafficSign type, using English fields
  const signs: TrafficSign[] = rawTrafficSignsData.map((sign: any) => ({
    id: sign.id,
    name: sign.name_en, 
    image_url: sign.image_url,
    description: sign.description_en, 
    category: sign.category_en, 
  }));
  
  return <TrafficSignsClient allSigns={signs} />;
}
```