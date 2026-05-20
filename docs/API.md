# EsLoQueHay — Documentación de API

**Versión:** 1.1  
**Fecha:** 2026-05-19  
**Base URL:** `https://esloquehay-backend.jorge-labbe-a.workers.dev`

---

## 1. Endpoints

### 1.1 Health Check

Verifica el estado del backend y el modelo de IA activo.

```http
GET /api/health
```

**Headers opcionales:**

```http
X-Session-ID: <uuid-de-sesion>
```

**Respuesta exitosa (200 OK):**

```json
{
  "status": "ok",
  "model": "@cf/meta/llama-3.1-8b-instruct",
  "source": "cloudflare-workers-ai",
  "keyConfigured": true
}
```

**Respuesta de error:**

```json
{
  "keyConfigured": false
}
```

**Notas:**

- Timeout del cliente: 8000ms
- Retry automático: 3 intentos con backoff exponencial
- Si la petición falla por red, el cliente asume `{ keyConfigured: false }`
- El health check ya **no bloquea** la generación de recetas — solo actualiza un badge visual

---

### 1.2 Generar Receta

Genera una receta personalizada basada en ingredientes y preferencias del usuario.

```http
POST /api/recipe
Content-Type: application/json
```

**Headers opcionales:**

```http
X-Session-ID: <uuid-de-sesion>
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
- `400`: Request inválido (falta campo requerido o formato incorrecto) — **pendiente de implementar**
- `500`: Error interno del servidor o fallo en servicio de IA
- `524`: Timeout (Cloudflare) — manejado por retry en cliente

> ⚠️ **Nota técnica:** Actualmente el backend devuelve 500 para casi todos los errores. La diferenciación de status codes está pendiente.

---

### 1.3 Generar Itinerario

Genera un itinerario de viaje basado en preferencias.

```http
POST /api/itinerary
Content-Type: application/json
```

**Request Body:**

```typescript
interface ItineraryRequest {
  destination: string;
  duration: number; // Días
  budget: 'low' | 'medium' | 'high';
  interests?: string[];
  language?: string;
}
```

**Respuesta:** Mismo formato que `/api/recipe` (estructura compartida).

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
  category?: string;
  source?: 'ia' | 'mock' | 'variation';
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
- **Retry:** 3 intentos con backoff exponencial (300ms × 2^attempt).
- **Headers:** `Content-Type: application/json`, `X-Session-ID` (si disponible).

### Funciones Exportadas

```typescript
// Genera una receta. Lanza Error si success === false o schema inválido.
async function generateRecipe(request: RecipeRequest, sessionId?: string): Promise<Recipe>;

// Verifica estado del backend.
async function checkHealth(sessionId?: string): Promise<{ keyConfigured: boolean }>;
```

### Manejo de Errores en Cliente

- `generateRecipe` valida respuesta con Zod schema (`apiRecipeResponseSchema`)
- Si schema falla → lanza Error con mensaje descriptivo
- Si `success === false` → lanza Error con mensaje del backend
- Si red falla después de 3 retries → lanza Error
- **App.tsx** captura cualquier error y muestra `mockRecipe` como fallback con toast de advertencia

---

## 4. Servicios Externos Consumidos por el Cliente

| Servicio         | URL                                        | Propósito                      | Timeout Cliente |
| ---------------- | ------------------------------------------ | ------------------------------ | --------------- |
| Cloudflare Trace | `https://www.cloudflare.com/cdn-cgi/trace` | Detección de país (código ISO) | Sin timeout     |
| ipapi.co         | `https://ipapi.co/json/`                   | Fallback de detección de país  | Sin timeout     |

> ⚠️ Ambos servicios carecen de timeout en la implementación actual.

---

## 5. Versionado y Compatibilidad

- **Versión actual de API:** Implícita (no hay `/v1/` en path).
- **Estrategia recomendada:** Al introducir cambios breaking, agregar prefijo de versión (`/api/v2/recipe`) y mantener `/api/recipe` con backward compatibility durante 2 ciclos de release.

---

## 6. Rate Limiting

- **Límite actual (Cloudflare Workers free plan):** 100,000 requests/día
- **Límite Workers AI:** 10K neurons/día gratis
- **Respuesta al exceder límite:** `429 Too Many Requests` (Cloudflare nativo)
- **Manejo en cliente:** Pendiente de implementar (mostrar mensaje al usuario)
