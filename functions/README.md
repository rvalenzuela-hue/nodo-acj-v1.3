# Cloud Functions de NODO

Esta carpeta corresponde a `firebase.json -> functions.source`.

## Función incluida
`sendExpenseEmail` atiende `/api/send-expense-email`, valida el token de Firebase Authentication y envía el aviso de solicitud de gasto mediante SMTP.

## Secretos requeridos
Configurar en Firebase/Google Cloud Secret Manager:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EXPENSE_EMAIL_TO`

No guardar contraseñas SMTP dentro del repositorio.
