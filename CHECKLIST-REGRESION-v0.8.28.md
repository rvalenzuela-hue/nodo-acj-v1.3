# Checklist de regresión — v0.8.28

## Cajón 1 — Participantes de la Prima
- [x] Se conserva Entrada y Salida.
- [x] Copiar/pegar usa Sucursal y no Centro/Área.
- [x] Sucursal mantiene Bácum/Caborca.
- [x] Sólo colaborador/trabajador es identidad del padrón.
- [x] Expedientes y acciones existentes se conservan.

## Cajón 2 — Plan de Prima de Comercio Justo
### Archivo 1 — Plan de Prima
- [x] Subcajón Captura con aprobación AG, periodo, prima disponible, saldo anterior, USD, tipo de cambio, conversión y total disponible.
- [x] Tabla de proyectos con descripción, resultados, actividades, responsable, presupuesto, plazo e indicadores.
- [x] Indicadores automáticos y editables.
- [x] Subcajón Salida/visualización con tabla organizada.
- [x] Selección de datos públicos por proyecto y sincronización a Publicaciones.
- [x] Control presupuestal enlazado a gastos aprobados/pagados.

### Archivo 2 — Proyectos y ejecución
- [x] Proyectos registrados en el Plan aparecen con presupuesto y fechas.
- [x] Capturar, modificar, eliminar e imprimir.
- [x] Acciones masivas: editar, eliminar e imprimir.
- [x] Importar lineamientos TXT/CSV/XLS/XLSX.
- [x] Conversión de lineamientos a criterios editables.
- [x] Sincronización del proyecto con Programas.
- [x] Gasto ejecutado tomado de Solicitudes/Compras y gastos mediante vínculo planPrimaProyectoId/programaId.
- [x] Lista de beneficiarios consolidada desde actividades y solicitudes/formularios.
- [x] Beneficio recibido visible.
- [x] Botón Cerrar proyecto y generar informe.

### Archivo 3 — Cierre e informe de evaluación final
- [x] Informe generado al cerrar proyecto.
- [x] Ficha técnica.
- [x] Resumen ejecutivo.
- [x] Cumplimiento de objetivos/metas.
- [x] Análisis de metas, costos y eficiencia.
- [x] Beneficiarios y costo por persona.
- [x] IEP.
- [x] Desviaciones/ajustes/dificultades.
- [x] Impacto.
- [x] Sostenibilidad/mantenimiento.
- [x] Conclusiones.
- [x] Recomendaciones/lecciones aprendidas.
- [x] Declaratoria de cierre y firmas.
- [x] Editar evaluación, eliminar e imprimir informe completo.

## Integración y técnica
- [x] Reglas Firestore para planPrima, planPrimaProyectos e informesProyecto.
- [x] Gastos permite seleccionar Proyecto del Plan de Prima.
- [x] TypeScript parse/check de src completo: sin errores.
- [ ] Build Vite completo: dependencias no disponibles localmente; ZIP se entrega sin node_modules.
