# 🔍 Auditoría Total — EsLoQueHay

**Fecha:** 2026-05-20 | **Frontend:** 83 tests ✅ | **Backend:** 29 tests ✅ | **ESLint:** 0 errores

---

## ✅ Verificación de Remediaciones (AUDITORIA_2026-05-19.md)

| #   | Hallazgo original              | Verificación                                                                     | Estado |
| --- | ------------------------------ | -------------------------------------------------------------------------------- | ------ |
| 1   | SEO ausente                    | Open Graph, Twitter Cards, JSON-LD, robots.txt, sitemap.xml, canonical presentes | ✅     |
| 2   | `it.json` incompleto           | Script de validación i18n: 0 keys faltantes en 20 locales                        | ✅     |
| 3   | "papa" mal traducida           | Validado en todos los locales                                                    | ✅     |
| 4   | Logo 325KB sin optimizar       | logo.png 117KB, logo.webp 89KB                                                   | ✅     |
| 5   | CSP `unsafe-inline` script-src | Grep: 0 inline scripts en src/, gtag removido de index.html                      | ✅     |
| 6   | CSP `unsafe-inline` style-src  | Grep: 0 inline styles en src/, index.html sin `unsafe-inline`                    | ✅     |
| 7   | Sin focus trap                 | `useFocusTrap.ts` implementado + tests                                           | ✅     |
| 8   | Sin validación backend         | Zod schemas en `schemas.ts`, validación en handlers                              | ✅     |
| 9   | CORS wildcard                  | Allowlist restrictivo en `middleware/cors.ts`                                    | ✅     |
| 10  | Sin rate limiting              | `middleware/rateLimit.ts` implementado (10 req/min)                              | ✅     |
| 11  | Prompt injection               | `middleware/security.ts` + tests                                                 | ✅     |
| 12  | Sin logging                    | `middleware/logger.ts` estructurado JSON                                         | ✅     |
| 13  | Código duplicado               | Refactoreado a `handlers/`, `middleware/`, `services/`                           | ✅     |
| 14  | Sin caching                    | KV caching en handlers (1h TTL)                                                  | ✅     |
| 15  | Sin consentimiento             | `ConsentBanner.tsx`, `useConsent.ts`, `ga4.ts` Consent Mode v2                   | ✅     |

---

## 🎨 Frontend Audit

### Score por Categoría

| #   | Categoría     | Estado     | Detalle                                                        |
| --- | ------------- | ---------- | -------------------------------------------------------------- |
| 1   | TypeScript    | ✅ OK      | `tsc --noEmit` 0 errores                                       |
| 2   | ESLint        | ✅ OK      | 0 errores, 0 warnings                                          |
| 3   | Estructura    | ⚠️ Warning | `App.tsx` 551 líneas (monolito), `Logo.tsx` sin usar           |
| 4   | Seguridad     | ✅ OK      | CSP estricto, carga diferida de scripts                        |
| 5   | Performance   | ⚠️ Warning | Bundle 314KB, sin Lighthouse (requiere Chrome)                 |
| 6   | SEO           | ✅ OK      | Open Graph, Twitter Cards, JSON-LD, robots.txt, sitemap        |
| 7   | Accesibilidad | ✅ OK      | Focus trap, aria labels, skip link                             |
| 8   | i18n          | ✅ OK      | 20 idiomas, 0 keys faltantes                                   |
| 9   | PWA           | ⚠️ Warning | Sin `apple-touch-icon`, manifest inyectado por vite-plugin-pwa |
| 10  | Testing       | ⚠️ Warning | 83 tests, 9 archivos sin cobertura                             |
| 11  | Ads/Analytics | ✅ OK      | Consent Mode v2, carga diferida                                |
| 12  | Build         | ✅ OK      | Build limpio, PWA precache 41 entries                          |

**Score:** 8 ✅ | 3 ⚠️ | 0 ❌

### Correcciones Aplicadas

- **ESLint 22 → 0:** Corregidos errores en `ga4.ts`, `adsense.ts`, `useConsent.ts`, `ConsentBanner.tsx`, tests
- **Script GA4 hardcodeado:** Removido de `index.html`, ahora solo carga dinámicamente tras consentimiento
- **Dead code:** `Logo.tsx` existe pero no se usa (se usa CSS background en su lugar)

### Pendiente Frontend

| #   | Tarea                                        | Prioridad |
| --- | -------------------------------------------- | --------- |
| 1   | Refactorizar `App.tsx` (>500 líneas)         | Media     |
| 2   | Tests para 9 archivos sin cobertura          | Media     |
| 3   | `apple-touch-icon` para iOS PWA              | Baja      |
| 4   | Lighthouse scan (requiere Chrome)            | Baja      |
| 5   | Remover `@testing-library/user-event` unused | Baja      |

---

## ⚙️ Backend Audit

### Score por Categoría

| #   | Categoría     | Estado     | Detalle                                                      |
| --- | ------------- | ---------- | ------------------------------------------------------------ |
| 1   | Seguridad     | ⚠️ Warning | Headers agregados, CORS corregido, pero rate limiter efímero |
| 2   | Testing       | ✅ OK      | 29 tests (17 + 12 nuevos middleware)                         |
| 3   | Observability | ✅ OK      | Logging estructurado, session IDs                            |
| 4   | Estructura    | ✅ OK      | Handlers/middleware/services separados                       |
| 5   | Performance   | ⚠️ Warning | KV caching OK, pero rate limiter no distribuido              |
| 6   | TypeScript    | ✅ OK      | `tsc --noEmit` 0 errores                                     |
| 7   | Workers AI    | ⚠️ Warning | Zod validation post-AI agregada, timeout Kimi agregado       |
| 8   | API Design    | ✅ OK      | Status codes diferenciados, CORS restrictivo                 |
| 9   | Env/Config    | ⚠️ Warning | `wrangler.toml` KV ID instruido, `tsconfig.json` ES2022      |
| 10  | Build/Deploy  | ⚠️ Warning | 3 vulnerabilidades npm audit moderate                        |

**Score:** 5 ✅ | 5 ⚠️ | 0 ❌

### Correcciones Aplicadas

- **wrangler.toml:** KV ID cambiado a placeholder con instrucción
- **tsconfig.json:** `module` cambiado de `commonjs` a `ES2022`
- **worker.ts:** Headers de seguridad agregados (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **cors.ts:** Fallback a origen vacío en vez del primer origen permitido
- **rateLimit.ts:** Documentación de limitación agregada
- **ai.ts:** Zod validation post-AI + timeout 30s en fetch Kimi
- **Tests:** 12 tests nuevos para middleware (CORS, rate limit, security, logger)

### Pendiente Backend

| #   | Tarea                                                         | Prioridad |
| --- | ------------------------------------------------------------- | --------- |
| 1   | Reemplazar rate limiter in-memory por KV/Durable Objects      | Media     |
| 2   | Resolver 3 vulnerabilidades npm audit (ws/miniflare/wrangler) | Media     |
| 3   | Configurar KV ID real en `wrangler.toml`                      | Media     |
| 4   | Tests para `services/ai.ts` y `worker.ts`                     | Baja      |
| 5   | Limitar tamaño de body en requests                            | Baja      |
| 6   | Agregar `Strict-Transport-Security` a `_headers` frontend     | Baja      |

---

## 📊 Métricas Técnicas Actuales

| Métrica                        | Valor                              |
| ------------------------------ | ---------------------------------- |
| Frontend tests                 | 83 pasando                         |
| Backend tests                  | 29 pasando                         |
| Frontend ESLint                | 0 errores                          |
| Frontend npm audit             | 0 vulnerabilidades                 |
| Backend npm audit              | 3 moderate (ws/miniflare/wrangler) |
| Bundle JS principal            | 314 KB                             |
| Locales (lazy-loaded)          | 7–27 KB cada uno                   |
| i18n keys consistentes         | 20/20 ✅                           |
| Archivos sin commit (frontend) | 42                                 |
| Archivos sin commit (backend)  | 8                                  |

---

## 🔴 Plan de Acción Residual

### CRÍTICO

| #   | Tarea                                                   | Proyecto |
| --- | ------------------------------------------------------- | -------- |
| 1   | Hacer commit/push de 50 archivos modificados            | Ambos    |
| 2   | Configurar `VITE_GA_MEASUREMENT_ID` en Cloudflare Pages | Frontend |

### IMPORTANTE

| #   | Tarea                                         | Proyecto |
| --- | --------------------------------------------- | -------- |
| 3   | Resolver 3 vulnerabilidades npm audit backend | Backend  |
| 4   | Reemplazar rate limiter in-memory por KV/DO   | Backend  |
| 5   | Configurar KV ID real en `wrangler.toml`      | Backend  |
| 6   | Refactorizar `App.tsx` (>500 líneas)          | Frontend |

### MEJORA

| #   | Tarea                                        | Proyecto |
| --- | -------------------------------------------- | -------- |
| 7   | Tests para 9 archivos sin cobertura          | Frontend |
| 8   | `apple-touch-icon` para iOS PWA              | Frontend |
| 9   | Agregar HSTS a `_headers`                    | Frontend |
| 10  | Tests para `services/ai.ts`                  | Backend  |
| 11  | Remover `@testing-library/user-event` unused | Frontend |

---

_ Auditoría completada. Próxima revisión recomendada tras aprobación de AdSense y configuración de GA4._
