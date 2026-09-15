# Checklist de regresión · NODO v0.8.49 · Mesa de Trabajo

- [x] La Mesa de Trabajo es la vista interna inicial y no sustituye los módulos/cajones existentes.
- [x] Conserva Publicaciones, Participantes, Evaluación, Plan de Prima, Programas, Solicitudes/Becas, Dental, Indicadores, Accesos y Drive.
- [x] Agenda integra tareas manuales y cierres de actividades sin duplicar actividades.
- [x] Programas activos se calculan desde `programas`, `actividades` y `solicitudes` existentes.
- [x] Bandeja de trabajo lee solicitudes existentes y actualiza su mismo documento/estatus.
- [x] Las decisiones de solicitud quedan con fecha y usuario de actualización.
- [x] Cálculos de Tesorería se guardan vinculados a solicitud/programa/actividad en `tesoreriaSolicitudes`; no se describen como efectivo al participante.
- [x] Minutas/actas se guardan vinculadas al contexto en `minutasMesa`.
- [x] El asistente es contextual y no modifica registros automáticamente.
- [x] Navegación directa desde la Mesa a Programas, Solicitudes e Informes.
- [x] No se modificaron reglas de padrón, elegibilidad, Becas ni lógica de beneficiarios familiares.
- [x] No se eliminaron acciones Editar/Eliminar/Imprimir de los módulos existentes.
- [x] Revisión sintáctica JSX realizada sobre todos los archivos fuente.
