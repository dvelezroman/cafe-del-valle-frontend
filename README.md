# Café del Valle - Landing Page

Una landing page profesional y moderna para Café del Valle, especialistas en café de origen ecuatoriano.

## 🚀 Características

- **Diseño Moderno**: Interfaz atractiva con paleta de colores inspirada en el café
- **Totalmente Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Secciones Incluidas**:
  - Hero section con llamada a la acción
  - Sobre Nosotros
  - Nuestros Cafés (variedades ecuatorianas)
  - Galería de imágenes
  - Reseñas de clientes
  - Información de contacto y mapa

## 🛠️ Tecnologías

- **Angular 21** (última versión)
- **TypeScript**
- **SCSS** para estilos
- **Diseño Responsive** con CSS Grid y Flexbox

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build
```

El servidor de desarrollo estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero/          # Sección principal
│   │   ├── about/         # Sobre nosotros
│   │   ├── coffee/        # Variedades de café
│   │   ├── gallery/       # Galería de imágenes
│   │   ├── reviews/       # Reseñas de clientes
│   │   └── contact/       # Información de contacto
│   ├── services/
│   │   └── data.ts        # Servicio de datos (preparado para API/CMS)
│   ├── app.ts            # Componente principal
│   └── app.html          # Template principal
└── styles.scss           # Estilos globales
```

## 🎨 Paleta de Colores

- **Coffee Dark**: `#3d2817`
- **Coffee Medium**: `#6b4423`
- **Coffee Light**: `#8b6f47`
- **Coffee Cream**: `#d4a574`
- **Coffee Latte**: `#f4e4c1`
- **Accent Gold**: `#d4af37`

## 📝 Datos Estáticos

Actualmente, la aplicación utiliza datos estáticos en el servicio `DataService`. La estructura está preparada para integrarse fácilmente con:

- **API REST**
- **Headless CMS** (Contentful, Strapi, etc.)
- **GraphQL API**

Para integrar una API, simplemente modifica el método `getCafeInfo()`, `getCoffeeVarieties()`, etc. en `src/app/services/data.ts` para hacer llamadas HTTP.

## 📍 Información del Café

- **Nombre**: Café del Valle
- **Dirección**: Atanacio Santos y Calle Augusto Moreira, Ciudadela San Cristóbal, Portoviejo, Ecuador
- **Teléfono**: +593 99 718 6022

## 🔮 Futuras Mejoras

- Integración con API o Headless CMS
- Formulario de contacto funcional
- Sistema de reservas
- Blog de café
- Tienda online

## 📄 Licencia

Este proyecto es privado y pertenece a Café del Valle.
