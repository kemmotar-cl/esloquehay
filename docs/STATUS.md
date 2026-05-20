# 📋 EsLoQueHay — Estado del Proyecto

> **Snapshot oficial del estado actual.** Actualizado: 2026-05-19

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
- [x] CSP headers configurados (incl. dominios de ads/analytics)
- [x] CI/CD: GitHub Actions → Cloudflare Pages / Workers
- [x] Tests: 57 frontend + 11 backend — todos pasando
- [x] `X-Session-ID` header para trazabilidad

---

## ⏳ Pendientes Activo

### Bloqueantes Externos

- [ ] **AdSense approval** — Google revisando `esloquehay.pages.dev` (días a semanas)
- [ ] **Ad Units** — No se pueden crear hasta aprobación de sitio

### Tareas Técnicas Pendientes

- [ ] Configurar `VITE_GA_MEASUREMENT_ID` en Cloudflare Pages env vars
- [ ] Configurar `VITE_ADSENSE_SLOT_TOP` / `VITE_ADSENSE_SLOT_BOTTOM` cuando estén disponibles
- [ ] Implementar banner de consentimiento GDPR/CCPA (postergado — no requerido en LATAM)

---

## 🔴 Issues Críticos Conocidos

Ver [AUDITORIA_2026-05-19.md](../../AUDITORIA_2026-05-19.md) para detalle completo.

| Prioridad | Issue                                                                           | Proyecto |
| --------- | ------------------------------------------------------------------------------- | -------- |
| 🔴        | SEO ausente total (sin Open Graph, Twitter Cards, JSON-LD, robots.txt, sitemap) | Frontend |
| 🔴        | `it.json` incompleto y con strings en inglés                                    | Frontend |
| 🔴        | "papa" traducida como "padre" en `ja`, `zh`, `ar`, `en`                         | Frontend |
| 🔴        | CORS wildcard (`*`) + sin validación de inputs + sin rate limiting              | Backend  |
| 🔴        | Prompt injection directo en backend                                             | Backend  |
| 🔴        | Worker no loguea nada (sin observabilidad)                                      | Backend  |
| 🔴        | Solo 11 tests backend — 0 de endpoints, 0 de errores                            | Backend  |
| 🟡        | `logo.png` pesa 325KB sin optimizar                                             | Frontend |
| 🟡        | Sin focus trap en modales                                                       | Frontend |
| 🟡        | `unsafe-inline` en CSP                                                          | Frontend |
| 🟡        | Código duplicado Express/Worker en backend                                      | Backend  |
| 🟡        | Sin caching en backend (llamadas IA repetidas)                                  | Backend  |

---

## 📊 Métricas Técnicas Actuales

| Métrica               | Valor                           |
| --------------------- | ------------------------------- |
| Bundle JS principal   | 303 KB                          |
| Bundle CSS            | 34 KB                           |
| Locales (lazy-loaded) | 7–25 KB cada uno                |
| Tests Frontend        | 57 pasando                      |
| Tests Backend         | 11 pasando                      |
| Lenguajes soportados  | 20                              |
| Países detectables    | 12                              |
| Historial máximo      | 50 recetas                      |
| Retry HTTP            | 3 intentos, backoff exponencial |
| Timeout HTTP          | 8 segundos                      |

---

## 📝 Notas de Contexto

- **Brand name:** "EsLoQueHay" se mantiene intacto en los 20 idiomas.
- **Backend AI model:** `@cf/meta/llama-3.1-8b-instruct` (reemplazó a Kimi K2.6)
- **System prompt:** En inglés para mejor comportamiento multilingüe
- **Ingredient persistence:** Deliberadamente removida de localStorage por request del usuario
- **Health check:** `backendReady` ya no bloquea generación — siempre se intenta backend primero, fallback real solo ante error real
- **AdSense consent:** Postergado. LATAM no requiere CMP para funcionar. Europa limitada sin banner.

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

_Última actualización: 2026-05-19 | Commit frontend: `c119849` | Commit backend: `6b013d7`_
