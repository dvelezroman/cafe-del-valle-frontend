# Imágenes de Variedades de Café

Esta carpeta contiene las imágenes de las diferentes variedades de café.

## Cómo agregar imágenes personalizadas

1. Descarga o prepara imágenes de cada variedad de café
2. Renombra las imágenes como:
   - `typica-lojana.jpg` - Para Café Typica de Loja
   - `bourbon-manabi.jpg` - Para Café Bourbon de Manabí
   - `caturra-pichincha.jpg` - Para Café Caturra de Pichincha
   - `especial-zamora.jpg` - Para Café Especial de Zamora Chinchipe
3. Colócalas en esta carpeta: `public/images/coffee/`
4. Actualiza las URLs en `src/app/services/data.ts` para usar rutas locales:
   - `/images/coffee/typica-lojana.jpg`
   - `/images/coffee/bourbon-manabi.jpg`
   - etc.

## Formatos soportados
- JPG/JPEG
- PNG
- WebP

## Tamaño recomendado
- Ancho: 800-1200px
- Relación de aspecto: 16:9 o 4:3
- Peso: máximo 300KB por imagen (optimizadas)

