# 🍳 EsLoQueHay

> **Abrí la heladera. Nosotros pensamos el resto.**

EsLoQueHay es una PWA (Progressive Web App) que genera recetas inteligentes con IA a partir de los ingredientes que ya tenés en casa. Funciona en cualquier celular sin necesidad de instalar una app.

🔗 **Live:** [https://esloquehay.pages.dev](https://esloquehay.pages.dev)

---

## ✨ Características

- **🧠 IA Generativa:** Conectada a Cloudflare Workers AI (Llama 3.1 8B) para crear recetas personalizadas.
- **🌍 20 Idiomas:** Español, inglés, chino, hindi, árabe, francés, bengalí, portugués, ruso, urdu, indonesio, alemán, japonés, vietnamita, turco, yoruba, marathi, telugu, tamil y coreano.
- **📍 Localización Latinoamericana:** Detecta tu país automáticamente y adapta ingredientes y expresiones (Chile, Argentina, México, Colombia, Perú, España y más).
- **⚡ PWA:** Instalable, funciona offline con fallback, y tiene service worker con auto-update.
- **🎛️ Preferencias:** Perfil de sabor, nivel de cocina, presupuesto, comensales y tiempo máximo.
- **📜 Historial:** Guarda las últimas 50 recetas generadas en tu dispositivo.
- **📤 Compartir:** Usa la Web Share API para enviar recetas por WhatsApp, Telegram, etc.
- **💰 Monetización:** Google AdSense (carga diferida tras consentimiento) + GA4 Analytics con Consent Mode v2.

---

## 🚀 Stack Tecnológico

| Capa      | Tecnología                        |
| --------- | --------------------------------- |
| Frontend  | React 19 + Vite + TypeScript      |
| Estilos   | Tailwind CSS v4                   |
| Backend   | Cloudflare Workers + Workers AI   |
| Testing   | Vitest + React Testing Library    |
| CI/CD     | GitHub Actions → Cloudflare Pages |
| Analytics | Google Analytics 4                |
| Ads       | Google AdSense                    |

---

## 📁 Estructura del Proyecto

```
esloquehay/
├── docs/               # Documentación oficial (STATUS, ROADMAP, ARCHITECTURE, API)
├── public/             # Assets estáticos (logo, favicon, manifest PWA)
├── src/
│   ├── components/     # Componentes React
│   ├── data/           # Datos estáticos y frases localizadas
│   ├── hooks/          # Custom hooks (estado, país, localStorage)
│   ├── i18n/           # Sistema de internacionalización (20 idiomas)
│   ├── mocks/          # Datos de demo para fallback
│   ├── services/       # Cliente HTTP, Analytics, Logger
│   ├── test/           # Tests unitarios e integración
│   ├── types/          # Definiciones TypeScript + Zod schemas
│   ├── App.tsx         # Componente raíz
│   └── main.tsx        # Punto de entrada
├── .github/workflows/  # CI/CD
├── index.html          # HTML entry point (CSP estricto sin unsafe-inline)
├── package.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Tests
npm test
npm run test:run
npm run test:coverage

# Lint y formato
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Preview del build
npm run preview
```

---

## 🔐 Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```
VITE_API_URL=https://esloquehay-backend.jorge-labbe-a.workers.dev
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX           # Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX           # Google Analytics 4 Measurement ID
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX   # Google AdSense Publisher ID
VITE_ADSENSE_SLOT_TOP=XXXXXXXXXX              # Ad Unit: top banner
VITE_ADSENSE_SLOT_BOTTOM=XXXXXXXXXX           # Ad Unit: bottom banner
```

---

## 🌐 API Backend

- **Base URL:** `https://esloquehay-backend.jorge-labbe-a.workers.dev`
- **Endpoints:**
  - `GET /api/health` — Estado del backend
  - `POST /api/recipe` — Generar receta
  - `POST /api/itinerary` — Generar itinerario

Ver documentación completa en [`docs/API.md`](./docs/API.md).

---

## 📋 Roadmap

Ver [`docs/ROADMAP.md`](./docs/ROADMAP.md).

Hitos próximos:

- Remediación post-auditoría (Fase 2.7) — SEO, i18n fixes, seguridad backend
- Beta cerrada (Junio 2026)
- Auth + Sync cross-device (Q3 2026)
- Monetización full (Q4 2026)

---

## 📄 Estado del Proyecto

Ver [`docs/STATUS.md`](./docs/STATUS.md) para snapshot actual con métricas, pendientes e issues conocidos.

Ver [`AUDITORIA_2026-05-19.md`](./AUDITORIA_2026-05-19.md) para auditoría técnica completa.

---

## 📄 Licencia

Código propietario — EsLoQueHay © 2026

---

_Hecho con curiosidad y hambre de crear._
