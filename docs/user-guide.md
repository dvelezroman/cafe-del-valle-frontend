# Guía para usuarios y socios (Café del Valle)

Esta guía describe lo que puede hacer **cualquier visitante** en el sitio web y lo que puede hacer un **socio** con acceso al portal del club.

---

## 1. Sitio web público (página de inicio, `/`)

La página principal es una **single page** con secciones enlazadas desde el menú. Incluye:

### Navegación y preferencias

- **Menú principal:** accesos a secciones *Nosotros*, *Café*, *Carta / menú*, *Blog*, *Contacto* (anclas en la misma página).
- **Zona del club:** enlaces a solicitud de socio, consulta de socio, consulta de puntos y plan/código de suscripción.
- **Selector de sucursal:** si hay sucursales configuradas, se puede elegir una para alinear menú o datos asociados a la sucursal (comportamiento del sitio).
- **Idioma:** botones **ES / EN / FR** para cambiar el idioma de la interfaz y de textos traducidos.

### Secciones de contenido

| Sección (aprox.) | Qué ofrece |
|------------------|------------|
| **Hero** | Cabecera visual de bienvenida. |
| **Nosotros (About)** | Historia o presentación del negocio. |
| **Café (Coffee)** | Contenido sobre el producto o experiencia. |
| **Carta / menú** | Muestra el menú publicado (productos y precios según backend y sucursal). |
| **Galería** | Imágenes del local o productos. |
| **Reseñas** | Reseñas presentadas en el sitio. |
| **Reseñas Google Maps** | Bloque de reseñas sincronizadas o mostradas desde la integración con Google. |
| **Blog / noticias** | Artículos o entradas configuradas para el sitio. |
| **Planes de suscripción (incrustado)** | Vista de planes activos y llamada a la acción para solicitar ser socio (misma experiencia que la página dedicada, ver más abajo). |
| **Contacto** | Datos y/o formulario para comunicarse con el café. |

### Pie de página

- Enlaces rápidos a secciones y al club.
- Datos de contacto (dirección, teléfono).
- Formulario de **newsletter** (interfaz presente en la página; el envío efectivo depende de la implementación conectada al backend).
- Enlace discreto a **Acceso administrativo** (`/admin/login`).
- Créditos / enlaces legales según el diseño actual.

---

## 2. Solicitud de socio y planes (`/solicitud-socio`)

También conocida por la redirección **`/club/join`**.

### Funciones

- Lista los **planes de suscripción** públicos (precios, periodicidad, características).
- Los textos de título, descripción y beneficios pueden variar según el **idioma** seleccionado en el sitio.
- El usuario puede **expresar interés** en un plan:
  - Abre un formulario (modal) con datos típicos: nombre, correo, teléfono, identificación, notas.
  - Al enviar, se registra una **solicitud de interés** para que el equipo la gestione en el panel de administración.

---

## 3. Consultas públicas (sin cuenta)

No requieren inicio de sesión. Sirven para consultar información asociada a la identificación o al código de socio.

### Consulta de socio (`/consulta-socio`)

- **Entrada:** número de identificación (cédula).
- **Resultado:** información de membresía según la política del sistema (por ejemplo estado del socio o datos permitidos en consulta pública).

### Consulta de puntos (`/consulta-puntos`)

- **Entrada:** número de identificación.
- **Resultado:** información de **puntos de fidelidad** u oferta ligada al perfil (según respuesta del servidor).

### Mi suscripción / código (`/mi-suscripcion`)

- **Entrada:** **código de socio** (el código asignado al suscriptor).
- **Resultado:** estado de la suscripción (por ejemplo activa, pendiente, vencida, etc., según etiquetas del sistema).

> Las consultas públicas pueden estar sujetas a límites de uso o validaciones en el servidor para proteger datos personales.

---

## 4. Portal del socio (`/partner`)

Dirigido a personas con rol **PARTNER** que hayan recibido usuario y contraseña (por ejemplo al **aprobar** una solicitud de socio y activar la suscripción).

### Acceso

- **Inicio de sesión:** el mismo formulario de **`/admin/login`** (correo y contraseña) que usan las cuentas de sistema. Tras un login correcto, la app redirige por defecto a `/admin/dashboard`; **esa ruta solo acepta rol `ADMIN`**. Si tu cuenta es de **socio (`PARTNER`)**, abre manualmente **`/partner`** o **`/partner/dashboard`** para entrar al portal.
- **URL del portal:** base **`/partner`**. Si no hay sesión válida de socio, al visitar `/partner` el guard del frontend redirige a `/admin/login`.
- Las credenciales de socio las asigna el equipo al aprobar o activar la membresía.

### Áreas del portal

| Ruta | Nombre en interfaz | Descripción |
|------|-------------------|-------------|
| `/partner/dashboard` | **Inicio** | Resumen del perfil de socio: estado de aprobación, nivel o tier de lealtad según puntos (cuando aplica), código de **referidos** con opción de copiar al portapapeles. |
| `/partner/history` | **Mi actividad** | Historial de actividad del socio según datos cargados en el perfil (canjes, puntos u otros eventos expuestos por el backend). |

### Navegación común

- Enlace para volver al **sitio web público**.
- **Cerrar sesión** para salir del portal.

---

## 5. Resumen rápido para socios

| Necesidad | Dónde ir |
|-----------|----------|
| Ver cartelera del café, menú, blog | Página de inicio `/` |
| Pedir ser socio o ver planes | `/solicitud-socio` |
| Saber si soy socio o estado con mi cédula | `/consulta-socio` |
| Ver mis puntos con mi cédula | `/consulta-puntos` |
| Ver mi plan con mi código de socio | `/mi-suscripcion` |
| Entrar como socio aprobado | `/partner` (tras login) |

Para la gestión interna del negocio (planes, cola de solicitudes, canjes en barra, etc.), ver la [guía de administración](admin-guide.md).
