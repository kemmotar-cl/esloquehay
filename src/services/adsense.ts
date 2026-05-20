const PUBLISHER_ID =
  (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) ?? 'ca-pub-4542438722420744';

export function loadAdSense(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('script[data-adsense]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
  script.crossOrigin = 'anonymous';
  script.dataset.adsense = 'true';
  document.head.appendChild(script);
}
