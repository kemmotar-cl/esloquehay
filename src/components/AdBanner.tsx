import { useEffect, useRef } from 'react';

interface AdBannerProps {
  variant?: 'horizontal' | 'square';
  t?: (path: string, fallback?: string) => string;
  adSlot?: string;
}

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/**
 * Componente de publicidad Google AdSense.
 * Si no hay AdSense configurado, muestra un placeholder.
 */
export default function AdBanner({ variant = 'horizontal', t, adSlot }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!adSlot || !ADSENSE_CLIENT || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // Silently fail if ad blocker present
    }
  }, [adSlot]);

  const sizes = {
    horizontal: 'h-24 sm:h-28',
    square: 'h-64 sm:h-72',
  };

  // Placeholder mode (no AdSense configured)
  if (!adSlot || !ADSENSE_CLIENT) {
    return (
      <div className="w-full max-w-2xl mx-auto my-6">
        <div
          className={`relative ${sizes[variant]} bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center overflow-hidden group`}
        >
          <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded">
            {t?.('ad.label', 'Publicidad')}
          </span>
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400 font-medium">
              {t?.('ad.placeholder', 'Espacio reservado')}
            </p>
            <p className="text-[10px] text-gray-300">
              Google AdSense / {t?.('ad.category', 'Cocina & Gourmet')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className={`relative ${sizes[variant]} rounded-xl overflow-hidden`}>
        <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded z-10">
          {t?.('ad.label', 'Publicidad')}
        </span>
        <ins
          ref={adRef}
          className="adsbygoogle block w-full h-full"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
