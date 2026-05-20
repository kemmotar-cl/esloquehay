# EsLoQueHay — Documentación de API

**Versión:** 1.0  
**Fecha:** 2026-05-19  
**Base URL:** `https://esloquehay-backend.jorge-labbe-a.workers.dev`

---

## 1. Endpoints

### 1.1 Health Check

Verifica el estado del backend y si la clave de IA está configurada.

```http
GET /api/health
```

**Respuesta exitosa (200 OK):**

```json
{
  "keyConfigured": true
}
```

**Respuesta de error (fallback en cliente):**

```json
{
  "keyConfigured": false
}
```

**Notas:**

- Timeout del cliente: 8000ms (`src/services/api.ts:7`)
- Si la petición falla por red, el cliente asume `{ keyConfigured: false }` y entra en modo demo.

---

### 1.2 Generar Receta

Genera una receta personalizada basada en ingredientes y preferencias del usuario.

```http
POST /api/recipe
Content-Type: application/json
```

**Request Body:**

```typescript
interface RecipeRequest {
  ingredients: string[]; // Requerido. Ingredientes disponibles.
  dietaryRestrictions?: string[]; // Opcional. Restricciones dietéticas.
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'; // Opcional
  servings?: number; // Opcional. Default: 2
  flavorProfile?: string; // Opcional. Ej: 'traditional', 'spicy'
  country?: string; // Opcional. Código de país (ej: 'chile')
  experienceMode?: boolean; // Opcional. Modo experiencia gourmet.
  maxPrepTime?: number; // Opcional. Tiempo máximo en minutos.
  additionalIngredient?: string; // Opcional. Ingrediente siempre disponible.
  budget?: 'low' | 'medium' | 'high'; // Opcional. Presupuesto estimado.
  language?: string; // Opcional. Código de idioma (ej: 'es')
}
```

**Ejemplo de Request:**

```json
{
  "ingredients": ["pollo", "arroz", "cebolla"],
  "country": "chile",
  "flavorProfile": "traditional",
  "skillLevel": "intermediate",
  "servings": 4,
  "maxPrepTime": 45,
  "budget": "medium",
  "language": "es"
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-generado",
    "title": "Pollo a la cazuela con arroz",
    "description": "Una receta reconfortante...",
    "experience": "Comfort food que abraza el alma",
    "ingredients": ["2 pechugas de pollo", "1 taza de arroz", ...],
    "steps": ["Calentá el aceite...", "Retirá el pollo...", ...],
    "prepTime": 10,
    "cookTime": 30,
    "difficulty": "Fácil",
    "servings": 4,
    "gourmetTips": [
      {
        "title": "Dorado perfecto del pollo",
        "description": "No muevas el pollo durante los primeros 3 minutos...",
        "technique": "Maillard Reaction"
      }
    ],
    "variations": [
      {
        "name": "Arroz meloso estilo risotto",
        "description": "Cremosidad italiana...",
        "extraIngredients": ["Vino blanco", "Queso parmesano"],
        "twist": "Técnica italiana"
      }
    ],
    "winePairing": "Un Chardonnay sin roble...",
    "platingTip": "Serví en plato hondo..."
  }
}
```

**Respuesta de Error:**

```json
{
  "success": false,
  "error": "Error generando la receta"
}
```

**Códigos de estado HTTP:**

- `200`: Éxito
- `400`: Request inválido (falta campo requerido o formato incorrecto)
- `500`: Error interno del servidor o fallo en servicio de IA
- `524`: Timeout (Cloudflare) — manejado por AbortController del cliente a los 8s

---

## 2. Contratos de Datos (TypeScript)

### Recipe

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  experience: string;
  ingredients: string[];
  steps: string[];
  prepTime: number; // minutos
  cookTime: number; // minutos
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  servings: number;
  gourmetTips: GourmetTip[];
  variations: RecipeVariation[];
  winePairing?: string;
  platingTip?: string;
}
```

### GourmetTip

```typescript
interface GourmetTip {
  title: string;
  description: string;
  technique?: string;
}
```

### RecipeVariation

```typescript
interface RecipeVariation {
  name: string;
  description: string;
  extraIngredients: string[];
  twist: string;
}
```

---

## 3. Cliente HTTP (Frontend)

El cliente se encuentra en `src/services/api.ts`.

### Configuración

- **Base URL:** Variable de entorno `VITE_API_URL` o fallback hardcodeado a producción.
- **Timeout:** 8000ms via `AbortController`.
- **Content-Type:** `application/json`

### Funciones Exportadas

```typescript
// Genera una receta. Lanza Error si success === false.
async function generateRecipe(request: RecipeRequest): Promise<Recipe>;

// Verifica estado del backend.
async function checkHealth(): Promise<{ keyConfigured: boolean }>;
```

### Manejo de Errores en Cliente

- `generateRecipe` lanza `Error` con mensaje del backend o genérico.
- `App.tsx` captura el error y muestra `mockRecipe` como fallback.
- **Pendiente (auditoría F3):** Implementar retry con backoff y logger de errores.

---

## 4. Servicios Externos Consumidos por el Cliente

| Servicio         | URL                                        | Propósito                      | Timeout Cliente              |
| ---------------- | ------------------------------------------ | ------------------------------ | ---------------------------- |
| Cloudflare Trace | `https://www.cloudflare.com/cdn-cgi/trace` | Detección de país (código ISO) | **Sin timeout (BUG-F3-003)** |
| ipapi.co         | `https://ipapi.co/json/`                   | Fallback de detección de país  | **Sin timeout (BUG-F3-003)** |

**Nota:** Ambos servicios carecen de timeout en la implementación actual. Ver acciones correctivas en auditoría F3.

---

## 5. Versionado y Compatibilidad

- **Versión actual de API:** Implícita (no hay `/v1/` en path).
- **Estrategia recomendada:** Al introducir cambios breaking, agregar prefijo de versión (`/api/v2/recipe`) y mantener `/api/recipe` con backward compatibility durante 2 ciclos de release.

---

## 6. Rate Limiting

- **Límite actual (Cloudflare Workers):** 10 requests/minuto por IP (plan gratuito).
- **Respuesta al exceder límite:** `429 Too Many Requests`.
- **Manejo en cliente:** Pendiente de implementar (mostrar mensaje al usuario).
