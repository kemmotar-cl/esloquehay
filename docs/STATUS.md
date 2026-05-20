# 📋 EsLoQueHay — Estado del Proyecto

> **Snapshot oficial del estado actual.** Actualizado: 2026-05-20

---

## 🚀 URLs en Producción

| Servicio             | URL                                                  | Estado    |
| -------------------- | ---------------------------------------------------- | --------- |
| Frontend (PWA)       | https://esloquehay.pages.dev                         | ✅ Live   |
| Backend (Workers AI) | https://esloquehay-backend.jorge-labbe-a.workers.dev | ✅ Live   |
| Repo Frontend        | https://github.com/kemmotar-cl/esloquehay            | ✅ Active |
| Repo Backend         | https://github.com/kemmotar-cl/esloquehay-backend    | ✅ Active |

---

## ✅ Funcionalidades Entregadas

### Core

- [x] Input de ingredientes (texto libre + tags + nube flotante animada)
- [x] Generación de recetas vía IA (Cloudflare Workers AI — Llama 3.1 8B)
- [x] Fallback automático a mock recipe si backend falla
- [x] Variaciones de receta (mismos ingredientes, distintos resultados)
- [x] Receta económica (botón rápido con budget=low)

### UX / Personalización

- [x] 20 idiomas soportados con carga dinámica
- [x] Detección automática de país (Cloudflare Trace → ipapi fallback)
- [x] Preferencias: perfil de sabor, nivel de cocina, presupuesto, comensales, tiempo máximo
- [x] Restricciones alimentarias (vegetariano, vegano, keto, etc.)
- [x] Historial de recetas (localStorage, max 50, con export JSON/CSV)
- [x] Compartir receta nativa (Web Share API)
- [x] Ingredientes **session-only** (no persisten entre recargas)

### PWA

- [x] Manifest generado automáticamente (vite-plugin-pwa)
- [x] Service worker con auto-update
- [x] Offline fallback (`offline.html`)
- [x] Runtime caching para API externas
- [x] Instalable en iOS/Android/Desktop

### Monetización

- [x] Google AdSense integrado (script + componente `AdBanner`)
- [x] Publisher ID: `ca-pub-4542438722420744` (Google revisando sitio)
- [x] GA4 Analytics configurado (event tracking, page views)
- [x] Slots: `VITE_ADSENSE_SLOT_TOP` / `VITE_ADSENSE_SLOT_BOTTOM` (pendientes de creación en AdSense)
- [x] Affiliate links en recetas

### Técnico

- [x] React 19 + Vite + TypeScript strict
- [x] Tailwind CSS v4
- [x] i18n propio con dynamic import de 20 locales
- [x] Zod validation en API responses y localStorage
- [x] Retry con backoff exponencial en llamadas HTTP
- [x] Logger centralizado (`services/logger.ts`)
- [x] Analytics centralizado (`services/analytics.ts`)
- [x] CSP headers configurados sin `unsafe-inline` en `script-src` ni `style-src`
- [x] Google Consent Mode v2 + banner de consentimiento GDPR
- [x] Carga diferida de GA4 y AdSense según elección del usuario
- [x] CI/CD: GitHub Actions → Cloudflare Pages / Workers
- [x] Tests: 72 frontend + 17 backend — todos pasando
- [x] `X-Session-ID` header para trazabilidad

---

## ⏳ Pendientes Activo

### Bloqueantes Externos

- [ ] **AdSense approval** — Google revisando `esloquehay.pages.dev` (días a semanas)
- [ ] **Ad Units** — No se pueden crear hasta aprobación de sitio

### Tareas Técnicas Pendientes

- [ ] **Configurar `VITE_GA_MEASUREMENT_ID`** — Seguir `docs/GA4_SETUP.md`
- [ ] Configurar `VITE_ADSENSE_SLOT_TOP` / `VITE_ADSENSE_SLOT_BOTTOM` cuando estén disponibles
- [x] ~~Implementar banner de consentimiento GDPR/CCPA~~ ✅ Entregado 2026-05-20
- [x] Traducciones del banner a los 20 idiomas
- [x] Tests de `useConsent` y `ConsentBanner`
- [x] Link "Preferencias de privacidad" en footer

---

## 🔴 Issues Críticos Conocidos

Ver [AUDITORIA_2026-05-19.md](../../AUDITORIA_2026-05-19.md) para detalle completo.

| Prioridad | Issue                                                        | Proyecto |
| --------- | ------------------------------------------------------------ | -------- |
| ✅        | SEO: Open Graph, Twitter Cards, robots.txt, sitemap          | Frontend |
| ✅        | `it.json` traducido completo al italiano                     | Frontend |
| ✅        | "papa" corregida en 18 idiomas                               | Frontend |
| ✅        | CORS restrictivo + Zod validation + rate limiting            | Backend  |
| ✅        | Prompt injection detection + sanitización                    | Backend  |
| ✅        | Logging estructurado JSON en Worker                          | Backend  |
| ✅        | Tests backend: 17 pasando (6 de handlers HTTP)               | Backend  |
| ✅        | `logo.png` optimizado: 325KB → 117KB                         | Frontend |
| ✅        | Focus trap en modales (HistoryPanel + PreferencesPanel)      | Frontend |
| ✅        | `unsafe-inline` removido de CSP (`script-src` + `style-src`) | Frontend |
| ✅        | Banner de consentimiento GDPR + Google Consent Mode v2       | Frontend |
| ✅        | Código duplicado Express/Worker refactoreado                 | Backend  |
| ✅        | KV Caching en backend (1h TTL)                               | Backend  |

---

## 📊 Métricas Técnicas Actuales

| Métrica                | Valor                           |
| ---------------------- | ------------------------------- |
| Bundle JS principal    | 314 KB                          |
| Bundle CSS             | 34 KB                           |
| Locales (lazy-loaded)  | 7–25 KB cada uno                |
| Tests Frontend         | 97 pasando (+40 nuevos)         |
| Tests Backend          | 29 pasando (+18 nuevos)         |
| i18n keys consistentes | 20/20 ✅                        |
| ESLint errors          | 0                               |
| Historial máximo       | 50 recetas                      |
| Retry HTTP             | 3 intentos, backoff exponencial |
| Timeout HTTP           | 8 segundos                      |

---

## 📝 Notas de Contexto

- **Brand name:** "EsLoQueHay" se mantiene intacto en los 20 idiomas.
- **Backend AI model:** `@cf/meta/llama-3.1-8b-instruct` (reemplazó a Kimi K2.6)
- **System prompt:** En inglés para mejor comportamiento multilingüe
- **Ingredient persistence:** Deliberadamente removida de localStorage por request del usuario
- **Health check:** `backendReady` ya no bloquea generación — siempre se intenta backend primero, fallback real solo ante error real
- **AdSense consent:** Implementado. Banner con Google Consent Mode v2. Scripts de GA4/AdSense solo cargan tras consentimiento explícito.

---

## 🏷️ Versiones de Dependencias Clave

| Paquete      | Versión |
| ------------ | ------- |
| React        | 19.x    |
| Vite         | 6.x     |
| TypeScript   | 5.7.x   |
| Tailwind CSS | 4.x     |
| vitest       | 3.x     |
| wrangler     | 4.x     |

---

_Última actualización: 2026-05-20 | Auditoría total completada | Reporte: `AUDITORIA_2026-05-20.md`_

## 📝 Pendientes Post-Auditoría

Ver `AUDITORIA_2026-05-20.md` para detalle completo.

| Prioridad | Tarea                                                   | Proyecto |
| --------- | ------------------------------------------------------- | -------- |
| ✅        | Hacer commit/push de cambios                            | Ambos    |
| 🔴        | Configurar `VITE_GA_MEASUREMENT_ID` en Cloudflare Pages | Frontend |
| 🟡        | Resolver 3 vulnerabilidades npm audit backend           | Backend  |
| 🟡        | Reemplazar rate limiter in-memory por KV/DO             | Backend  |
| 🟡        | Configurar KV ID real en `wrangler.toml`                | Backend  |
| 🟡        | Refactorizar `App.tsx` (>500 líneas)                    | Frontend |
| ✅        | Tests para archivos sin cobertura (+8 nuevos)           | Frontend |
| ✅        | `apple-touch-icon` para iOS PWA                         | Frontend |
| ✅        | Agregar HSTS a `_headers`                               | Frontend |
| ✅        | Remover `@testing-library/user-event` unused            | Frontend |
