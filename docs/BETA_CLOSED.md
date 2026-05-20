# 🧪 Plan de Beta Cerrada — EsLoQueHay

> **Objetivo:** Validar el producto con 5 usuarios de confianza antes de la beta pública.
> **Fecha estimada:** Junio 2026

---

## Criterios de Selección de Testers

Buscamos 5 personas que:

- 🍳 Cocinen en casa **al menos 3 veces por semana**
- 📱 Usen **celular** como dispositivo principal
- 🌎 Vivan en **Chile, Argentina, México o Colombia**
- 💬 Estén dispuestas a dar **feedback honesto** (positivo y negativo)
- 🧠 No sean técnicos (usuarios "reales", no developers)

**Perfiles ideales:**

1. Estudiante universitario (presupuesto limitado)
2. Padre/madre con familia (cocina diaria)
3. Profesional soltero/a (poco tiempo)
4. Persona mayor (50+, tecnología básica)
5. Inmigrante/hispanohablante en otro país (prueba de i18n)

---

## Onboarding de Testers

### Paso 1: Invitación

Enviales este mensaje:

```
¡Hola! 👋

Te invito a probar EsLoQueHay, una app que genera recetas con IA
usando los ingredientes que ya tenés en casa.

🔗 Link: https://esloquehay.pages.dev

¿Te animás a usarla por 1 semana y contarme qué te parece?
No hay respuestas correctas — quiero saber TODO: lo bueno, lo malo
y lo confuso.

Gracias! 🍳
```

### Paso 2: Instrucciones de Uso

```
📋 INSTRUCCIONES PARA TESTERS

Semana 1: Usá la app cuando NO sepas qué cocinar.
- Abrí https://esloquehay.pages.dev en tu celular
- Agregá los ingredientes que tengas en tu heladera/despensa
- Tocá "Generar" y seguí la receta que te sugiera
- Repetí 3-5 veces durante la semana

Semana 2: Probá las funciones avanzadas.
- Cambiá las preferencias (perfil de sabor, tiempo, comensales)
- Usá el historial para volver a una receta anterior
- Compartí una receta por WhatsApp
- Probá en otro idioma si sabés alguno
```

---

## Checklist de Validación

### Funcionalidad Core

- [ ] Genera receta con ingredientes básicos (pollo, arroz, cebolla)
- [ ] Genera receta con ingredientes "raros" (para probar creatividad de IA)
- [ ] Variaciones de receta funcionan (mismos ingredientes, resultados distintos)
- [ ] Receta económica funciona
- [ ] Fallback a demo funciona cuando no hay conexión

### UX / Flujo

- [ ] Primer uso es intuitivo (sin explicaciones)
- [ ] Input de ingredientes es rápido en celular
- [ ] Nube flotante de ingredientes es útil o distractora
- [ ] Las recetas generadas son "cocinables" en la vida real
- [ ] Los tiempos estimados son realistas

### i18n / Localización

- [ ] Detección de país funciona correctamente
- [ ] Traducciones se ven naturales (no Google Translate-ish)
- [ ] Unidades y expresiones son locales (ej: "cebolla" vs "cebollín")

### PWA

- [ ] Se instala correctamente en iOS ("Add to Home Screen")
- [ ] Se instala correctamente en Android
- [ ] Funciona offline (o muestra mensaje claro)
- [ ] Service worker actualiza la app sin problemas

### Performance

- [ ] Carga inicial < 3 segundos en 3G/4G
- [ ] Generación de receta < 10 segundos
- [ ] No se siente "lenta" o "pesada"

### Bugs

- [ ] No hay errores visibles en consola
- [ ] No hay pantallas en blanco
- [ ] No hay textos cortados o sobrelapados

---

## Formato de Feedback

Pediles que completen esto al final de la semana:

```
📝 FEEDBACK DE BETA CERRADA

Nombre: ________________
País: ________________
Edad: ________________
Dispositivo: ________________

1. ¿Cuántas veces usaste la app? ___
2. ¿Generaste recetas reales? ___ Sí / ___ No
3. Si no, ¿por qué? ___________________________________________

4. ¿Qué te GUSTÓ más?
_______________________________________________________________

5. ¿Qué te FRUSTRÓ o CONFUNDIÓ?
_______________________________________________________________

6. ¿Hubo algo que NO PUDISTE hacer?
_______________________________________________________________

7. ¿Recomendarías la app a alguien? ___ Sí / ___ No
8. ¿Pagarías por una versión sin ads con más funciones? ___ Sí / ___ No

9. Calificación general (1-10): ___

10. Comentarios libres:
_______________________________________________________________
```

---

## Métricas a Medir

| Métrica                   | Target                              | Cómo medir             |
| ------------------------- | ----------------------------------- | ---------------------- |
| Tasa de activación        | 80% (4/5 generan al menos 1 receta) | GA4 eventos            |
| Retención D7              | 60% (3/5 vuelven al día 7)          | GA4                    |
| NPS                       | > 30                                | Encuesta manual        |
| Tiempo promedio de sesión | > 2 min                             | GA4                    |
| Bugs reportados           | < 5 críticos                        | Formulario de feedback |

---

## Próximos Pasos Post-Beta

1. **Analizar feedback** → priorizar fixes
2. **Iterar** → corregir issues críticos
3. **Beta pública** → 50-100 usuarios (Julio 2026)
4. **Launch oficial** → Diciembre 2026

---

_Última actualización: 2026-05-19_
