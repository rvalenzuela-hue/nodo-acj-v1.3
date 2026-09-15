# Checklist de regresión · NODO v0.8.44

- [x] URL real de la Aplicación web de Apps Script incorporada a NODO.
- [x] Evaluación de Necesidades: carga PDF usa Apps Script y carpeta `informes`.
- [x] Evaluación: conserva vínculo al PDF de Drive y bandera vigente/rectora.
- [x] Formularios públicos: archivos usan el mismo servicio de Drive y carpeta `solicitudes`.
- [x] Mesa de Trabajo: documentos/imágenes usan el mismo servicio de Drive y carpeta correspondiente.
- [x] Plan de Prima: expediente anual usa Apps Script y carpeta `plan_de_prima`.
- [x] Apps Script restringe destinos a las carpetas oficiales configuradas en NODO.
- [x] Apps Script valida tipo de archivo y límite de 15 MB; agrega JSON para expediente anual.
- [x] Se mantienen acciones existentes Editar, Eliminar e Imprimir y acciones masivas donde ya aplicaban.
- [x] Respuestas de formulario público de Evaluación siguen integradas al procesamiento.
- [x] Sin dependencia obligatoria de `VITE_DRIVE_UPLOAD_ENDPOINT` para estos flujos.
