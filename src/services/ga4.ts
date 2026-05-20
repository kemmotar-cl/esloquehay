declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function loadGtagScript(): void {
  if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${String(GA_ID)}`;
  document.head.appendChild(script);
}

export function initGA4(consent: 'granted' | 'denied'): void {
  if (!GA_ID || typeof window === 'undefined') return;

  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Consent Mode v2 defaults — denied until user chooses
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  if (consent === 'granted') {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    loadGtagScript();
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
}

export function updateConsent(consent: 'granted' | 'denied'): void {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    ad_storage: consent,
    analytics_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
  });
  if (consent === 'granted') {
    loadGtagScript();
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
}
