# FASE 1: AUDITORIA DE INTEGRIDAD ESTRUCTURAL

**Resumen Ejecutivo:** APROBADO CON OBSERVACIONES

La estructura base del proyecto es consistente con una aplicacion React + Vite. Sin embargo, existen archivos temporales versionados, codigo duplicado masivo, ausencia de roadmap/requisitos, y mocks de desarrollo embebidos en el codigo de produccion.

---

## Tabla de Hallazgos

| ID     | Hallazgo                                                                                               | Severidad | Archivo(s) / Linea                                                   | Evidencia                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------ | --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| F1-001 | Archivo temporal de editor (Kate) versionado                                                           | ALTA      | `.Prompt_Auditoria_Total_TurtleTrading.txt.kate-swp`                 | Archivo swap presente en root. No debe versionarse.                                                                      |
| F1-002 | README.md es template por defecto de Vite, sin documentar el proyecto real                             | ALTA      | `README.md`                                                          | No describe arquitectura, dominio, ni decisiones de diseno.                                                              |
| F1-003 | Codigo duplicado masivo: LOCALIZED_INGREDIENTS repite 14 arrays con ~24 items casi identicos           | ALTA      | `src/data/phrases.ts`                                                | **CORREGIDO:** Refactorizado a composicion de datos base + mapa de traducciones. Reduccion de ~400 lineas a ~50.         |
| F1-004 | Mocks de desarrollo embebidos en bundle de produccion                                                  | MEDIA     | `src/App.tsx`                                                        | Lineas 23-250. `mockRecipe` y `variationMocks` son datos estaticos pesados compilados.                                   |
| F1-005 | Assets huérfanos no referenciados por la aplicacion                                                    | MEDIA     | `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png` | No se importan en ningun componente. `public/logo.png` es el logo activo.                                                |
| F1-006 | Imagen de diseno en root no referenciada en build                                                      | MEDIA     | `chef_logo_pastel_cute.png`                                          | Archivo de 1.8MB en root del repo. No referenciado en codigo fuente ni en config.                                        |
| F1-007 | Roadmap existe pero esta DESVINCULADO del repositorio                                                  | ALTA      | `../maloquetengo_roadmap.md`                                         | Hallado FUERA de la carpeta del proyecto. No versionado con el codigo. **CORREGIDO: Se creo `docs/ROADMAP.md` oficial.** |
| F1-008 | Falta punto de entrada documentado por modulo                                                          | MEDIA     | `src/services/`, `src/hooks/`                                        | No hay README ni JSDoc en modulos que expliquen contratos y dependencias.                                                |
| F1-009 | Discrepancia critica: Roadmap nombra el producto "MaLoQueTengo" pero el codigo implementa "EsLoQueHay" | ALTA      | `../maloquetengo_roadmap.md:1`, `src/App.tsx:526`, `package.json:2`  | Identidad de producto inconsistente entre documentacion de planificacion y codigo.                                       |
| F1-010 | Stack tecnologico del roadmap no coincide con implementacion                                           | ALTA      | `../maloquetengo_roadmap.md:98-113`                                  | Roadmap exige Zustand, shadcn/ui, Supabase, Playwright. Ninguno esta en `package.json`.                                  |
| F1-011 | Documentos tecnicos obligatorios del roadmap (Fase 0) estan ausentes                                   | ALTA      | `../maloquetengo_roadmap.md:51`                                      | `ARCHITECTURE.md` y `API.md` no existen en el repo. **CORREGIDO: Se crearon ambos en `docs/`.**                          |

---

## Detalle de Codigo Duplicado

```typescript
// src/data/phrases.ts
// Bloque repetido 14 veces (colombia, peru, venezuela, ecuador, bolivia, uruguay, paraguay, costa_rica, panama, guatemala, etc.)
// Cada bloque define un array de 24 objetos {emoji, label} con las mismas estructuras y emojis.
// Ejemplo de duplicacion estructural:
{
  emoji: '🍅', label: 'tomate'
}
// Solo cambia el valor de 'label' por pais.
```

**Recomendacion:** Extraer un mapa de traducciones de ingredientes y un array base de emojis/claves para eliminar la redundancia.

---

## Acciones Correctivas Priorizadas

### Alta

1. Eliminar `.Prompt_Auditoria_Total_TurtleTrading.txt.kate-swp` y agregar `*.kate-swp` a `.gitignore`.
2. Mover o vincular `maloquetengo_roadmap.md` dentro del repositorio del proyecto (ej. `docs/ROADMAP.md`).
3. Resolver discrepancia de identidad de marca: unificar a "EsLoQueHay" o "MaLoQueTengo" en TODO el ecosistema (codigo, roadmap, dominio, registro de marca).
4. Crear `ARCHITECTURE.md` y `API.md` como exige la Fase 0 del roadmap original.
5. Redactar `README.md` real del proyecto.

### Media

4. Extraer `LOCALIZED_INGREDIENTS` a un sistema de i18n o generar los arrays por composicion para reducir de ~400 lineas a ~50.
5. Evaluar separar `mockRecipe` y `variationMocks` a un modulo `__mocks__` o cargarlos via lazy/dynamic import para reducir bundle inicial.
6. Eliminar assets huérfanos (`src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`) tras confirmar que no se usan.

### Baja

7. Agregar JSDoc a funciones publicas de `services/api.ts` y hooks.
