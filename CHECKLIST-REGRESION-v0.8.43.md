# Checklist de regresión v0.8.43

- [x] Conserva módulos y archivos de v0.8.42.
- [x] Evaluación: Registro individual, Excel, copiar/pegar y PDF siguen visibles.
- [x] Carga PDF ya no depende obligatoriamente de VITE_DRIVE_UPLOAD_ENDPOINT.
- [x] URL de Apps Script puede guardarse desde la interfaz y persiste en localStorage.
- [x] PDF se envía en Base64 al Web App y únicamente a la carpeta `informes` autorizada.
- [x] Apps Script valida carpeta, MIME, nombre y límite de 15 MB.
- [x] Documento original guarda fileId, URL y folderId en la evaluación.
- [x] Se añadió marca explícita de evaluación vigente/rectora y exclusividad al guardar.
- [x] Vigencia prioriza `vigente:true` y mantiene fallback histórico.
- [x] Respuestas del formulario público (`solicitudes`) se integran al procesamiento de la Evaluación.
- [x] Editar, eliminar, imprimir y acciones masivas funcionan también sobre respuestas de origen público.
- [x] No se asignan IDs de participante a familiares/beneficiarios por este cambio.
- [x] Apps Script y frontend mantienen restringidos los IDs de carpetas de NODO.
- [x] Sintaxis JSX/JS y Apps Script validada estáticamente.
