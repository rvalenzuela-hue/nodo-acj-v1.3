# Checklist de regresión · NODO v0.8.56

## Corrección Agenda
- [x] Cada registro manual de Agenda muestra Editar, Imprimir y Eliminar de forma visible.
- [x] Editar carga título, fecha, hora, motivo, tipo, prioridad y programa en el formulario.
- [x] Guardar cambios actualiza el registro existente y no crea un duplicado.
- [x] Cancelar edición limpia el formulario.
- [x] Eliminar solicita confirmación, borra en Firestore y muestra éxito o error.
- [x] Imprimir genera una ficha del registro de Agenda.
- [x] Marcar Hecha/Reabrir queda separado de Editar/Eliminar.
- [x] Fechas generadas desde Actividades se identifican y se indica que se editan desde su actividad de origen.

## Compatibilidad
- [x] Se conserva hora y motivo/descripción incorporados en v0.8.51.
- [x] Se conserva el guardado con manejo de errores de v0.8.54.
- [x] Firestore mantiene create/update/delete de agendaMesa para usuarios autenticados.
- [x] Validación sintáctica JSX realizada con TypeScript parser sin errores.
- [ ] Build Vite no ejecutado: el entorno no tiene node_modules/vite instalado.

## Regla permanente
Todo módulo/cajón que contenga registros debe exponer, cuando aplique, Editar, Eliminar e Imprimir de forma visible. No considerar una modificación terminada sólo porque el cambio puntual solicitado esté presente.
