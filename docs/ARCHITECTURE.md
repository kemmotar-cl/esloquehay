# EsLoQueHay — Arquitectura del Sistema

**Versión:** 1.0  
**Fecha:** 2026-05-19  
**Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Cloudflare Workers

---

## 1. Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PWA — React 19 + Vite + TypeScript                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   UI Layer  │  │  Hooks      │  │  Services   │ │   │
│  │  │  (Components)│  │  (State)    │  │  (API)      │ │   │
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
│  │  └─────────────┘  │  - Valida request           │   │    │
│  │                   │  - Llama a Workers AI       │   │    │
│  │                   │  - Estructura respuesta     │   │    │
│  │                   │  - Devuelve JSON            │   │    │
│  │                   └─────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                    │
│              Workers AI API (@cf/moonshotai/kimi-k2.6)      │
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
│   │   ├── AdBanner.tsx
│   │   ├── AffiliateLinks.tsx
│   │   ├── FloatingIngredients.tsx
│   │   ├── HistoryPanel.tsx
│   │   ├── IngredientInput.tsx
│   │   ├── Logo.tsx
│   │   ├── PreferencesPanel.tsx
│   │   ├── RecipeCard.tsx
│   │   ├── ScrollIndicator.tsx
│   │   └── ShareButton.tsx
│   ├── data/                   # Datos estáticos y constantes
│   │   └── phrases.ts          # Frases localizadas e ingredientes por país
│   ├── hooks/                  # Custom React Hooks (camelCase, prefijo use)
│   │   ├── useCountry.ts       # Detección de país por IP
│   │   ├── useHistory.ts       # Historial en localStorage
│   │   └── useLocalStorage.ts  # Generic localStorage hook
│   ├── i18n/                   # Sistema de internacionalización
│   │   ├── index.ts            # Carga dinámica de traducciones
│   │   └── locales/            # Archivos JSON por idioma (20 idiomas)
│   ├── services/               # Lógica de comunicación con APIs
│   │   └── api.ts              # Cliente HTTP + endpoints
│   ├── test/                   # Configuración y tests unitarios
│   │   ├── phrases.test.ts
│   │   ├── setup.ts
│   │   └── useLocalStorage.test.ts
│   ├── types/                  # Definiciones TypeScript
│   │   ├── preferences.ts      # Preferencias de usuario + países
│   │   ├── recipe.ts           # Modelos de receta y request
│   │   └── skin.ts             # Tokens visuales (temas)
│   ├── App.tsx                 # Componente raíz
│   ├── App.css                 # Estilos globales específicos
│   ├── index.css               # Tailwind + variables CSS
│   └── main.tsx                # Punto de entrada React
├── .env.production             # Variables de entorno (URL backend)
├── index.html                  # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js          # (implícito en v4 via CSS)
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts              # Config Vite + PWA
└── vitest.config.ts            # Config testing
```

---

## 3. Flujo de Datos

### 3.1 Generación de Receta

1. **Usuario** ingresa ingredientes → `IngredientInput.tsx`
2. **App.tsx** recibe evento `onGenerate` → ejecuta `handleGenerate`
3. Si backend está listo (`backendReady === true`):
   - `App.tsx` llama a `generateRecipe(request)` en `services/api.ts`
   - `api.ts` hace `POST /api/recipe` al Cloudflare Worker
   - Worker valida request → llama a Workers AI (Kimi K2.6)
   - Worker estructura respuesta → devuelve JSON `{ success, data: Recipe }`
   - `api.ts` parsea respuesta → devuelve `Recipe` a `App.tsx`
4. Si backend caído o timeout:
   - `App.tsx` captura error (catch) → muestra `mockRecipe` como fallback
   - Se añade al historial
5. **RecipeCard.tsx** recibe `recipe` y renderiza

### 3.2 Detección de País

1. `App.tsx` monta `useCountryDetection()`
2. Hook ejecuta en serie:
   - `detectByCloudflare()` → fetch a `cloudflare.com/cdn-cgi/trace`
   - Si falla → `detectByIpApi()` → fetch a `ipapi.co/json/`
3. Código ISO mapeado a `Country` via `COUNTRY_MAP`
4. Fallback: `'chile'` si ambos servicios fallan
5. Resultado: país, nombre, variante de español → afecta frases e ingredientes

### 3.3 Persistencia Local

| Dato                 | Key                      | Tipo              | Límite   |
| -------------------- | ------------------------ | ----------------- | -------- |
| Preferencias         | `esloquehay-prefs`       | `UserPreferences` | N/A      |
| Ingredientes activos | `esloquehay-ingredients` | `string[]`        | N/A      |
| Historial            | `esloquehay-history`     | `HistoryEntry[]`  | 50 items |

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

---

## 5. Seguridad

- HTTPS obligatorio en todas las comunicaciones
- Sin secretos hardcodeados en cliente (API URL en `.env.production`)
- CSP headers pendientes de implementación (ver auditoría F4)
- Rate limiting por IP gestionado en Cloudflare Workers (10 req/min free)
- Sanitización de inputs: trim + lowercase en cliente. Validación adicional en Worker.

---

## 6. Escalabilidad y Límites Conocidos

| Recurso               | Límite Actual           | Plan de Escalado                          |
| --------------------- | ----------------------- | ----------------------------------------- |
| Historial local       | 50 items (localStorage) | Migrar a IndexedDB (Fase 3)               |
| Recetas/mes (IA)      | 10K neurons gratis/día  | Plan de pago Cloudflare                   |
| Usuarios concurrentes | Ilimitado (stateless)   | Cloudflare Workers escala automáticamente |
| Bundle JS             | ~150KB estimado         | Code-splitting por ruta si crece          |
