# Checklist de regresión · NODO v0.8.51

## Cambio solicitado
- Agenda de Mesa de Trabajo: hora obligatoria para nuevas fechas/tareas.
- Campo libre Motivo / descripción.
- Hora visible en tarjetas de agenda y prioridades del asistente.
- Motivo visible en la tarjeta de agenda.
- Orden de agenda por fecha + hora.
- Compatibilidad con registros anteriores sin hora/motivo.

## Verificaciones de código
- [x] El estado del formulario incluye `hora` y `motivo`.
- [x] La validación exige título, fecha y hora.
- [x] Los nuevos campos se persisten en `agendaMesa`.
- [x] El formulario se limpia correctamente al guardar.
- [x] Registros antiguos siguen mostrándose; `notas` se usa como respaldo visual.
- [x] Los cierres automáticos de actividades no requieren hora.
- [x] La agenda ordena por fecha y hora cuando existe.
- [x] El asistente muestra la hora de los pendientes.

## Compilación
- [ ] `npm run build` no pudo ejecutarse en este entorno porque la instalación de dependencias excedió el límite disponible. No se marca como validada.
