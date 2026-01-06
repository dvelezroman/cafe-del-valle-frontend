# Imágenes de Google Maps

Este documento explica cómo se obtuvieron y utilizan las imágenes de Google Maps para el sitio.

## Imágenes Actuales

Las imágenes utilizadas en el sitio provienen directamente de Google Maps/Google Photos del Café del Valle. Estas URLs fueron extraídas de las solicitudes de red cuando se accede a la página de Google Maps del negocio.

### URLs de Imágenes Utilizadas

#### Galería
- Todas las imágenes de la galería provienen de Google Photos del lugar
- URLs con formato: `https://lh3.googleusercontent.com/gps-cs-s/...`
- Parámetros de tamaño: `w1200-h800-p-k-no` para alta calidad

#### Reseñas
- Las fotos de las reseñas provienen de las fotos subidas por usuarios en Google Maps
- Mismo formato de URLs de Google Photos

#### Menú
- Las imágenes del menú también provienen de Google Maps
- Si hay un menú fotografiado en Google Maps, esas imágenes se utilizan

## Cómo Obtener Más Imágenes

### Método 1: Desde Google Maps (Recomendado)
1. Visita: https://www.google.com/maps/place/Café+del+Valle
2. Haz clic en "Fotos" o "Photos"
3. Abre las herramientas de desarrollador (F12)
4. Ve a la pestaña "Network"
5. Filtra por "image" o busca URLs que contengan "lh3.googleusercontent.com"
6. Copia las URLs completas de las imágenes
7. Actualiza los parámetros de tamaño si es necesario:
   - `w1200-h800` para imágenes grandes
   - `w800-h600` para imágenes medianas
   - `w400-h300` para thumbnails

### Método 2: Descargar y Subir Localmente
1. Descarga las imágenes desde Google Maps
2. Optimiza las imágenes (comprime y redimensiona)
3. Colócalas en `public/images/gallery/` o `public/images/menu/`
4. Actualiza las URLs en `src/app/services/data.ts` para usar rutas locales

## Parámetros de URLs de Google Photos

Las URLs de Google Photos soportan parámetros para controlar el tamaño:
- `w=1200` - Ancho en píxeles
- `h=800` - Alto en píxeles
- `p` - Mantener proporción
- `k-no` - Sin recorte

Ejemplo:
```
https://lh3.googleusercontent.com/...=w1200-h800-p-k-no
```

## Nota sobre CORS

Las URLs de Google Photos pueden tener restricciones CORS. Si las imágenes no se cargan:
1. Verifica que las URLs sean correctas
2. Considera descargar las imágenes y servirlas localmente
3. O usa un servicio proxy/CDN para las imágenes

## Videos

Si hay videos en Google Maps:
1. Busca URLs que contengan "video" o "youtube" en las solicitudes de red
2. O usa el ID de YouTube si está disponible
3. Integra usando iframes o la API de YouTube

## Menú Fotografiado

Si el negocio tiene un menú fotografiado en Google Maps:
1. Busca en la sección "Menu" de Google Maps
2. Extrae las URLs de las imágenes del menú
3. Actualiza los items del menú en `src/app/services/data.ts` con esas URLs

