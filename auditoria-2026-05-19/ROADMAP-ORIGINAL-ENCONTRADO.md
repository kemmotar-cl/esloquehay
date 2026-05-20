# 🍳 MaLoQueTengo — Roadmap de Desarrollo y Lanzamiento

> **Producto:** Micro-SaaS de recetas inteligentes con IA
> **Slogan:** _"Abrí la heladera. Nosotros pensamos el resto."_
> **Fecha de roadmap:** 2026-05-18
> **Versión:** 1.0

---

## 📋 Índice

1. [Visión y Propuesta de Valor](#1-visión-y-propuesta-de-valor)
2. [Roadmap Técnico](#2-roadmap-técnico)
3. [Arquitectura y Estándares de Software](#3-arquitectura-y-estándares-de-software)
4. [Distribución y Deployment](#4-distribución-y-deployment)
5. [Manejo de Derechos y Legal](#5-manejo-de-derechos-y-legal)
6. [Modelo de Negocio y Monetización](#6-modelo-de-negocio-y-monetización)
7. [Estrategia de Ventas](#7-estrategia-de-ventas)
8. [Estrategia de Marketing](#8-estrategia-de-marketing)
9. [Métricas y KPIs](#9-métricas-y-kpis)
10. [Cronograma](#10-cronograma)

---

## 1. Visión y Propuesta de Valor

### Visión

Ser la app de recetas más usada en Latinoamérica para resolver la pregunta diaria: _"¿Qué cocino con lo que tengo?"_

### Propuesta de Valor Única (UVP)

- **Instantáneo:** Receta en segundos, no en minutos de búsqueda
- **Personalizado:** Basado exactamente en los ingredientes que el usuario tiene
- **Inteligente:** Aprende preferencias, restricciones alimentarias, y nivel de habilidad
- **Accesible:** Funciona en cualquier celular, sin instalar app (PWA)

### Target Principal

- **Primario:** Personas de 25-45 años en Latinoamérica que cocinan en casa 4+ veces por semana
- **Secundario:** Estudiantes universitarios con presupuesto limitado
- **Terciario:** Padres/madres buscando recetas rápidas para la familia

---

## 2. Roadmap Técnico

### Fase 0: Fundamentos (Semana 1)

- [ ] Definir stack tecnológico final
- [ ] Configurar repositorio Git con protección de ramas
- [ ] Setup CI/CD pipeline
- [ ] Configurar entornos: dev, staging, production
- [ ] Definir convenciones de código (ESLint, Prettier, conventional commits)
- [ ] Documentación técnica inicial (ARCHITECTURE.md, API.md)

### Fase 1: MVP — Core Functionality (Semanas 2-3)

- [ ] Frontend: Input de ingredientes (texto libre + tags)
- [ ] Backend: Endpoint `/generate-recipe` conectado a IA (Kimi K2.6 / Cloudflare)
- [ ] Output: Receta estructurada (título, ingredientes, pasos, tiempo, dificultad)
- [ ] PWA básica: manifest, service worker, offline fallback
- [ ] Analytics: tracking de eventos básicos

### Fase 2: Mejora UX — Onboarding y Personalización (Semanas 4-5)

- [ ] Sistema de preferencias: restricciones alimentarias (vegano, celíaco, keto, etc.)
- [ ] Nivel de habilidad culinaria: principiante, intermedio, avanzado
- [ ] Cantidad de comensales
- [ ] Presupuesto estimado por receta
- [ ] Historial de recetas generadas (localStorage)
- [ ] Favoritos y colecciones

### Fase 3: Autenticación y Persistencia (Semanas 6-7)

- [ ] Auth: OAuth (Google, Apple) + email/password
- [ ] Base de datos: PostgreSQL (Supabase o Railway)
- [ ] Sync cross-device: historial, favoritos, preferencias
- [ ] Perfil de usuario

### Fase 4: Monetización (Semanas 8-9)

- [ ] Sistema de suscripciones: Free / Pro / Family
- [ ] Integración de pagos: Stripe (internacional) + MercadoPago (LATAM)
- [ ] Limites por plan: recetas/mes, funciones premium
- [ ] Panel de administración de suscripción

### Fase 5: Escalabilidad — Features Avanzadas (Semanas 10-12)

- [ ] Planificación semanal de comidas (meal planner)
- [ ] Lista de compras automática desde recetas
- [ ] Nutrición: macros, calorías, información nutricional
- [ ] Modo voz: "OK MaLoQueTengo, tengo pollo y arroz"
- [ ] Integración con apps de delivery: comprar ingredientes faltantes
- [ ] API pública para developers

### Fase 6: Mobile App Nativa (Semanas 13-16)

- [ ] React Native o Flutter
- [ ] Notificaciones push: "¿Ya pensaste en la cena?"
- [ ] Cámara: escanear ingredientes con OCR
- [ ] Widgets: receta del día en pantalla de inicio

---

## 3. Arquitectura y Estándares de Software

### Stack Tecnológico

| Capa              | Tecnología                                       | Justificación                                        |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **Frontend**      | React 19 + Vite + TypeScript                     | Rápido, tipado, ecosistema maduro                    |
| **Estilos**       | Tailwind CSS + shadcn/ui                         | Consistente, accesible, rápido de desarrollar        |
| **Estado**        | Zustand                                          | Ligero, simple, sin boilerplate                      |
| **Backend**       | Cloudflare Workers                               | Edge computing, baja latencia, gratis hasta 100K/día |
| **IA**            | Cloudflare Workers AI (@cf/moonshotai/kimi-k2.6) | 10K neurons/día gratis, sin API keys                 |
| **Base de datos** | Supabase (PostgreSQL)                            | Open source, auth integrado, realtime                |
| **Auth**          | Supabase Auth + OAuth                            | Gestión segura de sesiones                           |
| **Pagos**         | Stripe + MercadoPago                             | Cobertura global + LATAM                             |
| **Hosting**       | Vercel (frontend) + Cloudflare (workers)         | CDN global, CI/CD integrado                          |
| **Analytics**     | Plausible o PostHog                              | Privacidad-first, sin cookies invasivas              |
| **Testing**       | Vitest + React Testing Library + Playwright      | Unit, integration, E2E                               |

### Estándares de Código

```
📁 Estructura de carpetas (Feature-based)
src/
  features/
    recipes/
      api/           ← hooks de API
      components/    ← componentes específicos
      hooks/         ← hooks custom
      types/         ← TypeScript types
      utils/         ← helpers
    auth/
    preferences/
    meal-planner/
  components/
    ui/              ← shadcn/ui components
    layout/          ← Header, Footer, Sidebar
  lib/
    utils.ts         ← cn(), helpers globales
    api-client.ts    ← fetch wrapper
  stores/
    user-store.ts
    recipe-store.ts
  types/
    global.d.ts
```

### Convenciones

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **Branches:** `main` (producción), `develop` (staging), `feature/nombre`, `fix/nombre`
- **PRs:** Obligatorio review antes de merge, CI debe pasar
- **Testing:** Cobertura mínima 70% para lógica de negocio
- **Documentación:** Cada función pública debe tener JSDoc

### CI/CD Pipeline

```
Push a feature/* → Lint + Test + Build → PR Review → Merge a develop → Deploy staging
Push a main → Lint + Test + Build + E2E → Deploy production
```

### Seguridad

- [ ] Headers de seguridad: CSP, HSTS, X-Frame-Options
- [ ] Rate limiting: 10 requests/minuto por IP (free), 100/minuto (pro)
- [ ] Sanitización de inputs: DOMPurify para HTML, validación con Zod
- [ ] Encriptación: HTTPS obligatorio, datos sensibles encriptados en DB
- [ ] Auditorías: Dependabot + npm audit en CI

---

## 4. Distribución y Deployment

### Canales de Distribución

| Canal            | Prioridad     | Descripción                                |
| ---------------- | ------------- | ------------------------------------------ |
| **Web (PWA)**    | 🥇 Primario   | Funciona en cualquier celular sin instalar |
| **App Stores**   | 🥈 Secundario | iOS App Store + Google Play (Fase 6)       |
| **WhatsApp Bot** | 🥉 Terciario  | Generar recetas por mensaje (Fase 5)       |
| **Telegram Bot** | 🥉 Terciario  | Integración con Telegram (Fase 5)          |

### Estrategia de Lanzamiento

1. **Alpha:** 5 usuarios conocidos, feedback directo
2. **Beta cerrada:** 50 usuarios, lista de espera
3. **Beta pública:** 500 usuarios, sin pago
4. **Launch:** Público general + monetización activa

### Regiones de Lanzamiento

- **Fase 1:** Chile (mercado local, feedback rápido)
- **Fase 2:** México + Colombia (mercados grandes, español neutro)
- **Fase 3:** Argentina + Perú + España
- **Fase 4:** Resto de LATAM + Hispanos en USA

---

## 5. Manejo de Derechos y Legal

### Propiedad Intelectual

| Elemento                 | Protección           | Acción                                                     |
| ------------------------ | -------------------- | ---------------------------------------------------------- |
| **Marca "MaLoQueTengo"** | Registro de marca    | Registrar en INAPI (Chile) + WIPO para internacional       |
| **Logo y branding**      | Derechos de autor    | Crear manual de marca, registrar diseño industrial         |
| **Código fuente**        | Copyright automático | Licencia privada, no open source inicialmente              |
| **Recetas generadas**    | Derechos de uso      | Términos claros: usuarios pueden usar recetas, no revender |
| **Base de datos**        | Derechos sui generis | Protección de la estructura y organización                 |

### Licenciamiento del Código

- **Código propietario:** No open source inicialmente
- **Posible futuro:** Open core (código abierto, features premium cerradas)
- **Dependencias:** Respetar licencias MIT/Apache de dependencias

### Términos Legales Requeridos

- [ ] **Términos de Servicio:** Uso aceptable, limitación de responsabilidad
- [ ] **Política de Privacidad:** GDPR compliant, manejo de datos personales
- [ ] **Política de Cookies:** Información de tracking
- [ ] **Política de Cancelación:** Reembolsos, cancelación de suscripción
- [ ] **Disclaimer nutricional:** "Información nutricional estimada, consultar profesional"

### Compliance

- [ ] **GDPR:** Derecho al olvido, portabilidad de datos (usuarios EU)
- [ ] **Ley 19.628 (Chile):** Protección de datos personales
- [ ] **LGPD (Brasil):** Si se lanza ahí
- [ ] **PCI DSS:** Para manejo de pagos (Stripe lo gestiona)

---

## 6. Modelo de Negocio y Monetización

### Planes de Suscripción

| Plan       | Precio         | Qué incluye                                          |
| ---------- | -------------- | ---------------------------------------------------- |
| **Free**   | $0             | 5 recetas/mes, básico, ads leves                     |
| **Pro**    | $4.99 USD/mes  | Recetas ilimitadas, sin ads, meal planner, historial |
| **Family** | $9.99 USD/mes  | 4 perfiles, lista de compras, nutrición avanzada     |
| **Anual**  | $39.99 USD/año | Pro con 33% de descuento                             |

### Fuentes de Ingreso Adicionales

- **Afiliados:** Links a ingredientes en MercadoLibre, Amazon, Cornershop
- **Sponsored recipes:** Marcas de alimentos pagan por aparecer en sugerencias
- **API access:** Developers pagan por acceso a la API (Fase 5+)
- **White label:** Versiones personalizadas para supermercados (Fase 6+)

### Estructura de Costos

| Costo                    | Estimado mensual (inicio)  | Estimado mensual (escala) |
| ------------------------ | -------------------------- | ------------------------- |
| Hosting (Vercel + CF)    | $0 (gratis)                | $20-50                    |
| Base de datos (Supabase) | $0 (gratis)                | $25-75                    |
| IA (Cloudflare)          | $0 (gratis)                | $0-50                     |
| Analytics                | $0 (Plausible self-host)   | $20                       |
| Stripe fees              | 2.9% + 30¢ por transacción | 2.9% + 30¢                |
| **Total fijo**           | **$0**                     | **$65-195**               |

---

## 7. Estrategia de Ventas

### Venta Directa (B2C)

- **Freemium:** El plan gratuito es el funnel principal
- **Trial:** 7 días gratis de Pro al registrarse
- **Upsells:** Notificaciones contextualizadas ("¿Querés guardar esta receta? Upgrade a Pro")

### Venta B2B (Fase 5+)

- **Supermercados:** App white-label con sus productos
- **Aseguradoras de salud:** App para planes nutricionales
- **Universidades:** Planes para residencias estudiantiles

### Tácticas de Conversión

- **Email marketing:** Receta semanal gratuita + CTA a Pro
- **Retención:** Push notifications inteligentes ("Son las 6 PM, ¿ya pensaste en la cena?")
- **Referidos:** 1 mes gratis por cada amigo que se suscriba

---

## 8. Estrategia de Marketing

### Fase 1: Tracción Orgánica (Meses 1-3)

- **TikTok:** Videos cortos mostrando "tengo X ingredientes → IA genera receta"
- **Instagram Reels:** Mismo contenido, adaptado al formato
- **YouTube Shorts:** "Cocinando con lo que tengo" - formato de challenge
- **SEO:** Blog con artículos "Qué cocinar con [ingrediente]"
- **Reddit:** Participación en r/cocina, r/MealPrepSundayESP

### Fase 2: Marketing Pagado (Meses 3-6)

- **Google Ads:** Keywords "qué cocinar con pollo", "recetas con pocos ingredientes"
- **Meta Ads:** Instagram/Facebook targeting: intereses en cocina, edad 25-45, LATAM
- **Influencers:** Micro-influencers de cocina (10K-100K seguidores)

### Fase 3: Growth Hacks (Meses 6+)

- **Viral loops:** "Compartí tu receta generada" → watermark con URL
- **Integraciones:** Aparecer como app recomendada en blogs de ahorro
- **PR:** Notas de prensa en tech blogs de LATAM (TechCrunch en español, etc.)

### Presupuesto de Marketing Inicial

| Canal             | Mes 1-3 | Mes 4-6      | Mes 7-12     |
| ----------------- | ------- | ------------ | ------------ |
| Orgánico (tiempo) | 100%    | 60%          | 40%          |
| Paid ads          | $0      | $200/mes     | $500/mes     |
| Influencers       | $0      | $100/mes     | $300/mes     |
| **Total**         | **$0**  | **$300/mes** | **$800/mes** |

---

## 9. Métricas y KPIs

### Métricas de Negocio (North Star)

| Métrica                          | Meta Mes 3 | Meta Mes 6 | Meta Mes 12 |
| -------------------------------- | ---------- | ---------- | ----------- |
| Usuarios activos mensuales (MAU) | 500        | 5,000      | 25,000      |
| Usuarios registrados             | 200        | 2,000      | 10,000      |
| Conversion Free → Pro            | 2%         | 5%         | 8%          |
| MRR (Monthly Recurring Revenue)  | $20        | $500       | $4,000      |
| CAC (Customer Acquisition Cost)  | $0         | $5         | $3          |
| LTV (Lifetime Value)             | -          | $30        | $50         |
| NPS (Net Promoter Score)         | 30         | 40         | 50          |

### Métricas Técnicas

| Métrica                        | Target                             |
| ------------------------------ | ---------------------------------- |
| Uptime                         | 99.9%                              |
| Tiempo de generación de receta | < 5 segundos                       |
| Lighthouse score               | > 90 (performance + accesibilidad) |
| Cobertura de tests             | > 70%                              |
| Tiempo de carga inicial        | < 2 segundos                       |

---

## 10. Cronograma

```
Semana 1:  Setup + Branding + Legal base
Semana 2:  MVP Core (input → receta)
Semana 3:  MVP Polish + PWA + Analytics
Semana 4:  Onboarding + Preferencias
Semana 5:  UX mejorada + Historial
Semana 6:  Auth + DB
Semana 7:  Sync + Perfil
Semana 8:  Monetización backend
Semana 9:  Monetización frontend + Panel
Semana 10: Meal planner
Semana 11: Lista de compras + Nutrición
Semana 12: Optimización + Performance
Semanas 13-16: Mobile app nativa (opcional)
```

### Hitos Clave

| Fecha             | Hito                          |
| ----------------- | ----------------------------- |
| **Fin Semana 3**  | MVP funcional, link shareable |
| **Fin Semana 5**  | Alpha con 5 usuarios          |
| **Fin Semana 7**  | Beta cerrada (50 usuarios)    |
| **Fin Semana 9**  | Monetización activa           |
| **Fin Semana 12** | Public launch oficial         |
| **Mes 6**         | 5,000 MAU, $500 MRR           |
| **Mes 12**        | 25,000 MAU, $4,000 MRR        |

---

## 🚀 Próximo Paso Inmediato

**Semana 1, Día 1:** Elegir definitivamente el nombre final, registrar dominio, y crear el repositorio Git.

¿Empezamos?
