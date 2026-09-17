# NODO v0.8.63 — Checklist de regresión

## Portal de Firmas
- [x] Existe `src/FirmaPortal.jsx`.
- [x] `src/main.jsx` enruta `/?firmas=1` al Portal de Firmas.
- [x] La portada pública muestra un botón visible `Portal de Firmas`.
- [x] La Mesa de Trabajo muestra un botón visible `Portal de Firmas` en la barra superior.
- [x] La Mesa de Trabajo incluye una pestaña `Portal de Firmas`.
- [x] Accesos mantiene el botón `Abrir Portal de Firmas`.
- [x] Las cuentas Firmante usan usuario interno; no requieren correo visible ni capturado.
- [x] Las actas pueden asignar una cuenta Firmante por nombre de usuario.
- [x] Los firmantes son redirigidos al Portal de Firmas al iniciar sesión.
- [x] Se conserva PIN de firma separado de la contraseña de acceso.
- [x] La firma se realiza sólo sobre actas cerradas.
- [x] Se conserva hash SHA-256, cadena de firma y verificación pública.

## Regresión general
- [x] No se modificó Agenda en esta versión.
- [x] Se preservaron Mesa de Trabajo, Participantes, Evaluación, Plan de Prima, Programas, Solicitudes, Dental, Indicadores, Accesos y Drive.
- [x] `firebase.json`, `firestore.rules` y `functions/` permanecen incluidos.
- [x] Paquete limpio: sin checklists históricos de versiones anteriores.

## Validación técnica
- [x] Estructura del ZIP revisada.
- [x] Rutas del Portal de Firmas verificadas en código fuente.
- [ ] `vite build` no pudo ejecutarse en este entorno porque `npm install` agotó el tiempo disponible; no se marca como aprobado.
