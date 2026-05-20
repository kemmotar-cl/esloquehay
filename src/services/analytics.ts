import { logger } from './logger';

/**
 * Stub de analytics para EsLoQueHay.
 * En produccion, reemplazar por integracion real (Plausible, PostHog, etc.).
 */

export const analytics = {
  /**
   * Registra un evento de analytics.
   * @param event - Nombre del evento.
   * @param properties - Propiedades adicionales del evento.
   */
  track(event: string, properties?: Record<string, unknown>) {
    logger.debug('analytics', `Track: ${event}`, properties ?? {});
    // TODO: Enviar a servicio de analytics real
  },

  /**
   * Registra una vista de pagina.
   * @param path - Ruta de la pagina.
   */
  pageView(path: string) {
    logger.debug('analytics', `PageView: ${path}`);
    // TODO: Enviar a servicio de analytics real
  },
};
