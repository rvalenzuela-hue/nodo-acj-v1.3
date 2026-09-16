# Cloud Functions de NODO

Esta carpeta corresponde a `firebase.json -> functions.source`.

## Funciones incluidas
- `sendExpenseEmail`: atiende `/api/send-expense-email`, valida el token de Firebase Authentication y envía el aviso de solicitud de gasto mediante SMTP.
- `sendActaEmail`: atiende `/api/send-acta-email`, valida el token de Firebase Authentication y envía al participante remoto su enlace individual para revisar y registrar la conformidad del acta/minuta.

## Secretos requeridos
Configurar en Firebase/Google Cloud Secret Manager:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EXPENSE_EMAIL_TO` (sólo para solicitudes de gasto)

No guardar contraseñas SMTP dentro del repositorio.

## Despliegue
Después de instalar esta versión, desplegar Hosting y Functions para activar la ruta `/api/send-acta-email` y la función `sendActaEmail`.
