# 🍳 EsLoQueHay — Roadmap Oficial

> **Producto:** EsLoQueHay — Recetas inteligentes con IA  
> **Slogan:** _"Abrí la heladera. Nosotros pensamos el resto."_  
> **Fecha de actualización:** 2026-05-19  
> **Versión:** 1.3 (pre-launch)

---

## 📋 Índice

1. [Visión y Propuesta de Valor](#1-visión-y-propuesta-de-valor)
2. [Stack Tecnológico Consolidado](#2-stack-tecnológico-consolidado)
3. [Roadmap Técnico](#3-roadmap-técnico)
4. [Arquitectura](#4-arquitectura)
5. [Distribución y Deployment](#5-distribución-y-deployment)
6. [Manejo de Derechos y Legal](#6-manejo-de-derechos-y-legal)
7. [Modelo de Negocio](#7-modelo-de-negocio)
8. [Métricas y KPIs](#8-métricas-y-kpis)
9. [Cronograma](#9-cronograma)

---

## 1. Visión y Propuesta de Valor

### Visión

Ser la app de recetas más usada en Latinoamérica para resolver la pregunta diaria: _"¿Qué cocino con lo que tengo?"_

### Propuesta de Valor Única (UVP)

- **Instantáneo:** Receta en segundos, no en minutos de búsqueda
- **Personalizado:** Basado exactamente en los ingredientes que el usuario tiene
- **Inteligente:** Aprende preferencias, restricciones alimentarias, y nivel de habilidad
- **Accesible:** Funciona en cualquier celular, sin instalar app (PWA)
- **Multi-idioma:** 20 idiomas soportados desde el lanzamiento

### Target Principal

- **Primario:** Personas de 25-45 años en Latinoamérica que cocinan en casa 4+ veces por semana
- **Secundario:** Estudiantes universitarios con presupuesto limitado
- **Terciario:** Padres/madres buscando recetas rápidas para la familia

---

## 2. Stack Tecnológico Consolidado

**Decisión de arquitectura (2026-05-19):** Se mantiene el stack actualmente implementado por ser el más maduro y funcional.

| Capa              | Tecnología                                             | Estado          | Justificación                                                                         |
| ----------------- | ------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| **Frontend**      | React 19 + Vite + TypeScript                           | ✅ Implementado | Rápido, tipado, ecosistema maduro. Build optimizado.                                  |
| **Estilos**       | Tailwind CSS v4 + PostCSS                              | ✅ Implementado | Utility-first, bundle pequeño, responsive.                                            |
| **Estado**        | React Hooks + localStorage (custom)                    | ✅ Implementado | Suficiente para SPA sin auth. Migración a Zustand/IndexedDB evaluada para Fase 3+.    |
| **Backend**       | Cloudflare Workers                                     | ✅ Implementado | Edge computing, baja latencia, costo cero en escala inicial.                          |
| **IA**            | Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct) | ✅ Implementado | 10K neurons/día gratis, sin API keys gestionadas por cliente.                         |
| **Base de datos** | localStorage (cliente)                                 | ✅ Implementado | Historial y preferencias locales. Supabase/PostgreSQL planificado para Fase 3 (sync). |
| **Auth**          | No aplica (modo anónimo)                               | ✅ Implementado | Sin fricción de registro. OAuth evaluado para Fase 3.                                 |
| **Pagos**         | Pendiente                                              | ⏳ Fase 4       | Stripe + MercadoPago para monetización.                                               |
| **Hosting**       | Cloudflare Pages (frontend) + Cloudflare Workers (API) | ✅ Implementado | CDN global, CI/CD integrado via GitHub Actions.                                       |
| **Analytics**     | Google Analytics 4 + AdSense                           | ✅ Implementado | GA4 tracking + AdSense ads (approval pending)                                         |
| **Testing**       | Vitest + React Testing Library                         | ✅ Implementado | Unit + integration tests. Playwright evaluado para E2E futuro.                        |
| **Ads**           | Google AdSense                                         | ⏳ Approval     | Publisher ID configurado, Google revisando sitio                                      |

---

## 3. Roadmap Técnico

### Fase 0: Fundamentos ✅ COMPLETADA

- [x] Stack tecnológico final definido y funcionando
- [x] Repositorio Git con CI/CD (GitHub Actions)
- [x] Entornos: dev (`vite dev`), production (Cloudflare Pages)
- [x] Convenciones de código: ESLint, Prettier, Husky, lint-staged
- [x] Testing base: Vitest + React Testing Library
- [x] PWA: manifest, service worker, offline support

### Fase 1: MVP — Core + Internacionalización ✅ COMPLETADA

- [x] Frontend: Input de ingredientes (texto libre + tags + nube flotante)
- [x] Backend: Endpoint `/api/recipe` conectado a IA
- [x] Output: Receta estructurada (título, ingredientes, pasos, tiempo, dificultad)
- [x] Variaciones: mismos ingredientes, resultados distintos
- [x] PWA completa: installable, offline fallback básico
- [x] i18n: 20 idiomas con traducción dinámica
- [x] Detección de país: geolocalización por IP (Cloudflare + ipapi)

### Fase 2: Mejora UX — Onboarding y Personalización ✅ COMPLETADA

- [x] Sistema de preferencias: perfil de sabor, nivel de habilidad, comensales, presupuesto
- [x] Restricciones alimentarias: tipo definido en UI (vegetariano, vegano, keto, etc.)
- [x] Historial de recetas generadas (localStorage, max 50)
- [x] Panel de historial con selección y eliminación
- [x] Share: compartir receta nativa (Web Share API)

### Fase 2.5: Estabilización ✅ COMPLETADA

- [x] Fix: payload completo al backend (incluir `dietaryRestriction` y `experienceMode`)
- [x] Fix: eliminar `catch {}` vacíos, implementar logger centralizado (`logger.ts`)
- [x] Fix: timeout y retry en llamadas de red (`api.ts` con tests de integración)
- [x] Fix: validación de schema con Zod (`localStorage` + API responses)
- [x] Fix: CSP headers y seguridad (`index.html` + headers Cloudflare)
- [x] Refactor: extraer mocks de bundle principal (lazy loading vía `import()`)
- [x] Refactor: reducir duplicación en `phrases.ts` (simplificado a helpers puros)
- [x] Docs: `README.md`, `ARCHITECTURE.md`, `API.md`
- [x] Fix: ingredientes ya no persisten entre sesiones (solo en memoria)
- [x] Fix: eliminar gate `backendReady` — siempre intentar backend primero
- [x] Fix: CORS headers incluyen `X-Session-ID`

### Fase 2.6: Pre-Launch / Pulido Final ✅ COMPLETADA

- [x] Fix: mock recipes con disclaimer i18n (banner cuando `source === 'mock'`)
- [x] Fix: completar `it.json` (Italiano)
- [x] Integración AdSense: script en `index.html`, componente `AdBanner`
- [x] Integración GA4: `analytics.ts`, script en `index.html`
- [x] CSP actualizado para dominios de ads/analytics
- [x] Deploy a producción: push + Cloudflare Pages + Workers
- [x] Logo size aumentado de 35% a 44%

### Fase 2.7: Auditoría y Remediación 🔄 EN PROGRESO

- [ ] Remediación issues críticos de auditoría (ver `AUDITORIA_2026-05-19.md`)
- [ ] SEO: Open Graph, Twitter Cards, JSON-LD Recipe schema
- [ ] SEO: `robots.txt`, `sitemap.xml`
- [ ] i18n: corregir `it.json` (completar keys restantes)
- [ ] i18n: corregir traducción de "papa" → "potato" en `ja`, `zh`, `ar`, `en`
- [ ] Performance: optimizar `logo.png` (WebP/SVG)
- [ ] Backend: Zod validation en inputs
- [ ] Backend: rate limiting
- [ ] Backend: CORS restrictivo (allowlist)
- [ ] Backend: logging estructurado en Worker
- [ ] Backend: tests de endpoints HTTP
- [ ] a11y: focus trap en modales
- [ ] a11y: labels en selects y sliders

### Fase 3: Autenticación y Persistencia (Q3 2026)

- [ ] Auth: OAuth (Google, Apple) — evaluar necesidad vs. anónimo
- [ ] Base de datos: Supabase (PostgreSQL) o mantener Cloudflare Workers + KV/D1
- [ ] Sync cross-device: historial, favoritos, preferencias
- [ ] Perfil de usuario y colecciones (favoritos)

### Fase 4: Monetización (Q4 2026)

- [ ] Sistema de suscripciones: Free / Pro / Family
- [ ] Integración de pagos: Stripe (internacional) + MercadoPago (LATAM)
- [ ] Límites por plan: recetas/mes, funciones premium
- [ ] Panel de administración de suscripción

### Fase 5: Escalabilidad — Features Avanzadas (Q4 2026 / 2027)

- [ ] Planificación semanal de comidas (meal planner)
- [ ] Lista de compras automática desde recetas
- [ ] Nutrición: macros, calorías, información nutricional
- [ ] Exportación: PDF de receta, imagen para redes sociales
- [ ] API pública para developers

### Fase 6: Mobile App Nativa (2027+)

- [ ] React Native o Flutter
- [ ] Notificaciones push: "¿Ya pensaste en la cena?"
- [ ] Cámara: escanear ingredientes con OCR

---

## 4. Arquitectura

Ver documento detallado: [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 5. Distribución y Deployment

### Canales de Distribución

| Canal            | Prioridad     | Estado    |
| ---------------- | ------------- | --------- |
| **Web (PWA)**    | 🥇 Primario   | ✅ Activo |
| **App Stores**   | 🥈 Secundario | ⏳ Fase 6 |
| **WhatsApp Bot** | 🥉 Terciario  | ⏳ Fase 5 |

### Estrategia de Lanzamiento

1. **Alpha:** 5 usuarios conocidos, feedback directo
2. **Beta cerrada:** 50 usuarios, lista de espera
3. **Beta pública:** 500 usuarios, sin pago
4. **Launch:** Público general + monetización activa

### Regiones de Lanzamiento

- **Fase 1:** Chile, Argentina, México, Colombia, Perú, España
- **Fase 2:** Resto de LATAM + Hispanos en USA

---

## 6. Manejo de Derechos y Legal

### Propiedad Intelectual

| Elemento               | Protección        | Estado                       |
| ---------------------- | ----------------- | ---------------------------- |
| **Marca "EsLoQueHay"** | Registro de marca | ⏳ En proceso                |
| **Logo y branding**    | Derechos de autor | ✅ Logo oficial implementado |
| **Código fuente**      | Copyright         | ✅ Privado                   |

### Términos Legales Requeridos

- [ ] **Términos de Servicio**
- [ ] **Política de Privacidad** (GDPR / Ley 19.628 Chile)
- [ ] **Política de Cookies**
- [ ] **Disclaimer nutricional**

---

## 7. Modelo de Negocio

### Planes de Suscripción

| Plan       | Precio         | Qué incluye                                                |
| ---------- | -------------- | ---------------------------------------------------------- |
| **Free**   | $0             | 5 recetas/mes, básico, ads leves                           |
| **Pro**    | $4.99 USD/mes  | Recetas ilimitadas, sin ads, meal planner, historial cloud |
| **Family** | $9.99 USD/mes  | 4 perfiles, lista de compras, nutrición avanzada           |
| **Anual**  | $39.99 USD/año | Pro con 33% de descuento                                   |

### Fuentes de Ingreso Adicionales

- **Afiliados:** Links a ingredientes en MercadoLibre, Amazon
- **Sponsored recipes:** Marcas de alimentos en sugerencias
- **API access:** Developers (Fase 5+)
- **AdSense:** Publicidad display en versión gratuita

---

## 8. Métricas y KPIs

### Métricas de Negocio

| Métrica                          | Meta Mes 3 | Meta Mes 6 | Meta Mes 12 |
| -------------------------------- | ---------- | ---------- | ----------- |
| Usuarios activos mensuales (MAU) | 500        | 5,000      | 25,000      |
| Conversion Free → Pro            | 2%         | 5%         | 8%          |
| MRR                              | $20        | $500       | $4,000      |
| NPS                              | 30         | 40         | 50          |

### Métricas Técnicas

| Métrica                        | Target       | Actual |
| ------------------------------ | ------------ | ------ |
| Uptime                         | 99.9%        | —      |
| Tiempo de generación de receta | < 5 segundos | —      |
| Lighthouse score               | > 90         | —      |
| Cobertura de tests             | > 70%        | ~30%   |
| Tiempo de carga inicial        | < 2 segundos | —      |
| Bundle JS principal            | < 200KB      | 303KB  |

---

## 9. Cronograma

```
Mayo 2026     : Estabilización (Fase 2.5) + Pre-launch (Fase 2.6) + Auditoría (Fase 2.7)
Junio 2026    : Remediación post-auditoría + Beta cerrada (50 usuarios)
Julio 2026    : Beta pública (500 usuarios)
Agosto 2026   : Auth + Sync (Fase 3)
Septiembre 2026 : Monetización backend (Fase 4)
Octubre 2026  : Meal planner + Lista de compras (Fase 5)
Noviembre 2026: Nutrición + Exportación
Diciembre 2026: Public launch oficial + Marketing paid
```

---

_Última actualización: 2026-05-19 | Versión: 1.3 | Auditoría Total TEC-ESLOQUEHAY-2026_
