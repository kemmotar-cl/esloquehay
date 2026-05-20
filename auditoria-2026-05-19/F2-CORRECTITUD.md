# FASE 2: AUDITORIA DE CORRECTITUD LOGICA Y MATEMATICA

**Resumen Ejecutivo:** APROBADO CON OBSERVACIONES

La logica de presentacion y calculo de tiempos es correcta. Se detectan funcionalidades de negocio declaradas en los tipos pero NO implementadas en el flujo principal, y una logica de filtrado de afiliados fragil que depende del titulo de la receta.

---

## Reglas Auditadas

### R1: Calculo de tiempo total de receta

| Campo       | Original (Tipo)       | Implementado                          | Diferencia                                               | Riesgo |
| ----------- | --------------------- | ------------------------------------- | -------------------------------------------------------- | ------ |
| `totalTime` | `prepTime + cookTime` | `src/components/RecipeCard.tsx:26`    | Ninguna. Formula implementada fielmente.                 | BAJA   |
| Formato     | dias/horas/minutos    | `src/components/RecipeCard.tsx:28-32` | Ninguna. Usa 1440 min/dia y 60 min/hora. Sin off-by-one. | BAJA   |

```typescript
// src/components/RecipeCard.tsx (lineas 26-32)
const totalTime = recipe.prepTime + recipe.cookTime;
const timeText =
  totalTime >= 1440
    ? `${String(Math.floor(totalTime / 1440))}d ${String(Math.floor((totalTime % 1440) / 60))}h`
    : totalTime >= 60
      ? `${String(Math.floor(totalTime / 60))}h ${String(totalTime % 60)}m`
      : `${String(totalTime)} min`;
```

### R2: Limite de historial

| Campo       | Original | Implementado                | Diferencia                                  | Riesgo |
| ----------- | -------- | --------------------------- | ------------------------------------------- | ------ |
| `MAX_ITEMS` | 50       | `src/hooks/useHistory.ts:5` | Ninguna. `slice(0, MAX_ITEMS)` es correcto. | BAJA   |

### R3: Aleatoriedad de frases (Taglines y Boton)

| Campo           | Original              | Implementado                                                       | Diferencia                                                                                  | Riesgo |
| --------------- | --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------ |
| `Math.random()` | Distribucion uniforme | `src/data/phrases.ts:198`, `src/components/IngredientInput.tsx:54` | Ninguna matematica. **Sin semilla fija**: la experiencia no es reproducible entre sesiones. | MEDIA  |

### R4: Seleccion de pais por deteccion de IP

| Campo     | Original                            | Implementado                    | Diferencia                                                                                                                        | Riesgo |
| --------- | ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fallback  | Pais por defecto si falla deteccion | `src/hooks/useCountry.ts:99`    | Fallback forzado a `'chile'` sin importar la ubicacion real del usuario.                                                          | MEDIA  |
| Cobertura | Paises hispanohablantes             | `src/hooks/useCountry.ts:11-26` | Faltan Nicaragua, Honduras, El Salvador, Cuba, Republica Dominicana, Puerto Rico. Usuario de esos paises cae en fallback chileno. | MEDIA  |

### R5: Preferencias de usuario enviadas al backend

| Campo                 | Tipo definido (RecipeRequest) | Enviado en App.tsx | Diferencia                        | Riesgo   |
| --------------------- | ----------------------------- | ------------------ | --------------------------------- | -------- | --- | ---- |
| `dietaryRestrictions` | `string[]` opcional           | **NO ENVIADO**     | Campo omitido en `handleGenerate` | **ALTA** |
| `experienceMode`      | `boolean` opcional            | **NO ENVIADO**     | Campo omitido en `handleGenerate` | **ALTA** |
| `budget`              | `'low'                        | 'medium'           | 'high'`                           | Enviado  | OK  | BAJA |
| `language`            | `string`                      | Enviado            | OK                                | BAJA     |

```typescript
// src/App.tsx (lineas 323-333)
const result = await generateRecipe({
  ingredients,
  country: recipeCountry,
  flavorProfile: preferences.flavorProfile,
  skillLevel: preferences.skillLevel,
  servings: preferences.servings,
  maxPrepTime: preferences.maxPrepTime,
  additionalIngredient: preferences.additionalIngredient,
  budget: preferences.budget,
  language: preferences.language,
  // FALTAN: dietaryRestriction, experienceMode
});
```

### R6: Filtro de links de afiliados por categoria de receta

| Campo     | Original                 | Implementado                              | Diferencia                                                                                                                          | Riesgo   |
| --------- | ------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Categoria | Basada en tipo de receta | `src/components/AffiliateLinks.tsx:47-52` | Usa `recipe.title.split(' ')[0]`. Si el titulo empieza con articulo ("Un", "El", "La", "Pollo"), el filtro es inefectivo o erroneo. | **ALTA** |

```typescript
// src/components/AffiliateLinks.tsx (lineas 47-52)
const links = recipeCategory
  ? AFFILIATE_LINKS.filter(
      (l) =>
        l.category === 'utensilios' || l.name.toLowerCase().includes(recipeCategory.toLowerCase())
    )
  : AFFILIATE_LINKS;
```

**Ejemplo de fallo:** Receta "Un risotto de pollo" -> `recipeCategory = "Un"`. Ningun link contiene "un". Solo se muestran utensilios.

### R7: Rango de inputs numericos

| Campo           | Min | Max  | Step          | Implementado                         | Riesgo |
| --------------- | --- | ---- | ------------- | ------------------------------------ | ------ |
| `servings`      | 1   | 10   | 1 (implicito) | OK                                   | BAJA   |
| `particleSpeed` | 0.2 | 3.0  | 0.1           | OK                                   | BAJA   |
| `maxPrepTime`   | 5   | 2880 | 5             | OK. `formatTime` soporta hasta dias. | BAJA   |

### R8: Redondeos y tipos numericos

| Campo                              | Uso       | Estado    |
| ---------------------------------- | --------- | --------- |
| `parseInt` en servings/maxPrepTime | Enteros   | Correcto. |
| `parseFloat` en particleSpeed      | Decimales | Correcto. |
| `.toFixed(1)` en particleSpeed UI  | Formato   | Correcto. |

---

## Acciones Correctivas Priorizadas

### Alta

1. **F2-R5:** Incluir `dietaryRestriction` y `experienceMode` en el payload de `generateRecipe` o eliminarlos del contrato de API si no estan planeados.
2. **F2-R6:** Reemplazar logica de `recipe.title.split(' ')[0]` por un campo estructurado `category` o `tags` en el objeto `Recipe`.

### Media

3. **F2-R4:** Ampliar `COUNTRY_MAP` con paises hispanohablantes faltantes o cambiar fallback a `'es_generic'` en vez de `'chile'`.
4. **F2-R3:** Documentar que la aleatoriedad no es reproducible (por diseño). No requiere fix salvo requerimiento expreso.

### Baja

5. Agregar validacion de rango en `update()` de `PreferencesPanel` para prevenir valores NaN si el input se corrompe.
