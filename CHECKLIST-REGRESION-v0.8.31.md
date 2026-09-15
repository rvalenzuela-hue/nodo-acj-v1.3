# Checklist de regresión — v0.8.31
## Plan de Prima / Proyectos
- [x] Cada proyecto muestra botón `Clonar programa`.
- [x] Clonar abre una nueva captura con los datos del proyecto original.
- [x] El clon recibe nuevo proyectoId y nuevo programaId al guardarse.
- [x] No se copian beneficiarios.
- [x] No se copian participantes, solicitudes ni registros.
- [x] No se copia la ejecución/gasto anterior.
- [x] No se copian datos de cierre.
- [x] Se conservan descripción, resultados, actividades, responsable, presupuesto, fechas, lineamientos, criterios, indicadores y selección pública para revisión.
- [x] La nueva ejecución queda en estado Programado.
## Publicación automática
- [x] `Datos que se publicarán automáticamente` está conectado a Firestore `publicaciones`.
- [x] Los campos seleccionados se guardan en `datosPublicos`.
- [x] El proyecto se publica en la sección real `Programas y beneficios` del portal.
- [x] Al desmarcar todos los campos, la publicación se retira.
- [x] El portal sólo muestra los campos autorizados.
- [x] La publicación conserva proyectoId y año para trazabilidad.
## Regresión
- [x] Importación PDF/DOCX/XLSX de lineamientos conservada.
- [x] Histórico anual y auditoría conservados.
- [x] Control presupuestal conservado.
- [x] Cierre e informe final conservados.
- [x] Editar / Eliminar / Imprimir y acciones masivas conservadas.
- [x] Corrección Sucursal de Participantes conservada.
