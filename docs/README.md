# Café del Valle — Documentación de la plataforma

Documentación funcional del sitio web y las herramientas conectadas al **frontend** de Café del Valle (Angular). Está orientada a **visitantes y socios del club** y a **administradores** del negocio.

## Contenido

| Documento | Audiencia | Descripción |
|-----------|-----------|-------------|
| [Guía para usuarios y socios](user-guide.md) | Público y socios (portal club) | Sitio web, club, consultas sin inicio de sesión, portal `/partner` |
| [Guía de administración](admin-guide.md) | Administradores | Panel en `/admin/dashboard` (rol `ADMIN`) |

## Accesos principales (rutas)

| Ruta | Uso |
|------|-----|
| `/` | Página principal del café (contenido público) |
| `/solicitud-socio` | Planes de suscripción e interés de socio (también accesible como `/club/join`) |
| `/consulta-socio` | Consulta pública de membresía por cédula |
| `/consulta-puntos` | Consulta pública de puntos de fidelidad por cédula |
| `/mi-suscripcion` | Consulta pública de suscriptor por código de socio |
| `/admin/login` | Inicio de sesión del personal (admin) |
| `/admin/dashboard/...` | Panel de administración (subrutas: ver guía admin) |
| `/partner/...` | Portal del socio aprobado (rol `PARTNER`, requiere login) |

## Roles de usuario (aplicación)

- **Visitante:** sin cuenta; usa el sitio y las consultas públicas.
- **Socio aprobado:** inicia sesión en el **portal del club** (`/partner`) con credenciales asignadas al aprobar o activar su membresía.
- **Administrador:** accede al panel con una cuenta cuyo rol es `ADMIN` (ver [guía de administración](admin-guide.md)).

> **Nota:** En la gestión de usuarios del panel existen los roles `ADMIN`, `EDITOR` y `PARTNER`. El acceso al **panel de administración** está restringido en el frontend a usuarios con rol `ADMIN`. Los roles `EDITOR` o `PARTNER` en la tabla de usuarios corresponden a la definición en backend; el portal de socios usa el flujo de autenticación de socios, no el de admin.

## Idioma

El sitio público ofrece **español, inglés y francés** (selector en la cabecera). El panel de administración y el portal de socios están principalmente en **español** en la interfaz actual.

---

*Documentación generada a partir de la estructura de rutas y componentes del frontend del proyecto.*
