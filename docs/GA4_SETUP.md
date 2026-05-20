# Guía de Configuración — Google Analytics 4

> **Estado:** Pendiente de configurar en Cloudflare Pages

---

## Paso 1: Crear Propiedad en Google Analytics 4

1. Andá a [https://analytics.google.com](https://analytics.google.com)
2. Iniciá sesión con tu cuenta de Google
3. Click en **"Administrar"** (rueda dentada, abajo a la izquierda)
4. Click en **"Crear"** → **"Propiedad"**
5. Completá:
   - **Nombre de la propiedad:** `EsLoQueHay`
   - **Zona horaria de informes:** `Santiago, Chile (GMT-04:00)`
   - **Moneda:** `Peso chileno (CLP)`
6. Click **"Siguiente"** → completá información del negocio → **"Crear"**

---

## Paso 2: Obtener el Measurement ID

1. En la nueva propiedad, andá a **Administrar** → **Flujos de datos** → **Web**
2. Click en **"Agregar flujo"**
3. Completá:
   - **URL del sitio web:** `https://esloquehay.pages.dev`
   - **Nombre del flujo:** `EsLoQueHay Web`
4. Click **"Crear"**
5. Copiá el **ID de medición** (formato: `G-XXXXXXXXXX`)

---

## Paso 3: Configurar en Cloudflare Pages

1. Andá a [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navegá a **Pages** → `esloquehay` → **Settings** → **Environment variables**
3. Agregá la variable:
   ```
   Name:  VITE_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX   (tu ID real)
   ```
4. Click **"Save"**
5. Andá a **Deployments** → click en **"Retry deployment"** en el último deploy

---

## Paso 4: Verificar que funciona

1. Abrí [https://esloquehay.pages.dev](https://esloquehay.pages.dev)
2. Abrí las DevTools del navegador (F12) → pestaña **Network**
3. Filtrá por `google-analytics` o `gtag`
4. Deberías ver requests saliendo a `https://www.google-analytics.com/g/collect`
5. En Google Analytics → **Reports** → **Realtime**, deberías ver tu propia visita

---

## Eventos que ya están trackeados

El código actual envía estos eventos automáticamente:

| Evento                     | Cuándo se dispara                       |
| -------------------------- | --------------------------------------- |
| `page_view`                | Al cargar la app                        |
| `recipe_generate_start`    | Al iniciar generación de receta         |
| `recipe_generate_success`  | Cuando la receta se genera exitosamente |
| `recipe_generate_fallback` | Cuando cae a modo demo                  |
| `language_change`          | Al cambiar idioma                       |
| `history_open`             | Al abrir historial                      |
| `history_clear`            | Al limpiar historial                    |
| `history_select`           | Al seleccionar receta del historial     |
| `history_remove`           | Al eliminar entrada del historial       |
| `history_export`           | Al exportar JSON/CSV                    |
| `preferences_open`         | Al abrir preferencias                   |

---

## Configuración AdSense (después de aprobación)

Cuando Google apruebe el sitio para AdSense:

1. Andá a [https://www.google.com/adsense](https://www.google.com/adsense)
2. Creá dos **Ad Units**:
   - `EsLoQueHay_Top_Banner` → copiá el `data-ad-slot`
   - `EsLoQueHay_Bottom_Banner` → copiá el `data-ad-slot`
3. Configurá en Cloudflare Pages:
   ```
   VITE_ADSENSE_SLOT_TOP=XXXXXXXXXX
   VITE_ADSENSE_SLOT_BOTTOM=XXXXXXXXXX
   ```
4. Re-deploy

---

_Última actualización: 2026-05-19_
