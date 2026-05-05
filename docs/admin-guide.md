# Guía de administración (Café del Valle)

Panel web para el personal autorizado. En el código del frontend, el acceso está protegido para usuarios con rol **`ADMIN`**.

## Acceso

- **URL de login:** `/admin/login`
- **Panel:** todas las herramientas viven bajo **`/admin/dashboard/...`**
- Tras iniciar sesión, el layout muestra **barra lateral**, **cabecera** (“Panel de Administración”), nombre del usuario y **cerrar sesión**
- Enlace **“Ver sitio web”** en la barra lateral abre el sitio público en otra pestaña

---

## Mapa del menú lateral

| Ruta interna | Nombre en menú | Función resumida |
|--------------|----------------|------------------|
| `.../info` | Información general | Datos del café (contacto, horarios, textos multilingües, ubicación en mapa). |
| `.../menu` | Gestión del menú | CRUD de ítems del menú visible en el sitio. |
| `.../branches` | Sucursales | Gestión de sucursales (ubicación, datos asociados). |
| `.../blog` | Blog / noticias | Administración de entradas del blog público. |
| `.../partners` | Solicitudes socios | Cola de socios pendientes y socios aprobados; aprobación/rechazo, planes, puntos, etc. |
| `.../club` | Gestión del club | Promociones canjeables por puntos (multilingüe), imagen, costo en puntos; configuración de **puntos por referido**. |
| `.../subscriptions` | Planes de suscripción | Definición de planes (precios, periodicidad, beneficios, activos). |
| `.../membership-queue` | Solicitudes de socio | Cola de **intereses de membresía** y socios pendientes de alta; estados; conversión a socio con plan y contraseña; aprobaciones. |
| `.../qr-generator` | Generar QR codes | Generación masiva de códigos (cantidad y prefijo), estadísticas, listado, descarga en PDF. |
| `.../codes` | Gestión de códigos | Listado y filtros (disponible, asignado, revocado); búsqueda; acciones sobre códigos. |
| `.../subscribers` | Suscriptores activos | Lista de suscriptores; creación/asignación de códigos; cambio de plan; datos de cupos y perfil. |
| `.../register-points` | Puntos por compra | Acreditación manual de puntos por **número de cédula** (producto, notas); resultado indica si impactó en perfil de socio o cuenta pública. |
| `.../redemption` | Canje rápido | Buscar suscriptor por **código**, ver cupo y estado, registrar **canje de café** desde barra caja. |
| `.../subscriber-history` | Historial suscriptores | Historial de uso / canjes ligados a suscriptores. |
| `.../partner-history` | Historial socios | Historial de actividad del lado de socios (canjes u eventos según integración). |
| `.../google-maps-reviews` | Reseñas Google Maps | Configuración (p. ej. `placeId`), sincronización de reseñas, estadísticas de última sync. |
| `.../users` | Usuarios | Alta/edición de usuarios del sistema (correo, nombre, rol `ADMIN` / `EDITOR` / `PARTNER`, activo, contraseña). |

> La ruta antigua `.../leads` redirige a `.../membership-queue`.

---

## Detalle por módulo

### Información general (`info`)

- Editar nombre, teléfono, correo, dirección, coordenadas (con selector de mapa según UI).
- Textos **tagline** y **descripción** por idioma (es / en / fr).
- **Horarios** de atención (estructura editable).

### Gestión del menú (`menu`)

- Crear, editar y organizar ítems del menú (precios, categorías, visibilidad según el modelo de datos).

### Sucursales (`branches`)

- Administrar sucursales que pueden aparecer en el selector público y en lógica de menú por sucursal.

### Blog / noticias (`blog`)

- Publicar y mantener artículos del blog visible en la home.

### Solicitudes socios (`partners`)

- Ver socios **pendientes** y **aprobados**.
- **Aprobar** o **rechazar** solicitudes; al aprobar suele exigirse un **plan de suscripción**.
- Gestionar datos del socio, puntos manuales, asignación de suscripción/códigos según modales disponibles.
- Consumo o historial asociado al socio cuando la UI lo expone.

### Gestión del club (`club`)

- **Puntos por referido:** valor global (por defecto del sistema, p. ej. 50 puntos).
- **Promociones:** recompensas canjeables con puntos (nombre y descripción por idioma, imagen, puntos de costo, activar/desactivar).

### Planes de suscripción (`subscriptions`)

- CRUD de planes: título y descripción multilingües, precio, periodicidad (mensual, anual, personalizada), lista de beneficios por idioma, flag activo.

### Solicitudes de socio (`membership-queue`)

- Cola unificada de **aplicaciones de membresía** e intereses.
- **Estados** típicos: pendiente, contactado, pago pendiente, rechazado, convertido (según flujo).
- Actualizar estado y notas.
- **Convertir** solicitud en socio: asignar **plan**, definir **contraseña** inicial (mínimo 8 caracteres), creando usuario/suscripción.
- Flujo de **aprobación de socios pendientes** emparejado con planes.

### Generar QR codes (`qr-generator`)

- Parámetros: **cantidad** (1–500) y **prefijo** del código.
- Ver estadísticas: total, disponibles, asignados, revocados.
- Listado de códigos generados y **descarga PDF** para impresión o distribución.

### Gestión de códigos (`codes`)

- Vista filtrable y búsqueda por código, nombre o correo del asignado.
- Estados: **generado** (disponible), **asignado**, **revocado**.
- Acciones masivas o individuales según la plantilla (revocar, etc.).

### Suscriptores activos (`subscribers`)

- Listado con búsqueda y filtro por estado.
- **Crear** suscriptor o **asignar código** libre a un suscriptor existente.
- **Cambiar plan** de un suscriptor.
- Visualización de **cupo** restante/usado, código asociado y vínculo con perfil de socio si existe.

### Puntos por compra (`register-points`)

- Formulario: **cédula**, **puntos** otorgados, nombre opcional del producto, notas.
- Útil para registrar compras en tienda que suman puntos de lealtad.

### Canje rápido (`redemption`)

- Introducir **código de suscriptor**.
- Validación: suscriptor **activo** y **cupo** disponible.
- Acción **canjear café:** registra un uso (tipo café, cantidad 1) con nota “Canje rápido”.
- Tras éxito, refresca la búsqueda para ver cupo actualizado.

### Historial suscriptores / Historial socios (`subscriber-history`, `partner-history`)

- Consulta de movimientos históricos para auditoría (canjes, registros asociados a suscriptores o socios).

### Reseñas Google Maps (`google-maps-reviews`)

- Configurar **Place ID** y comprobar si hay API key en servidor.
- **Sincronizar** reseñas desde Google.
- Ver listado de reseñas y fecha de última sincronización.

### Usuarios (`users`)

- Crear usuarios con rol **ADMIN**, **EDITOR** o **PARTNER**, contraseña y estado activo/inactivo.
- Editar datos y contraseña.
- **Importante:** el frontend solo permite entrar al **dashboard admin** con rol **ADMIN**; los roles **EDITOR** y **PARTNER** en esta tabla cumplen funciones según el backend (por ejemplo PARTNER para portal de socios con otro flujo de login).

---

## Atajos y UX del panel

- **Menú hamburguesa** en cabecera para mostrar/ocultar la barra lateral en pantallas pequeñas.
- Cierre de sidebar al elegir un ítem o al redimensionar ventana (comportamiento responsive documentado en componente sidebar).

---

## Relación con el sitio público

Los cambios en **información general**, **menú**, **sucursales**, **blog**, **planes** y **club** impactan directamente lo que ven los visitantes y socios. Las consultas públicas y el portal de socios consumen los mismos datos maestros gestionados aquí.

Para una vista orientada al cliente final, ver la [guía para usuarios y socios](user-guide.md).
