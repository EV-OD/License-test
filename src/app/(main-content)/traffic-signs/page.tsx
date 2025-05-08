
import { TrafficSignsClient } from './TrafficSignsClient';
import trafficSignsData from '@/data/traffic-signs.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import type { TrafficSign } from '@/lib/types'; // Import updated type

export const metadata: Metadata = {
  title: `ट्राफिक संकेतहरू | ${SITE_NAME}`,
  description: `${SITE_NAME} मा नेपालका ट्राफिक संकेतहरू सिक्नुहोस् र बुझ्नुहोस्। अनिवार्य, चेतावनी, जानकारीमूलक, प्राथमिकता, र निषेधात्मक संकेतहरू समावेश छन्।`,
};

export default async function TrafficSignsPage() {
  // Ensure data conforms to TrafficSign[] type
  const signs: TrafficSign[] = trafficSignsData;
  return <TrafficSignsClient allSigns={signs} />;
}
