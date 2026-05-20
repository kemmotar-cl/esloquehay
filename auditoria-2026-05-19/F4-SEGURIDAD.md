# FASE 4: AUDITORIA DE SEGURIDAD Y SECRETS

**Resumen Ejecutivo:** APROBADO CON OBSERVACIONES

No se detectaron credenciales hardcodeadas ni secretos expuestos en el codigo fuente. Las comunicaciones con el backend usan TLS. Se identifican riesgos menores relacionados con configuracion de entorno versionada, ausencia de CSP, y dependencias no auditadas.

---

## Mapa de Riesgos

| ID     | Riesgo                                                           | Severidad | Evidencia                                                                    | Plan de Remediacion                                                                                          |
| ------ | ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| F4-001 | Archivo de configuracion de entorno versionado (.env.production) | MEDIA     | `/.env.production` contiene URL del backend.                                 | Mover a `.env.example` y documentar inyeccion via CI/CD o secretos de hosting.                               |
| F4-002 | Archivo `.env.production` es world-readable                      | BAJA      | Permisos `644`. Cualquier usuario del sistema puede leer la URL del backend. | Ajustar a `600` si contuviera secretos. En este caso es bajo riesgo.                                         |
| F4-003 | Dependencias sin auditar (npm audit no ejecutado)                | ALTA      | `package-lock.json` presente.                                                | Ejecutar `npm audit` y remediar inmediatamente.                                                              |
| F4-004 | Ausencia de Content Security Policy (CSP)                        | MEDIA     | `index.html` no contiene meta tag `Content-Security-Policy`.                 | Agregar CSP estricto para prevenir XSS.                                                                      |
| F4-005 | Service Worker con autoUpdate sin validacion de integridad       | BAJA      | `vite.config.ts:10` configura `registerType: 'autoUpdate'`.                  | Verificar que el build en CI firma o valida hashes del SW.                                                   |
| F4-006 | Datos de usuario en localStorage sin encriptacion                | MEDIA     | Historial y preferencias en `localStorage`.                                  | Evaluar si datos sensibles (historial de comidas podria considerarse dato personal) requieren cifrado local. |
| F4-007 | Fuentes externas sin SRI                                         | BAJA      | No se usan CDNs. Solo fuentes locales.                                       | N/A. Aplicable si se agregan CDNs en el futuro.                                                              |

---

## Busqueda de Secrets

Comando ejecutado:

```bash
grep -ri -E '(api_key|apikey|token|password|secret|private_key|aws_access_key_id|aws_secret_access_key| bearer |basic auth)' --include="*" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist -n
```

**Resultado:** Negativo para credenciales. Las unicas coincidencias son:

- `secrets.CLOUDFLARE_ACCOUNT_ID` y `secrets.GITHUB_TOKEN` en GitHub Actions (uso correcto de secretos de CI).
- Texto natural ("secreto de la cocina mediterranea") en componentes.
- Nombres de paquetes (`css-tokenizer`, `js-tokens`).

---

## Permisos de Archivos

Comando ejecutado:

```bash
find . -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -type f -perm /o+rwx -ls
```

**Resultado:** No hay archivos con permiso `777`. La mayoria son `644` o `755`. `.env.production` es `644` (world-readable), aceptable dado que no contiene secretos, pero no ideal.

---

## Comunicaciones Externas

| Servicio           | Protocolo                                          | Estado |
| ------------------ | -------------------------------------------------- | ------ |
| Backend EsLoQueHay | HTTPS (`https://esloquehay-backend...`)            | OK     |
| Cloudflare Trace   | HTTPS (`https://www.cloudflare.com/cdn-cgi/trace`) | OK     |
| ipapi.co           | HTTPS (`https://ipapi.co/json/`)                   | OK     |

---

## Acciones Correctivas Priorizadas

### Alta

1. Ejecutar `npm audit` y aplicar fixes (`npm audit fix` o actualizar paquetes vulnerables).

### Media

2. Renombrar `.env.production` a `.env.example` y remover la version con valores reales del repo. Documentar variables requeridas.
3. Agregar meta tag CSP en `index.html`:
   ```html
   <meta
     http-equiv="Content-Security-Policy"
     content="default-src 'self'; connect-src 'self' https://esloquehay-backend.jorge-labbe-a.workers.dev https://www.cloudflare.com https://ipapi.co; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
   />
   ```
4. Evaluar cifrado de localStorage para datos de usuario si la regulacion local lo requiere.

### Baja

5. Configurar `permissions-policy` y `Referrer-Policy` en headers HTTP (via Cloudflare Pages o meta tags).
