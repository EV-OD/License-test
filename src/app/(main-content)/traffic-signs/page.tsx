import { TrafficSignsClient } from './TrafficSignsClient';
import { trafficSigns } from '@/data/traffic-signs'; // Assuming data is moved here
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Traffic Signs | ${SITE_NAME}`,
  description: `Learn and understand Nepal's traffic signs. Interactive tutorials with visuals and descriptions in English and Nepali. Covers mandatory, warning, informative, priority, and prohibitory signs.`,
};

export default async function TrafficSignsPage() {
  // In a real app, you might fetch this data
  return <TrafficSignsClient allSigns={trafficSigns} />;
}
