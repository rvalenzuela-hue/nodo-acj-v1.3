# Checklist de regresión · NODO v0.8.52

- [x] Se conserva la Agenda con hora y motivo/descripción.
- [x] Se conserva el módulo de actas/minutas híbridas.
- [x] El botón “Cerrar acta” ejecuta una operación visible con estado de procesamiento.
- [x] Los errores de Firestore se muestran al usuario en lugar de aparentar que el botón no responde.
- [x] El cierre del acta principal no queda bloqueado por un fallo secundario al sincronizar una evidencia remota.
- [x] Una vez cerrada, el formulario muestra “Acta cerrada” y evita nuevos guardados/cierres accidentales.
- [x] Imprimir permanece disponible después del cierre.
- [x] Las reglas existentes de minutasMesa y actaFirmas se mantienen.
- [ ] Build de Vite no ejecutado: node_modules no está incluido en el paquete de trabajo.
