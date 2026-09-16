# Checklist de regresión · NODO v0.8.55

## Corrección solicitada
- [x] Actividades anidadas dentro de cada Programa muestran Abrir / Editar, Imprimir y Eliminar.
- [x] Eliminar actividad muestra progreso, confirmación y error visible si Firestore rechaza la operación.
- [x] Al eliminar el registro que se estaba editando, se limpia el formulario para evitar referencias huérfanas.
- [x] Selección masiva mantiene Borrar seleccionados e Imprimir seleccionados.

## Regresión del módulo Programas y actividades
- [x] Programas conservan Nueva actividad, Editar, Imprimir y Eliminar.
- [x] Pestaña Actividades conserva Abrir / Editar, Imprimir, Replicar cuando corresponde y Eliminar.
- [x] Artefactos conservan Editar, Imprimir y Eliminar.
- [x] Participantes y solicitudes dentro de una actividad conservan sus acciones existentes.
- [x] No se agregaron datos de prueba ni semillas automáticas.

## Nota de permisos
La eliminación sigue respetando las reglas de seguridad de Firestore. Si el usuario no tiene permisos, NODO ahora muestra el error en pantalla en vez de aparentar que el botón no funciona.
