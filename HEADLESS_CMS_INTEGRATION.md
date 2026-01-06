# Guía de Integración con Headless CMS

Este proyecto está preparado para integrarse fácilmente con un Headless CMS. Actualmente usa datos estáticos, pero la arquitectura permite migrar a una API sin cambios mayores en los componentes.

## Arquitectura Actual

### Servicios

1. **DataService** (`src/app/services/data.ts`)
   - Contiene datos estáticos
   - Métodos que retornan `Observable` simulando llamadas a API
   - Fácil de reemplazar con llamadas HTTP reales

2. **ApiService** (`src/app/services/api.service.ts`)
   - Servicio preparado para llamadas HTTP reales
   - Incluye todos los endpoints necesarios
   - Listo para usar con cualquier Headless CMS

## Cómo Migrar a Headless CMS

### Paso 1: Configurar HttpClient

En `src/app/app.config.ts` (o `app.module.ts` si usas módulos):

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Agregar esto
    // ... otros providers
  ]
};
```

### Paso 2: Configurar Environment

Crear `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:1337/api' // Ejemplo para Strapi
};

export const environment = {
  production: true,
  apiUrl: 'https://api.cafedelvalle.com/api' // Producción
};
```

### Paso 3: Actualizar ApiService

En `src/app/services/api.service.ts`, actualizar la URL:

```typescript
import { environment } from '../../environments/environment';

private apiUrl = environment.apiUrl;
```

### Paso 4: Actualizar DataService

Reemplazar los métodos en `DataService` para usar `ApiService`:

```typescript
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private apiService: ApiService) {}

  // Reemplazar métodos estáticos con llamadas a API
  getCafeInfo(): Observable<CafeInfo> {
    return this.apiService.getCafeInfo();
  }

  getCoffeeVarieties(): Observable<CoffeeVariety[]> {
    return this.apiService.getCoffeeVarieties();
  }

  // ... etc
}
```

## Headless CMS Recomendados

### 1. Strapi
- **Ventajas**: Open source, fácil de usar, flexible
- **URL**: https://strapi.io
- **Ejemplo de endpoint**: `/api/cafe/info`

### 2. Contentful
- **Ventajas**: SaaS, muy popular, buena documentación
- **URL**: https://www.contentful.com
- **Ejemplo de endpoint**: `/spaces/{space_id}/entries`

### 3. Sanity
- **Ventajas**: Real-time, excelente para contenido colaborativo
- **URL**: https://www.sanity.io
- **Ejemplo de endpoint**: `/v1/data/query/production`

### 4. Directus
- **Ventajas**: Open source, auto-genera API REST y GraphQL
- **URL**: https://directus.io
- **Ejemplo de endpoint**: `/items/cafe_info`

### 5. WordPress (Headless)
- **Ventajas**: Familiar, muchos plugins
- **URL**: https://wordpress.org
- **Ejemplo de endpoint**: `/wp-json/wp/v2/posts`

## Estructura de Datos Esperada

### CafeInfo
```json
{
  "name": "Café del Valle",
  "tagline": "El sabor auténtico del café ecuatoriano",
  "description": "...",
  "address": "...",
  "phone": "+593 99 718 6022",
  "coordinates": {
    "lat": -1.0603766,
    "lng": -80.4545953
  },
  "hours": {
    "Lunes - Viernes": "7:00 AM - 8:00 PM"
  }
}
```

### CoffeeVariety
```json
{
  "id": "1",
  "name": "Café Typica",
  "region": "Loja",
  "description": "...",
  "flavorNotes": ["Dulce", "Cítrico"],
  "image": "https://..."
}
```

### BlogPost
```json
{
  "id": "1",
  "title": "El Café Ecuatoriano",
  "slug": "cafe-ecuatoriano",
  "excerpt": "...",
  "content": "<p>...</p>",
  "author": "Equipo Café del Valle",
  "publishedAt": "2024-12-20",
  "image": "https://...",
  "category": "Cultura del Café",
  "tags": ["Ecuador"],
  "featured": true
}
```

## Ejemplo de Migración Completa

### Antes (Datos Estáticos)
```typescript
getCafeInfo(): CafeInfo {
  return this.cafeInfo;
}
```

### Después (API)
```typescript
getCafeInfo(): Observable<CafeInfo> {
  return this.apiService.getCafeInfo();
}
```

### En el Componente
```typescript
// Antes
cafeInfo = this.dataService.getCafeInfo();

// Después
cafeInfo$ = this.dataService.getCafeInfo();
```

```html
<!-- En el template -->
{{ cafeInfo.name }}

<!-- Cambiar a -->
{{ (cafeInfo$ | async)?.name }}
```

## Endpoints Necesarios

Tu Headless CMS debe proveer estos endpoints:

- `GET /api/cafe/info` - Información del café
- `GET /api/cafe/varieties` - Lista de variedades
- `GET /api/cafe/varieties/:id` - Variedad específica
- `GET /api/reviews` - Lista de reseñas
- `POST /api/reviews` - Crear reseña
- `GET /api/gallery/images` - Imágenes de galería
- `GET /api/blog/posts` - Lista de posts (con query params)
- `GET /api/blog/posts/:slug` - Post por slug
- `GET /api/blog/posts/:id` - Post por ID

## Query Parameters para Blog

- `limit`: Número de posts a retornar
- `category`: Filtrar por categoría
- `featured`: Solo posts destacados (true/false)
- `sort`: Ordenamiento (ej: "publishedAt:desc")

## Testing

Para probar la integración sin un CMS real, puedes usar:

1. **JSON Server**: Simula una API REST
   ```bash
   npm install -g json-server
   json-server --watch db.json
   ```

2. **Mock Service Worker**: Intercepta requests HTTP
   ```bash
   npm install msw --save-dev
   ```

## Notas Importantes

- Todos los métodos en `DataService` ya retornan `Observable`
- Los componentes ya están preparados para usar `async` pipe
- El `ApiService` está listo pero no se usa actualmente
- Puedes migrar gradualmente, componente por componente
- Los datos estáticos funcionan como fallback durante la migración

## Soporte

Para más información sobre la integración, consulta la documentación de tu Headless CMS elegido.

