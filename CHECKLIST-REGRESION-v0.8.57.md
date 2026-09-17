# Checklist de regresión · NODO v0.8.57

## Corrección Agenda
- [x] El panel “Agregar fecha o tarea” conserva su estado abierto mientras se captura información.
- [x] Crear un registro usa una operación de creación independiente de la edición.
- [x] Editar conserva el ID y actualiza el registro existente.
- [x] Al guardar se conservan título, fecha, hora, motivo, tipo, prioridad y programa.
- [x] El botón muestra “Guardando…” durante la operación y reporta error visible si Firestore falla.
- [x] Editar, Imprimir, Eliminar y Hecha/Reabrir permanecen visibles para registros manuales.
- [x] Las fechas derivadas de Actividades siguen identificadas como registros de origen y no se borran desde Agenda.
- [x] Las reglas de Firestore para agendaMesa siguen permitiendo lectura/escritura a usuarios autenticados.

## Regresión
- [x] No se modificaron módulos ajenos a Mesa de Trabajo.
- [x] Se comparó el guardado con v0.8.54 para restaurar la ruta de creación que funcionaba antes de incorporar edición.
- [x] Estructura ZIP verificada con prueba de integridad.
- [ ] Build Vite completo: no ejecutado porque npm install no terminó dentro del límite del entorno; no se marca como validado.
