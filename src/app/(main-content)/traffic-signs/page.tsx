
import { TrafficSignsClient } from './TrafficSignsClient';
import rawTrafficSignsData from '@/data/traffic-signs.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import type { TrafficSign } from '@/lib/types'; // Import updated type

export const metadata: Metadata = {
  title: `ट्राफिक संकेतहरू | ${SITE_NAME}`,
  description: `${SITE_NAME} मा नेपालका ट्राफिक संकेतहरू सिक्नुहोस् र बुझ्नुहोस्। अनिवार्य, चेतावनी, जानकारीमूलक, प्राथमिकता, र निषेधात्मक संकेतहरू समावेश छन्।`,
};

export default async function TrafficSignsPage() {
  // Map raw data to the TrafficSign type, using Nepali fields
  const signs: TrafficSign[] = rawTrafficSignsData.map((sign: any) => ({
    id: sign.id,
    name: sign.name_np, // Use Nepali name
    image_url: sign.image_url,
    description: sign.description_np, // Use Nepali description
    category: sign.category_np, // Use Nepali category
  }));
  
  return <TrafficSignsClient allSigns={signs} />;
}

