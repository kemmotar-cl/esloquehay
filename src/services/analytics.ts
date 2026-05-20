import { logger } from './logger';

/**
 * Analytics para EsLoQueHay.
 * Integra Google Analytics 4 (gtag) como backend principal.
 * Fallback a logger si gtag no está disponible.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function sendToGA(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_ID) {
    window.gtag('event', event, properties ?? {});
  }
}

export const analytics = {
  /**
   * Registra un evento de analytics.
   * @param event - Nombre del evento.
   * @param properties - Propiedades adicionales del evento.
   */
  track(event: string, properties?: Record<string, unknown>) {
    logger.debug('analytics', `Track: ${event}`, properties ?? {});
    sendToGA(event, properties);
  },

  /**
   * Registra una vista de pagina.
   * @param path - Ruta de la pagina.
   */
  pageView(path: string) {
    logger.debug('analytics', `PageView: ${path}`);
    if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_ID) {
      window.gtag('config', GA_ID, { page_path: path });
    }
  },
};
