# 🍳 EsLoQueHay

> **Abrí la heladera. Nosotros pensamos el resto.**

EsLoQueHay es una PWA (Progressive Web App) que genera recetas inteligentes con IA a partir de los ingredientes que ya tenés en casa. Funciona en cualquier celular sin necesidad de instalar una app.

---

## ✨ Características

- **🧠 IA Generativa:** Conectada a Cloudflare Workers AI (Kimi K2.6) para crear recetas personalizadas.
- **🌍 20 Idiomas:** Español, inglés, chino, hindi, árabe, francés, bengalí, portugués, ruso, urdu, indonesio, alemán, japonés, vietnamita, turco, yoruba, marathi, telugu, tamil y coreano.
- **📍 Localización Latinoamericana:** Detecta tu país automáticamente y adapta ingredientes y expresiones (Chile, Argentina, México, Colombia, Perú, España y más).
- **⚡ PWA:** Instalable, funciona offline con fallback, y tiene service worker con auto-update.
- **🎛️ Preferencias:** Perfil de sabor, nivel de cocina, presupuesto, comensales y tiempo máximo.
- **📜 Historial:** Guarda las últimas 50 recetas generadas en tu dispositivo.
- **📤 Compartir:** Usa la Web Share API para enviar recetas por WhatsApp, Telegram, etc.

---

## 🚀 Stack Tecnológico

| Capa     | Tecnología                        |
| -------- | --------------------------------- |
| Frontend | React 19 + Vite + TypeScript      |
| Estilos  | Tailwind CSS v4                   |
| Backend  | Cloudflare Workers + Workers AI   |
| Testing  | Vitest + React Testing Library    |
| CI/CD    | GitHub Actions → Cloudflare Pages |

---

## 📁 Estructura del Proyecto

```
esloquehay/
├── docs/               # Documentación oficial (ROADMAP, ARCHITECTURE, API)
├── public/             # Assets estáticos (logo, favicon, manifest PWA)
├── src/
│   ├── components/     # Componentes React
│   ├── data/           # Datos estáticos y frases localizadas
│   ├── hooks/          # Custom hooks (estado, país, localStorage)
│   ├── i18n/           # Sistema de internacionalización (20 idiomas)
│   ├── services/       # Cliente HTTP y API
│   ├── test/           # Tests unitarios
│   ├── types/          # Definiciones TypeScript
│   ├── App.tsx         # Componente raíz
│   └── main.tsx        # Punto de entrada
├── .github/workflows/  # CI/CD
├── index.html
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
npm run test
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

## 🌐 API Backend

- **Base URL:** `https://esloquehay-backend.jorge-labbe-a.workers.dev`
- **Endpoints:**
  - `GET /api/health` — Estado del backend
  - `POST /api/recipe` — Generar receta

Ver documentación completa en [`docs/API.md`](./docs/API.md).

---

## 📋 Roadmap

Ver [`docs/ROADMAP.md`](./docs/ROADMAP.md).

Hitos próximos:

- Estabilización post-auditoría (Fase 2.5)
- Beta cerrada (Junio 2026)
- Auth + Sync cross-device (Q3 2026)
- Monetización (Q4 2026)

---

## 📄 Licencia

Código propietario — EsLoQueHay © 2026

---

_Hecho con curiosidad y hambre de crear._
