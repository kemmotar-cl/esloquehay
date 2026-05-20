# EsLoQueHay — Arquitectura del Sistema

**Versión:** 1.1  
**Fecha:** 2026-05-19  
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Cloudflare Workers + Workers AI

---

## 1. Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PWA — React 19 + Vite + TypeScript                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   UI Layer  │  │  Hooks      │  │  Services   │ │   │
│  │  │  (Components)│  │  (State)    │  │  (API/Ads)  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │         │                │                │         │   │
│  │         └────────────────┴────────────────┘         │   │
│  │                         │                          │   │
│  │              ┌──────────┴──────────┐               │   │
│  │              │   localStorage      │               │   │
│  │              │  (History + Prefs)  │               │   │
│  │              └─────────────────────┘               │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│                    HTTPS / JSON                              │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           CLOUDFLARE WORKERS (Edge)                  │    │
│  │  ┌─────────────┐  ┌─────────────────────────────┐   │    │
│  │  │  /api/health │  │      /api/recipe            │   │    │
│  │  │  (GET)       │  │      (POST)                 │   │    │
│  │  └─────────────┘  │  - Recibe request           │   │    │
│  │                   │  - Llama a Workers AI       │   │    │
│  │  ┌─────────────┐  │  - Parsea JSON de IA        │   │    │
│  │  │ /api/itinerary│  │  - Devuelve JSON          │   │    │
│  │  │  (POST)      │  └─────────────────────────────┘   │    │
│  │  └─────────────┘                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                    │
│    Workers AI API (@cf/meta/llama-3.1-8b-instruct)          │
│                         │                                    │
└─────────────────────────┴────────────────────────────────────┘
```

---

## 2. Estructura de Carpetas

```
esloquehay/
├── .github/workflows/          # CI/CD (GitHub Actions)
│   ├── ci.yml                  # Lint + Test + Build
│   └── deploy.yml              # Deploy a Cloudflare Pages
├── docs/                       # Documentación del proyecto
│   ├── STATUS.md               # Snapshot actual del proyecto
│   ├── ROADMAP.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── public/                     # Assets estáticos servidos directamente
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.png
├── src/
│   ├── assets/                 # Assets procesados por Vite
│   ├── components/             # Componentes React (PascalCase)
│   │   ├── AdBanner.tsx        # Banner de AdSense
│   │   ├── AffiliateLinks.tsx  # Links de afiliados
│   │   ├── ErrorBoundary.tsx   # Manejo de errores
│   │   ├── FloatingIngredients.tsx  # Canvas animado de ingredientes
│   │   ├── HistoryPanel.tsx    # Panel de historial (lazy-loaded)
│   │   ├── IngredientInput.tsx # Input principal + tags
│   │   ├── LanguageSelector.tsx # Selector de idioma
│   │   ├── LoadingOverlay.tsx  # Overlay de carga
│   │   ├── Logo.tsx            # Componente de logo
│   │   ├── PreferencesPanel.tsx # Panel de preferencias (lazy-loaded)
│   │   ├── RecipeCard.tsx      # Tarjeta de receta generada
│   │   ├── ScrollIndicator.tsx # Indicador de scroll
│   │   ├── ShareButton.tsx     # Compartir vía Web Share API
│   │   └── ToastContainer.tsx  # Notificaciones toast
│   ├── data/                   # Datos estáticos y constantes
│   │   └── phrases.ts          # Frases localizadas e ingredientes por país
│   ├── hooks/                  # Custom React Hooks (camelCase, prefijo use)
│   │   ├── useCountry.ts       # Detección de país por IP
│   │   ├── useHistory.ts       # Historial en localStorage
│   │   ├── useI18n.ts          # Sistema de internacionalización
│   │   ├── useLocalStorage.ts  # Generic localStorage hook con Zod
│   │   ├── useOnlineStatus.ts  # Detección de conectividad
│   │   ├── useToast.ts         # Sistema de notificaciones
│   │   └── useVisitCounter.ts  # Contador de visitas
│   ├── i18n/                   # Sistema de internacionalización
│   │   ├── index.ts            # Carga dinámica de traducciones
│   │   └── locales/            # Archivos JSON por idioma (20 idiomas)
│   ├── mocks/                  # Datos de demo / fallback
│   │   └── recipes.ts          # Mock recipes + variation mocks
│   ├── services/               # Lógica de comunicación con APIs
│   │   ├── analytics.ts        # GA4 event tracking
│   │   ├── api.ts              # Cliente HTTP + retry + timeout
│   │   └── logger.ts           # Logger centralizado
│   ├── test/                   # Tests unitarios e integración
│   │   ├── api.test.ts
│   │   ├── phrases.test.ts
│   │   ├── setup.ts
│   │   └── useLocalStorage.test.ts
│   ├── types/                  # Definiciones TypeScript
│   │   ├── preferences.ts      # Preferencias de usuario + países
│   │   ├── recipe.ts           # Modelos de receta y request
│   │   ├── schemas.ts          # Zod schemas para validación
│   │   └── skin.ts             # Tokens visuales (temas)
│   ├── App.tsx                 # Componente raíz (~515 líneas)
│   ├── App.css                 # Estilos globales específicos
│   ├── index.css               # Tailwind + variables CSS
│   └── main.tsx                # Punto de entrada React
├── .env.example                # Variables de entorno (template)
├── .env.production             # Variables de entorno (URL backend)
├── index.html                  # HTML entry point (CSP + AdSense + GA4 scripts)
├── package.json
├── vite.config.ts              # Config Vite + PWA
└── vitest.config.ts            # Config testing
```

---

## 3. Flujo de Datos

### 3.1 Generación de Receta

1. **Usuario** ingresa ingredientes → `IngredientInput.tsx`
2. **App.tsx** recibe evento `onGenerate` → ejecuta `handleGenerate`
3. **Siempre intenta backend primero** (no hay gate de health check):
   - `App.tsx` llama a `generateRecipe(request, sessionId)` en `services/api.ts`
   - `api.ts` hace `POST /api/recipe` con header `X-Session-ID`
   - Worker recibe request → validación básica → llama a Workers AI (Llama 3.1)
   - Worker parsea respuesta JSON → devuelve `{ success, data: Recipe }`
   - `api.ts` valida con Zod schema → devuelve `Recipe` a `App.tsx`
4. Si backend falla (catch real, no health check):
   - `App.tsx` captura error → muestra `mockRecipe` como fallback
   - Toast de advertencia: "Modo demo activado"
   - Se añade al historial con `source: 'mock'`
5. **RecipeCard.tsx** recibe `recipe` y renderiza
6. Si la receta viene de `source === 'mock'`, se muestra banner de disclaimer

### 3.2 Detección de País

1. `App.tsx` monta `useCountryDetection()`
2. Hook ejecuta en serie:
   - `detectByCloudflare()` → fetch a `cloudflare.com/cdn-cgi/trace`
   - Si falla → `detectByIpApi()` → fetch a `ipapi.co/json/`
3. Código ISO mapeado a `Country` via `COUNTRY_MAP`
4. Fallback: `'chile'` si ambos servicios fallan
5. Resultado: país, nombre, variante de español → afecta frases e ingredientes

### 3.3 Persistencia Local

| Dato                 | Key                      | Tipo              | Límite   | Persistencia         |
| -------------------- | ------------------------ | ----------------- | -------- | -------------------- |
| Preferencias         | `esloquehay-prefs`       | `UserPreferences` | N/A      | ✅ Sí                |
| Historial            | `esloquehay-history`     | `HistoryEntry[]`  | 50 items | ✅ Sí                |
| Ingredientes activos | `esloquehay-ingredients` | `string[]`        | N/A      | ❌ No (session-only) |

> **Nota:** Los ingredientes activos se limpian de localStorage al montar App.tsx. Solo viven en `useState`.

---

## 4. Decisiones Arquitectónicas Clave (ADRs)

### ADR-001: Estado local vs. Estado global

- **Contexto:** SPA sin autenticación, datos personales por dispositivo.
- **Decisión:** Usar React Hooks + localStorage. No se adopta Zustand/Redux.
- **Consecuencias:** Simple, cero boilerplate. Límite: no hay sync cross-device.
- **Revisión:** Reevaluar al implementar auth (Fase 3).

### ADR-002: Cloudflare Workers como backend

- **Contexto:** Necesidad de edge computing, baja latencia, costo cero inicial.
- **Decisión:** Cloudflare Workers + Workers AI.
- **Consecuencias:** Sin servidor dedicado, escalado automático. Límite: cold starts mínimos, restricciones de CPU/memoria.

### ADR-003: i18n propio vs. biblioteca (i18next)

- **Contexto:** 20 idiomas, carga bajo demanda, bundle inicial pequeño.
- **Decisión:** Sistema propio con `import()` dinámico de JSON.
- **Consecuencias:** Control total, sin dependencias extra. Límite: no tiene pluralización avanzada ni interpolación compleja.

### ADR-004: PWA con vite-plugin-pwa

- **Contexto:** App debe funcionar como "instalable" sin app store.
- **Decisión:** `vite-plugin-pwa` con `registerType: 'autoUpdate'`.
- **Consecuencias:** Service worker generado automáticamente. Requiere validar cache en cada deploy.

### ADR-005: Siempre intentar backend primero

- **Contexto:** Health check previo bloqueaba generación aunque backend estuviera vivo.
- **Decisión:** Eliminar gate `backendReady`. Siempre llamar backend primero, fallback real solo ante error genuino.
- **Consecuencias:** Menos falsos negativos. Badge de estado sigue mostrándose para UX pero no bloquea.

### ADR-006: Ingredients session-only

- **Contexto:** Usuario pidió que ingredientes no persistan entre sesiones.
- **Decisión:** Cambiar de `useLocalStorage` a `useState` para ingredientes. Limpiar key en localStorage al montar.
- **Consecuencias:** Mejor UX para usuarios recurrentes. Historial y preferencias siguen persistiendo.

---

## 5. Seguridad

- HTTPS obligatorio en todas las comunicaciones
- Sin secretos hardcodeados en cliente (API URL en `.env.production`)
- CSP headers implementados en `index.html` (incluye dominios de ads/analytics)
- **Pendiente:** Remover `'unsafe-inline'` de `script-src` en CSP
- Sin validación de inputs en backend (solo Zod en frontend responses) — **gap crítico**
- CORS wildcard (`*`) en backend — **gap crítico**
- `X-Session-ID` header para trazabilidad de requests

---

## 6. Escalabilidad y Límites Conocidos

| Recurso               | Límite Actual           | Plan de Escalado                          |
| --------------------- | ----------------------- | ----------------------------------------- |
| Historial local       | 50 items (localStorage) | Migrar a IndexedDB (Fase 3)               |
| Recetas/mes (IA)      | 10K neurons gratis/día  | Plan de pago Cloudflare                   |
| Usuarios concurrentes | Ilimitado (stateless)   | Cloudflare Workers escala automáticamente |
| Bundle JS             | ~303KB (principal)      | Code-splitting adicional si crece         |
| Logo                  | 325KB PNG               | Optimizar a WebP/SVG                      |
