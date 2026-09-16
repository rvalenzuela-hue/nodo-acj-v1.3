# Checklist de regresión · NODO v0.8.53

## Actas híbridas · correo de conformidad
- [x] Se conserva captura de asistentes presencial / Google Meet.
- [x] El correo del participante remoto ahora tiene una acción real: `Enviar solicitud por correo`.
- [x] El envío usa Cloud Function autenticada con Firebase; no abre `mailto:` ni depende del cliente de correo del usuario.
- [x] El correo incluye nombre, tipo/título del acta, fecha/hora y enlace individual de conformidad.
- [x] Se registra `emailEnviadoEn` por participante y se muestra fecha/hora de envío.
- [x] Se mantiene `Copiar enlace` como alternativa manual.
- [x] Se incorpora `Enviar a todos los pendientes` para varios asistentes remotos.
- [x] No se envían solicitudes a participantes sin correo o ya conformes.
- [x] Se conserva cierre de acta corregido de v0.8.52.
- [x] Se conserva Agenda con hora y motivo/descripción de v0.8.51.

## Infraestructura
- [x] Nueva ruta Hosting `/api/send-acta-email` -> `sendActaEmail`.
- [x] Cloud Function exige token Firebase válido.
- [x] Reutiliza secretos SMTP existentes de NODO; no incorpora credenciales en código.
- [x] `functions/index.js` pasa `node --check`.
- [x] `firebase.json` es JSON válido.
- [ ] Requiere desplegar Firebase Functions + Hosting para activar la nueva ruta en producción.
