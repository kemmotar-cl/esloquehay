# Roadmap de Crecimiento V2 — EsLoQueHay

**Horizonte:** Q2 2026 — Q4 2026  
**Version objetivo:** 2.0.0

---

## Q2 2026 (Abril — Junio) — Fundamentos y Robustez

**Meta:** Eliminar deuda tecnica critica y estabilizar la experiencia base.

- **S1:** Fix de `catch {}` vacios, timeout en geolocalizacion, y correccion de payload API.
- **S2:** `npm audit`, CSP headers, refactor de `AffiliateLinks`, memoizaciones.
- **S3:** Zod para validacion de localStorage y respuestas de API.
- **S4:** Error Boundary, logger centralizado, y tests de integracion para `api.ts`.

**Entregables:**

- v1.1.0 con robustez mejorada.
- Coverage de tests > 60%.

---

## Q3 2026 (Julio — Septiembre) — Escalabilidad y Experiencia

**Meta:** Preparar la app para crecimiento de usuarios y nuevas funcionalidades.

- **S1:** Lazy loading de mocks y refactor de `phrases.ts`.
- **S2:** IndexedDB para historial y preferencias (reemplazo de localStorage).
- **S3:** Modo offline basico (cache de assets + cola de acciones).
- **S4:** Exportacion de recetas a PDF y share nativo mejorado.

**Entregables:**

- v1.5.0 con modo offline.
- Reduccion de bundle inicial en 20%.

---

## Q4 2026 (Octubre — Diciembre) — Inteligencia y Comunidad

**Meta:** Convertir la app en una plataforma con aprendizaje y engagement.

- **S1:** Backend con persistencia de recetas, ratings y feedback.
- **S2:** Motor de recomendacion v1 (basado en historial y preferencias).
- **S3:** Autenticacion OAuth y sincronizacion cross-device.
- **S4:** Dashboard de analytics para equipo de producto.

**Entregables:**

- v2.0.0.
- KPIs tecnicos cumplidos (ver `KPIs-Esloquehay.json`).

---

## Hitos Clave

| Fecha      | Hito                             | Version |
| ---------- | -------------------------------- | ------- |
| 2026-06-30 | Fundamentos estables             | v1.1.0  |
| 2026-07-31 | Deuda tecnica < 5 items criticos | v1.2.0  |
| 2026-09-30 | App funciona offline             | v1.5.0  |
| 2026-10-31 | Beta de recomendaciones          | v1.8.0  |
| 2026-12-15 | Lanzamiento V2                   | v2.0.0  |
