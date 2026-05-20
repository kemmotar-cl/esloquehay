const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? '';

interface GtagWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

export function initGA4() {
  if (!GA_ID) return;

  const win = window as unknown as GtagWindow;
  win.dataLayer ??= [];

  function gtag(...args: unknown[]) {
    const dl = win.dataLayer;
    if (dl) dl.push(args);
  }
  win.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);
}
