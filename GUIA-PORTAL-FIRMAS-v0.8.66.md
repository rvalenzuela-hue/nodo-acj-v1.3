# Portal de Firmas v0.8.66

En Accesos se muestran de forma permanente los ocho firmantes iniciales y su estado real. Si faltan, NODO intenta crearlos automáticamente. Si las Functions aún no están desplegadas, utiliza una instancia secundaria de Firebase Authentication para crear cuentas nuevas sin cerrar la sesión administrativa y registra su perfil en `usuariosNodo`.

El botón de copiar enlace del Portal de Firmas ya no depende exclusivamente de la Clipboard API; incluye un método de respaldo para instalaciones locales/no HTTPS.
