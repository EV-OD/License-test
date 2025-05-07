
'use client';

import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils'; 

interface GoogleAdProps {
  adClient: string; 
  adSlot: string; 
  adFormat?: string; 
  responsive?: boolean; 
  className?: string;
  style?: React.CSSProperties;
  layoutKey?: string; 
}

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown; push: (p: object) => void }[];
  }
}

const PLACEHOLDER_CLIENT_ID_ENV = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Standard placeholder values often seen in examples
const GENERIC_PLACEHOLDER_CLIENT_ID = "ca-pub-0000000000000000";
const GENERIC_PLACEHOLDER_SLOT_ID = "0000000000";

const GoogleAd: FC<GoogleAdProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block', width: '100%' }, 
  layoutKey,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adPushed, setAdPushed] = useState(false);

  const isEffectivelyPlaceholderId = 
      !adClient || adClient === GENERIC_PLACEHOLDER_CLIENT_ID || adClient === "YOUR_ADSENSE_CLIENT_ID" ||
      !adSlot || adSlot === GENERIC_PLACEHOLDER_SLOT_ID || adSlot === "YOUR_AD_SLOT_ID";

  const shouldRenderAd = IS_PRODUCTION && !isEffectivelyPlaceholderId;

  useEffect(() => {
    if (!shouldRenderAd) {
      return; 
    }
    
    let pushAttempted = false;
    try {
      if (window.adsbygoogle && !adPushed) {
        console.log(`Attempting to push ad for slot: ${adSlot}, client: ${adClient}`);
        window.adsbygoogle.push({});
        setAdPushed(true); 
        pushAttempted = true;
      } else if (!window.adsbygoogle) {
        console.warn(`AdSense script (adsbygoogle) not loaded yet for slot: ${adSlot}.`);
      } else if (adPushed) {
        // console.log(`Ad already pushed for slot: ${adSlot}`);
      }
    } catch (e) {
      console.error('Error pushing AdSense ad for slot:', adSlot, e);
    }
    // If an ad push fails (e.g. ad slot not filled), AdSense might retry internally.
    // We primarily prevent re-pushing from our side if already successful.
  }, [adClient, adSlot, adFormat, responsive, layoutKey, adPushed, shouldRenderAd]);


  if (!shouldRenderAd) {
    return (
      <div
        className={cn(
          'bg-muted border border-dashed border-muted-foreground text-muted-foreground flex items-center justify-center min-h-[100px] text-center p-4 rounded-md',
          className
        )}
        style={style}
      >
        <div className="text-sm">
          <p className="font-semibold">Advertisement Placeholder</p>
          {!IS_PRODUCTION && <p className="text-xs">(Ads disabled in development)</p>}
          {isEffectivelyPlaceholderId && <p className="text-xs mt-1 text-destructive-foreground/70">(Using placeholder IDs. Configure in .env.local)</p>}
          <p className="text-xs mt-1">Client: <span className="font-mono text-xs">{adClient || "N/A"}</span></p>
          <p className="text-xs">Slot: <span className="font-mono text-xs">{adSlot || "N/A"}</span></p>
        </div>
      </div>
    );
  }
  
  const adKey = `${adClient}-${adSlot}-${adFormat}-${responsive.toString()}-${layoutKey || 'no-layout'}-${Date.now()}`;

  return (
    <div ref={adRef} className={cn('google-ad-container', className)} style={{width: '100%'}}>
      <ins
        key={adKey} 
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

export default GoogleAd;
