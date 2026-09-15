# Checklist de regresión · NODO v0.8.46

## Cambio principal
- [x] Evaluación de Necesidades inicia con dos flujos separados: **Registrar evaluación existente** / **Crear nueva evaluación en NODO**.
- [x] El flujo de documento externo no muestra el constructor de preguntas.
- [x] El registro externo solicita metadatos, permite marcar vigente/rectora y exige seleccionar PDF antes de guardar.
- [x] El PDF se envía al servicio Apps Script ya configurado y a la carpeta `informes` autorizada.
- [x] Se conserva trazabilidad: origen externo, archivo original, Drive file ID, URL, fecha y usuario de incorporación.
- [x] Si se marca vigente, se desmarca la evaluación vigente anterior.
- [x] El flujo de nueva evaluación conserva constructor de preguntas, encuestas, análisis, hallazgos e informe.
- [x] Abrir una evaluación histórica recupera el flujo correcto según su origen.

## Integración / regresión
- [x] No se modificaron módulos ajenos a Evaluación de Necesidades.
- [x] Se conserva integración de respuestas de formulario público.
- [x] Se conservan acciones del histórico: Editar/abrir, Eliminar, Imprimir y acciones masivas.
- [x] Se conserva importación Excel/copy-paste para evaluaciones creadas/gestionadas en NODO.
- [x] Se conserva la URL de Apps Script configurada en `src/config/driveUpload.js`.
- [x] Transpilación estática JS/JSX: sin diagnósticos.
- [x] `apps-script/Code.gs`: validación sintáctica básica incluida en el paquete.

## Pendiente de prueba en entorno publicado
- [ ] Subida real del PDF desde el navegador publicado a Apps Script/Drive.
- [ ] Confirmar permisos de la implementación Apps Script sobre la carpeta Informes.
- [ ] Confirmar persistencia Firestore tras recargar.
