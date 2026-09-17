# Checklist de regresión · NODO v0.8.58

## Agenda
- [x] Crear registro exige sólo tarea y fecha.
- [x] Hora visible pero opcional; dejarla vacía no bloquea Guardar.
- [x] Motivo/descripción libre permanece disponible.
- [x] Mensajes de validación, éxito y error visibles dentro de la tarjeta Agenda.
- [x] Editar, Imprimir, Eliminar y Hecha/Reabrir permanecen visibles.
- [x] Edición carga los datos existentes y actualiza el mismo registro.
- [x] Registros sin hora siguen ordenándose después de los que sí tienen hora el mismo día.

## No regresión
- [x] No se alteraron Actas híbridas, correo de conformidad, Programas, Solicitudes ni Padrón.
- [x] Reglas de Firestore para agendaMesa permanecen con acceso de usuario autenticado.
