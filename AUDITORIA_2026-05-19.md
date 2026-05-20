# 🔍 Auditoría Completa — EsLoQueHay

**Fecha:** 2026-05-19 | **Frontend commit:** `c119849` | **Backend commit:** `6b013d7`

---

## 📊 Estado General

| Proyecto | Tests        | Estado Git     | Deploy                     |
| -------- | ------------ | -------------- | -------------------------- |
| Frontend | **57/57 ✅** | Clean & pushed | Live on Cloudflare Pages   |
| Backend  | **11/11 ✅** | Clean & pushed | Live on Cloudflare Workers |

**URLs:**

- Frontend: https://esloquehay.pages.dev
- Backend: https://esloquehay-backend.jorge-labbe-a.workers.dev

---

## 🎨 Frontend Audit

### Puntaje por Categoría

| #   | Categoría     | Estado      |
| --- | ------------- | ----------- |
| 1   | TypeScript    | ✅ OK       |
| 2   | Estructura    | ⚠️ Warning  |
| 3   | Seguridad     | ⚠️ Warning  |
| 4   | Performance   | ⚠️ Warning  |
| 5   | SEO           | ❌ Critical |
| 6   | Accesibilidad | ⚠️ Warning  |
| 7   | i18n          | ❌ Critical |
| 8   | PWA           | ⚠️ Warning  |
| 9   | Testing       | ⚠️ Warning  |
| 10  | Ads/Analytics | ⚠️ Warning  |
| 11  | Build         | ⚠️ Warning  |

**Score:** 1 ✅ | 8 ⚠️ | 2 ❌

### Hallazgos Críticos (Frontend)

#### ❌ SEO — Totalmente ausente

- **No hay Open Graph** (`og:title`, `og:description`, `og:image`, `og:url`)
- **No hay Twitter Cards**
- **No hay Schema.org/Recipe JSON-LD** (crucial para una app de recetas)
- **No hay `robots.txt` ni `sitemap.xml`**
- Sin canonical URL

#### ❌ i18n — Traducciones rotas

- **`it.json` está incompleto** y tiene strings en inglés en vez de italiano
- **"papa" (potato) mal traducida** en 4 idiomas:
  - `ja.json`: "お父さん" (father)
  - `zh.json`: "爸爸" (father)
  - `ar.json`: "أبي" (father)
  - `en.json`: "dad" (father)
- Sin soporte RTL para árabe/urdu

#### ⚠️ Performance — Logo de 325KB

- `logo.png` pesa 325KB sin optimizar (fondo del sitio)
- Bundle JS principal: 303KB
- Sin bundle analyzer

#### ⚠️ Seguridad — CSP con `unsafe-inline`

- `script-src` y `style-src` permiten `'unsafe-inline'`
- Sin sanitización de inputs de usuario antes de enviar al backend

#### ⚠️ Testing — Sin tests de componentes visuales

- 57 tests pasan pero **0 tests de componentes** (RecipeCard, IngredientInput, AdBanner, etc.)
- Sin métrica de cobertura ejecutada

#### ⚠️ Accesibilidad

- Sin focus trap en modales (PreferencesPanel, HistoryPanel)
- Canvas de FloatingIngredients sin `aria-label`
- Sliders sin `<label>` ni `aria-valuenow`

#### ⚠️ Ads/Analytics

- AdSense publisher ID configurado (`ca-pub-4542438722420744`)
- Google revisando sitio (approval pending)
- **Sin banner de consentimiento GDPR/CCPA**
- GA4 configurado pero sin `VITE_GA_MEASUREMENT_ID` seteado

---

## ⚙️ Backend Audit

### Puntaje por Categoría

| #   | Categoría     | Estado      |
| --- | ------------- | ----------- |
| 1   | Seguridad     | ❌ Critical |
| 2   | Testing       | ❌ Critical |
| 3   | Observability | ❌ Critical |
| 4   | Estructura    | ⚠️ Warning  |
| 5   | Performance   | ⚠️ Warning  |
| 6   | TypeScript    | ⚠️ Warning  |
| 7   | Workers AI    | ⚠️ Warning  |
| 8   | API Design    | ⚠️ Warning  |
| 9   | Env/Config    | ⚠️ Warning  |
| 10  | Build/Deploy  | ⚠️ Warning  |

**Score:** 0 ✅ | 7 ⚠️ | 3 ❌

### Hallazgos Críticos (Backend)

#### ❌ Seguridad — Múltiples vectores de ataque

- **CORS wildcard (`*`)** permite cualquier origen
- **Sin validación de inputs** — acepta cualquier JSON sin schema
- **Sin rate limiting** — vulnerable a abuse
- **Prompt injection directo** — ingredientes se interpolan sin sanitización
- Errores siempre devuelven 500 (incluso para input inválido)

#### ❌ Testing — Cobertura mínima

- Solo 11 tests en prompts.ts
- **0 tests de endpoints HTTP**
- **0 tests de manejo de errores**
- **0 tests de integración con IA**
- **0 tests de seguridad** (prompt injection, CORS)

#### ❌ Observability — Ciego en producción

- Worker **no loguea nada**
- Sin structured logging
- Sin error tracking (Sentry)
- Sin métricas ni tracing
- Sin request IDs

#### ⚠️ Estructura — Código duplicado

- Express (`index.ts`) y Worker (`worker.ts`) compartan la misma lógica sin abstracción
- No hay separación de concerns (routes/services/middlewares)

#### ⚠️ TypeScript — Casts anulan strict mode

- 6+ casts `as` que evaden type safety
- `parseAIResponse` retorna `unknown` pero se castea a `RecipeResult` sin validación

#### ⚠️ Performance — Sin caching ni timeout

- Llamadas idénticas a IA generan trabajo repetido
- Sin timeout en llamadas a IA
- Sin streaming de respuestas

#### ⚠️ Workers AI — Prompt engineering mejorable

- Mismo system prompt para recetas e itinerarios
- Sin few-shot examples
- Sin retry si IA devuelve JSON inválido
- Sin schema enforcement

#### ⚠️ API Design

- Sin versionado (`/api/v1/...`)
- Response envelope inconsistente entre errores
- Sin rate limit headers ni request IDs

---

## 🎯 Plan de Acción Priorizado

### 🔴 CRÍTICO — Antes de cualquier release público

| #   | Tarea                                                   | Proyecto | Impacto       |
| --- | ------------------------------------------------------- | -------- | ------------- |
| 1   | Implementar **Zod** para validar inputs y outputs       | Backend  | Seguridad     |
| 2   | Sanitizar inputs antes de interpolar en prompts         | Backend  | Seguridad     |
| 3   | Configurar **rate limiting** y CORS restrictivo         | Backend  | Seguridad     |
| 4   | Implementar **logging estructurado** en Worker          | Backend  | Observability |
| 5   | Agregar **Open Graph + Twitter Cards** + JSON-LD Recipe | Frontend | SEO           |
| 6   | Crear `robots.txt` y `sitemap.xml`                      | Frontend | SEO           |
| 7   | Corregir `it.json` (completar + traducir al italiano)   | Frontend | i18n          |
| 8   | Corregir "papa" → "potato" en `ja`, `zh`, `ar`, `en`    | Frontend | i18n          |
| 9   | Optimizar `logo.png` (WebP/SVG o comprimir)             | Frontend | Performance   |
| 10  | Implementar **focus trap** en modales                   | Frontend | a11y          |

### 🟡 IMPORTANTE — Fase 2

| #   | Tarea                                                   | Proyecto |
| --- | ------------------------------------------------------- | -------- |
| 11  | Agregar tests de endpoints (supertest + Miniflare)      | Backend  |
| 12  | Implementar **caching** con Cloudflare KV               | Backend  |
| 13  | Separar system prompts (recetas vs itinerarios)         | Backend  |
| 14  | Estandarizar API: versionado, request IDs, status codes | Backend  |
| 15  | Agregar retry loop para JSON inválido de IA             | Backend  |
| 16  | Extraer estado de `App.tsx` a custom hook/context       | Frontend |
| 17  | Agregar tests de componentes principales                | Frontend |
| 18  | Implementar banner de consentimiento GDPR               | Frontend |
| 19  | Agregar `apple-touch-icon` y maskable icon              | Frontend |
| 20  | Remover `unsafe-inline` de CSP                          | Frontend |

### 🟢 MEJORA — Nice to have

| # | Tarea | Proyecto |
| 21 | Instalar bundle analyzer | Frontend |
| 22 | Generar source maps | Frontend |
| 23 | Script de validación de keys entre locales | Frontend |
| 24 | Soporte RTL para árabe/urdu | Frontend |
| 25 | Refactorizar estructura backend (services/handlers/middlewares) | Backend |
| 26 | Integrar Sentry para error tracking | Backend |
| 27 | Configurar staging environment en Wrangler | Backend |
| 28 | Documentar API con OpenAPI | Backend |

---

## 📁 Archivos Auditados

### Frontend

```
src/
├── App.tsx                    ⚠️ 515 líneas, monolito
├── components/
│   ├── AdBanner.tsx           ⚠️ Sin tests
│   ├── AffiliateLinks.tsx
│   ├── FloatingIngredients.tsx ⚠️ Canvas sin a11y
│   ├── HistoryPanel.tsx
│   ├── IngredientInput.tsx
│   ├── LanguageSelector.tsx
│   ├── LoadingOverlay.tsx
│   ├── PreferencesPanel.tsx    ⚠️ Sin focus trap
│   ├── RecipeCard.tsx          ⚠️ Sin tests
│   ├── ShareButton.tsx
│   └── ToastContainer.tsx
├── hooks/
│   ├── useCountry.ts
│   ├── useHistory.ts
│   ├── useI18n.ts              ⚠️ Re-renders
│   ├── useLocalStorage.ts
│   ├── useOnlineStatus.ts
│   ├── useToast.ts
│   └── useVisitCounter.ts      ⚠️ Sin validación
├── i18n/
│   └── locales/                ❌ it.json incompleto
├── services/
│   ├── analytics.ts            ✅ GA4 + fallback
│   ├── api.ts                  ⚠️ Fallback hardcodeado
│   └── logger.ts               ✅ Clean
├── types/
│   └── index.ts                ✅ Zod schemas
├── mocks/
│   └── recipes.ts              ✅ Demo data
├── test/                       ⚠️ Solo services/hooks
├── index.html                  ⚠️ CSP unsafe-inline
└── vite.config.ts              ✅ PWA config OK
```

### Backend

```
src/
├── index.ts                    ⚠️ Código duplicado con worker.ts
├── worker.ts                   ⚠️ Sin logs, CORS *, casts
├── prompts.ts                  ⚠️ Prompt injection vector
├── types.ts                    ✅ Tipos básicos
└── test/
    └── prompts.test.ts         ❌ Solo 11 tests de prompts
```

---

## ✅ Checklist de Estado Actual

- [x] Frontend deployado y funcional
- [x] Backend deployado y funcional
- [x] 20 idiomas soportados
- [x] AdSense script integrado (approval pending)
- [x] GA4 analytics configurado (sin ID seteado)
- [x] PWA con manifest y offline fallback
- [x] 57 tests frontend pasando
- [x] 11 tests backend pasando
- [x] CI/CD configurado (GitHub Actions → Cloudflare)
- [x] Ingredients session-only (no persisten)
- [x] Demo mode funcional (fallback automático)
- [x] Mock recipe con disclaimer i18n
- [x] CSP actualizado para ads/analytics

---

_Informe generado automáticamente. Próxima auditoría recomendada tras completar items críticos._
