NODO Asociación v0.8.56

Corrección: Agenda con Editar, Imprimir y Eliminar visibles, edición real del registro y manejo de errores.

# NODO — Asociación de Comercio Justo Campos Bórquez A.C.

Portal público y sistema de gestión de la Asociación de Comercio Justo Campos Bórquez A.C.

## Desarrollo

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
```

Los documentos institucionales y reglas de operación se encuentran en `public/documentos/`.

## v0.8.50 · Reuniones y actas híbridas
La Mesa de Trabajo incorpora gestión de minutas y actas para reuniones presenciales, remotas e híbridas. Registra asistentes individualmente, distingue participación física/Google Meet, controla firma autógrafa o conformidad electrónica, genera enlaces individuales de aceptación remota, conserva fecha/hora de conformidad y permite editar, imprimir, eliminar y cerrar el documento.

Para habilitar la aceptación remota deben desplegarse también las reglas de `firestore.rules` incluidas en esta versión.
