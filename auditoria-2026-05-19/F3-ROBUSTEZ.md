# FASE 3: AUDITORIA DE ROBUSTEZ Y MANEJO DE ERRORES

**Resumen Ejecutivo:** RECHAZADO

El sistema presenta un patron sistematico de silenciamiento de errores (`catch {}` vacios) en multiples modulos criticos. No hay reintentos ante fallos de red, no hay timeout en deteccion de pais, y los fallos del backend son enmascarados con datos mock sin notificar al usuario.

---

## Matriz de Escenarios de Fallo vs. Comportamiento Observado

| ID     | Escenario de Fallo                                                  | Modulo                                          | Comportamiento Observado                                                                                                                     | Severidad   |
| ------ | ------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| F3-001 | API externa caida (backend 500/502)                                 | `src/services/api.ts:35-37`                     | Error lanzado. Capturado en `App.tsx:336` (catch vacio). Se muestra `mockRecipe` sin indicar al usuario que es fallback.                     | **CRITICA** |
| F3-002 | API externa lenta (>8s)                                             | `src/services/api.ts:9-19`                      | Timeout de 8000ms via `AbortController`. Bien. Pero luego cae en F3-001.                                                                     | ALTA        |
| F3-003 | `ipapi.co` caida o lenta                                            | `src/hooks/useCountry.ts:77-84`                 | `catch {}` vacio. Retorna `null`. Fallback a Chile. Sin notificacion.                                                                        | ALTA        |
| F3-004 | `cloudflare.com/cdn-cgi/trace` caida                                | `src/hooks/useCountry.ts:62-70`                 | `catch {}` vacio. Intenta `ipapi.co`. Si ambas fallan, fallback a Chile.                                                                     | MEDIA       |
| F3-005 | localStorage lleno (quota exceeded)                                 | `src/hooks/useLocalStorage.ts:21-24`            | `catch {}` vacio. Estado en React se actualiza pero NO persiste. Usuario no sabe que perdio datos.                                           | **CRITICA** |
| F3-006 | localStorage corrupto (JSON invalido)                               | `src/hooks/useLocalStorage.ts:8-13`             | `catch {}` vacio. Retorna `initialValue`. Pierde historial/preferencias sin aviso.                                                           | ALTA        |
| F3-007 | Backend devuelve HTML en vez de JSON (ej. Cloudflare error page)    | `src/services/api.ts:29`                        | `response.json()` puede fallar. No hay try/catch en `api.ts`. Error sube a App.tsx y se silencia.                                            | ALTA        |
| F3-008 | Historial excede quota de localStorage                              | `src/hooks/useHistory.ts:21-26`                 | `catch {}` vacio. Nuevo historial no se guarda.                                                                                              | ALTA        |
| F3-009 | `dietaryRestriction` o preferencias invalidas tras cambio de schema | `src/hooks/useLocalStorage.ts:10`               | JSON.parse exitoso pero objeto no valida schema. Puede propagar datos invalidos a componentes.                                               | MEDIA       |
| F3-010 | Corte de red total (offline)                                        | `src/services/api.ts`                           | `checkHealth` retorna `{keyConfigured:false}`. Modo demo activado. `generateRecipe` usara mock. Sin indicacion visual clara de modo offline. | MEDIA       |
| F3-011 | Disco lleno (escritura localStorage)                                | `src/hooks/useHistory.ts`, `useLocalStorage.ts` | Silenciado por `catch {}`. Ver F3-005 y F3-008.                                                                                              | ALTA        |
| F3-012 | Entrada de usuario maliciosa en ingredientes                        | `src/components/IngredientInput.tsx:60-64`      | Se aplica `.trim().toLowerCase()`. No hay sanitizacion XSS. Se envia directo al backend. Depende de backend para escapar.                    | MEDIA       |

---

## Evidencia de Silenciamiento de Errores

```typescript
// src/hooks/useLocalStorage.ts
} catch {
  return initialValue;          // Linea 11
}
// ...
} catch {
  // ignore quota exceeded       // Linea 23
}
// ...
} catch {
  // ignore parse error          // Linea 38
}

// src/hooks/useHistory.ts
} catch {
  return [];                     // Linea 16
}
// ...
} catch {
  // ignore quota exceeded       // Linea 24
}

// src/hooks/useCountry.ts
} catch {
  return null;                   // Linea 68
}
// ...
} catch {
  return null;                   // Linea 82
}

// src/services/api.ts
} catch {
  return { keyConfigured: false }; // Linea 47-48
}

// src/App.tsx
} catch {                          // Linea 336
  setRecipe(mockRecipe);
  addToHistory(mockRecipe);
}
```

---

## Logs de Error

**Estado:** AUSENTE. No existe sistema de logging estructurado. No hay `console.error`, `console.warn`, ni envio de errores a servicio de telemetria. En produccion, un fallo es completamente invisible para el equipo de desarrollo.

---

## Acciones Correctivas Priorizadas

### Alta

1. **Eliminar todos los `catch {}` vacios.** Como minimo, reemplazarlos por `console.error('Contexto', error)` o un logger centralizado.
2. Implementar un mecanismo de retry con backoff exponencial para llamadas al backend (`generateRecipe`).
3. Agregar timeout a las llamadas de geolocalizacion (`useCountry.ts`).
4. Mostrar indicador visual claro cuando la receta mostrada es un fallback/mock por fallo de backend.

### Media

5. Validar schema de localStorage al cargar (usar zod o similar) para evitar propagar objetos corruptos.
6. Agregar `try/catch` alrededor de `response.json()` en `api.ts` con mensaje de error descriptivo.
7. Implementar un Error Boundary de React para capturar errores de renderizado.

### Baja

8. Considerar usar `navigator.onLine` para detectar modo offline explicitamente y ajustar la UI.
