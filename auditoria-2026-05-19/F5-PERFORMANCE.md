# FASE 5: AUDITORIA DE PERFORMANCE Y RECURSOS

**Resumen Ejecutivo:** APROBADO CON OBSERVACIONES

La aplicacion no presenta cuellos de botella graves para su escala actual (frontend SPA sin base de datos local pesada). Se identifican oportunidades de mejora en carga inicial, renderizados innecesarios, y bloqueo en deteccion de pais.

---

## Benchmarks (Estimados / Observados)

| Metrica                     | Valor Observado                     | Escenario                          | Nota                                           |
| --------------------------- | ----------------------------------- | ---------------------------------- | ---------------------------------------------- |
| Tamano bundle fuente        | ~13,500 lineas (incl. JSON)         | Codigo total excl. node_modules    | ~22KB solo en `phrases.ts` de datos estaticos. |
| Assets no comprimidos       | 1.8MB (`chef_logo_pastel_cute.png`) | Root del repo                      | No se sirve, pero esta en el repo.             |
| Tiempo de deteccion de pais | Variable (serie de 2 fetch)         | Inicio de app                      | Bloquea renderizado inicial hasta completar.   |
| Timeout API                 | 8,000 ms                            | `src/services/api.ts:7`            | Razonable, pero sin retry.                     |
| localStorage operaciones    | <1ms                                | Por cada update de historial/prefs | Sincronas. Sin batching.                       |

---

## Cuellos de Botella Identificados

### CB-001: Bloqueo de renderizado inicial por geolocalizacion

**Archivo:** `src/hooks/useCountry.ts:95-109`
**Severidad:** ALTA

El hook `useCountryDetection` inicia en `loading: true` y no renderiza la app hasta que ambos servicios externos responden o fallan. En una conexion lenta o si ambos servicios fallan, el usuario ve "Detectando tu ubicacion..." indefinidamente (sin timeout).

**Impacto:** First Contentful Paint (FCP) retrasado. Usuario podria abandonar.

### CB-002: Datos mock pesados en bundle principal

**Archivo:** `src/App.tsx:23-250`
**Severidad:** MEDIA

`mockRecipe` y `variationMocks` son objetos grandes con texto extenso. Se incluyen siempre en el bundle principal aunque solo se usen cuando el backend falla.

**Impacto:** Aumenta tamaño de JS inicial innecesariamente.

### CB-003: Re-renderizados en RecipeCard

**Archivo:** `src/components/RecipeCard.tsx:20-32`
**Severidad:** BAJA

`difficultyColor` y `timeText` se recalculan en cada render. Podrian memoizarse con `useMemo` dado que dependen de `recipe`.

### CB-004: Carga sincrona de locales i18n no usados

**Archivo:** `src/i18n/index.ts:59-74`
**Severidad:** BAJA

El sistema carga traducciones bajo demanda via `import()` dinamico. Esto es correcto. Sin embargo, todos los archivos JSON estan en `src/` y se incluyen en el build. No es un problema hasta ~20 idiomas, pero escala linealmente.

### CB-005: Operaciones de localStorage sincronas y frecuentes

**Archivo:** `src/hooks/useHistory.ts:32-37`
**Severidad:** BAJA

Cada vez que se agrega una receta, se serializa todo el historial (hasta 50 entradas) a JSON y se escribe en localStorage. Para 50 entradas el costo es despreciable, pero no hay batching.

---

## Escalabilidad Estimada (Frontend)

| Dataset                    | Uso de Memoria            | Uso de CPU | Viabilidad                                   |
| -------------------------- | ------------------------- | ---------- | -------------------------------------------- |
| 1k registros (historial)   | localStorage lleno (~5MB) | N/A        | Requiere paginacion/localStorage quota       |
| 10k recetas generadas      | N/A (no se persisten)     | N/A        | No aplica (sin backend propio)               |
| 100k usuarios concurrentes | N/A                       | N/A        | Depende 100% del backend Cloudflare Workers. |

---

## Acciones Correctivas Priorizadas

### Alta

1. Implementar timeout en `useCountry.ts` (max 2-3 segundos) y renderizar la app con fallback generico mientras detecta.
2. Mover `mockRecipe` y `variationMocks` a un archivo separado y cargarlo via `import()` dinamico solo cuando el backend falle.

### Media

3. Memoizar calculos de `RecipeCard` (`timeText`, `difficultyColor`).
4. Ejecutar Lighthouse o Web Vitals audit para obtener metricas reales de FCP, LCP, CLS.

### Baja

5. Implementar Virtual DOM o windowing solo si el historial crece mas alla de 50 items visibles.
6. Evaluar code-splitting por ruta si la app crece (React.lazy + Suspense).
