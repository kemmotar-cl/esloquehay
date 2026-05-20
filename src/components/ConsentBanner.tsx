import { useEffect } from 'react';
import { Cookie } from 'lucide-react';
import type { ConsentStatus } from '../hooks/useConsent';

interface ConsentBannerProps {
  consent: ConsentStatus;
  onConsent: (status: ConsentStatus) => void;
  t: (key: string, fallback?: string) => string;
}

export function ConsentBanner({ consent, onConsent, t }: ConsentBannerProps) {
  useEffect(() => {
    if (consent === 'pending') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [consent]);

  if (consent !== 'pending') return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('consent.title', 'Configuración de privacidad')}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-3 bg-brand-100 rounded-full">
            <Cookie className="w-6 h-6 text-brand-600" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('consent.title', 'Tu privacidad importa')}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {t(
                'consent.description',
                'Usamos cookies para analizar el tráfico con Google Analytics y mostrar anuncios personalizados con Google AdSense. También detectamos tu ubicación para sugerir recetas locales. Tus preferencias se guardan solo en tu navegador.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onConsent('denied');
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors order-2 sm:order-1"
              >
                {t('consent.essentialOnly', 'Solo esenciales')}
              </button>
              <button
                onClick={() => {
                  onConsent('granted');
                }}
                className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors order-1 sm:order-2"
              >
                {t('consent.acceptAll', 'Aceptar todo')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
