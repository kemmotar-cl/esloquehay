# FASE 8: OPTIMIZACION Y PLAN DE CRECIMIENTO

**Resumen Ejecutivo:** APROBADO CON OBSERVACIONES

El proyecto tiene una base solida pero requiere trabajo en robustez, trazabilidad y desacoplamiento antes de escalar. A continuacion se presentan tres niveles de optimizacion, un roadmap trimestral y KPIs tecnicos.

---

## 8.1 Tres Niveles de Optimizacion

### Nivel 1: Rapida (Bajo Riesgo, Alto Impacto Inmediato)

| ID     | Mejora                                                                                | Esfuerzo (hh) | Riesgo | Impacto |
| ------ | ------------------------------------------------------------------------------------- | ------------- | ------ | ------- |
| Q1-001 | Eliminar `catch {}` vacios y reemplazar por `console.error` + contexto                | 2             | BAJO   | Medio   |
| Q1-002 | Memoizar calculos en `RecipeCard` (`timeText`, `difficultyColor`)                     | 1             | BAJO   | Bajo    |
| Q1-003 | Agregar timeout (2s) a `useCountry.ts` y renderizado progresivo                       | 2             | BAJO   | Alto    |
| Q1-004 | Incluir `dietaryRestriction` y `experienceMode` en payload de API                     | 2             | BAJO   | Alto    |
| Q1-005 | Corregir filtro de afiliados (`recipe.title.split(' ')[0]`) usando campo estructurado | 2             | BAJO   | Medio   |
| Q1-006 | Ejecutar `npm audit` y actualizar dependencias vulnerables                            | 2             | MEDIO  | Alto    |

### Nivel 2: Estructural (Refactorizacion de Modulos Criticos)

| ID     | Mejora                                                                             | Esfuerzo (hh) | Riesgo | Impacto |
| ------ | ---------------------------------------------------------------------------------- | ------------- | ------ | ------- |
| Q2-001 | Extraer mocks de produccion a lazy-loaded module (`__mocks__/recipes.ts`)          | 4             | MEDIO  | Medio   |
| Q2-002 | Refactorizar `phrases.ts`: composicion de ingredientes base + mapa de traducciones | 6             | MEDIO  | Medio   |
| Q2-003 | Implementar Error Boundary de React + pagina de error generica                     | 3             | BAJO   | Medio   |
| Q2-004 | Agregar validacion de schema (Zod) para localStorage y respuestas de API           | 6             | MEDIO  | Alto    |
| Q2-005 | Implementar retry con backoff en `api.ts` (max 3 intentos)                         | 3             | BAJO   | Alto    |
| Q2-006 | Crear servicio de logging central (`services/logger.ts`) con niveles               | 4             | BAJO   | Medio   |

### Nivel 3: Estrategica (Cambios de Arquitectura)

| ID     | Mejora                                                                                  | Esfuerzo (hh) | Riesgo | Impacto |
| ------ | --------------------------------------------------------------------------------------- | ------------- | ------ | ------- |
| Q3-001 | Migrar estado de localStorage a IndexedDB (Dexie.js) para escalabilidad y queries       | 16            | ALTO   | Alto    |
| Q3-002 | Implementar cola de sincronizacion offline (recetas generadas se encolan y sincronizan) | 24            | ALTO   | Alto    |
| Q3-003 | Micro-frontend o separacion de modulo admin/analytics                                   | 40            | ALTO   | Medio   |
| Q3-004 | Backend propio con base de datos (recetas guardadas, feedback, ratings)                 | 80            | ALTO   | Alto    |
| Q3-005 | Motor de recomendacion basado en historial (ML ligero en cliente o edge)                | 60            | ALTO   | Alto    |

---

## 8.2 Roadmap de Crecimiento V2 (Q2-Q4 2026)

**Nota critica:** Se encontro un roadmap original del proyecto en `../maloquetengo_roadmap.md` (fecha 2026-05-18). Este documento exige un stack tecnologico diferente (Zustand, shadcn/ui, Supabase, Playwright) y nombra el producto como "MaLoQueTengo" en vez de "EsLoQueHay". El Roadmap V2 generado en esta auditoria prioriza la continuidad del stack actual y la estabilidad tecnica. Se recomienda una sesion de alineacion de stakeholders para unificar la vision de producto antes de ejecutar cualquier roadmap.

Ver archivo adjunto: `ROADMAP-V2-2026.md`

---

## 8.3 KPIs Tecnicos

Ver archivo adjunto: `KPIs-Esloquehay.json`

---

## 8.4 Integraciones Futuras Propuestas

| Integracion           | Descripcion                                                                | Nivel       | Estimado |
| --------------------- | -------------------------------------------------------------------------- | ----------- | -------- |
| Alertas y Monitoreo   | Sentry o LogRocket para errores en produccion                              | Rapida      | 4 hh     |
| Dashboard Web         | Panel de administracion con metricas de uso (Vercel/Cloudflare Analytics)  | Estructural | 16 hh    |
| Modo Offline          | Service Worker mejora cache de assets y API; IndexedDB para estado         | Estrategica | 32 hh    |
| Multi-idioma completo | i18n ya esta. Falta traduccion de contenido dinamico (recetas) via backend | Estructural | 24 hh    |
| Exportacion de datos  | PDF de receta, compartir por WhatsApp/Telegram con imagen generada         | Rapida      | 8 hh     |
| Sistema de feedback   | Rating de recetas para entrenar recomendaciones                            | Estructural | 12 hh    |
| Autenticacion         | OAuth (Google/Apple) para sincronizar historial cross-device               | Estrategica | 20 hh    |

---

## Acciones Correctivas Priorizadas

### Alta

1. Ejecutar todas las acciones del Nivel 1 (Rapida) en el siguiente sprint.
2. Definir presupuesto y equipo para Nivel 3 (Estrategica) antes de fin de Q2.

### Media

3. Priorizar Q2-004 (Zod) y Q2-005 (Retry) para aumentar la confiabilidad del producto.
4. Diseñar experiencia de Modo Offline antes de implementarla.

### Baja

5. Evaluar proveedores de telemetria (Sentry vs. LogRocket vs. Cloudflare Observability).
