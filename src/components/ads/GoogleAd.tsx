
'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  adClient: string; // e.g., "ca-pub-xxxxxxxxxxxxxxxx"
  adSlot: string; // e.g., "yyyyyyyyyy"
  adFormat?: string; // e.g., "auto", "rectangle", "vertical", "horizontal"
  responsive?: boolean; // Corresponds to data-full-width-responsive
  className?: string;
  style?: React.CSSProperties;
  layoutKey?: string; // For data-ad-layout-key, used with fluid ads
}

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown; push: (p: object) => void }[];
  }
}

const GoogleAd: FC<GoogleAdProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
  layoutKey,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isDevelopment, setIsDevelopment] = React.useState(process.env.NODE_ENV === 'development');
  const [adPushed, setAdPushed] = React.useState(false);

  useEffect(() => {
    // This effect should run only once per ad unit on mount or when key ad props change.
    // Adding a `key` to the component instance is often the best way to re-trigger if absolutely necessary.
    
    // Do not push if it's a placeholder ID
    if (adClient === 'YOUR_ADSENSE_CLIENT_ID' || adSlot === 'YOUR_AD_SLOT_ID') {
      setIsDevelopment(true); // Force dev placeholder if IDs are not set
      return;
    } else {
      setIsDevelopment(false);
    }

    try {
      if (window.adsbygoogle && !adPushed) {
        console.log('Pushing ad for slot:', adSlot);
        window.adsbygoogle.push({});
        setAdPushed(true);
      } else if (!window.adsbygoogle) {
        console.warn('AdSense script not loaded yet for slot:', adSlot);
      }
    } catch (e) {
      console.error('Error pushing AdSense ad for slot:', adSlot, e);
    }
  // We only want to push the ad once per component instance unless forced by key change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adClient, adSlot, adPushed]); // adPushed ensures it only tries once successfully per mount logic

  if (adClient === 'YOUR_ADSENSE_CLIENT_ID' || adSlot === 'YOUR_AD_SLOT_ID') {
    // Render a placeholder in development or if IDs are not set
    return (
      <div
        className={cn(
          'bg-muted border border-dashed border-muted-foreground text-muted-foreground flex items-center justify-center min-h-[100px] text-center p-4 rounded-md',
          className
        )}
        style={style}
      >
        <p className="text-sm">
          Advertisement Placeholder
          <br />
          (Replace YOUR_ADSENSE_CLIENT_ID and YOUR_AD_SLOT_ID)
          <br/>
          Client: {adClient}, Slot: {adSlot}
        </p>
      </div>
    );
  }
  
  // Unique key for each ad instance to help with re-renders if props change
  // However, AdSense often works best if the component fully unmounts and remounts
  // if fundamental ad properties like slot ID change.
  const adKey = `${adClient}-${adSlot}-${adFormat}-${responsive}-${layoutKey || ''}`;

  return (
    <div ref={adRef} className={cn('google-ad-container', className)} style={{width: '100%'}}>
      <ins
        key={adKey} // Force re-render if key attributes change - helps AdSense re-initialize
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-layout-key={layoutKey}
      ></ins>
    </div>
  );
};

// Helper for cn if not already defined
const cn = (...inputs: (string | undefined | null | false)[]) => inputs.filter(Boolean).join(' ');


export default GoogleAd;
