import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface CoffeeVariety {
  id: string;
  name: string;
  region: string;
  description: string;
  flavorNotes: string[];
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  authorImage?: string;
  photoUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  hours?: {
    [key: string]: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'bebidas' | 'comidas' | 'postres' | 'especiales';
  image?: string;
  available?: boolean;
  featured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cafeInfo: CafeInfo = {
    name: 'Café del Valle',
    tagline: 'El sabor auténtico del café ecuatoriano',
    description: 'Somos especialistas en café de origen ecuatoriano, seleccionando los mejores granos de diversas regiones del país. Nuestro compromiso es ofrecerte una experiencia única con cada taza, resaltando los sabores y aromas característicos del café ecuatoriano.',
    address: 'Atanacio Santos y Calle Augusto Moreira, Portoviejo, Ecuador',
    phone: '+593 99 718 6022',
    coordinates: {
      lat: -1.0407893,
      lng: -80.4679643
    },
    hours: {
      'Lunes - Sábado': '9:00 AM - 11:00 PM',
      'Domingo': '4:00 PM - 9:00 PM'
    }
  };

  private coffeeVarieties: CoffeeVariety[] = [
    {
      id: '1',
      name: 'Café Typica',
      region: 'Loja',
      description: 'Variedad clásica ecuatoriana con un sabor suave y equilibrado. Cultivado en las alturas de Loja, este café ofrece notas dulces y un cuerpo medio. La Typica es una de las variedades más antiguas y tradicionales del mundo, conocida por su alta calidad en taza y granos alargados característicos.',
      flavorNotes: ['Dulce', 'Cítrico', 'Equilibrado'],
      // Imagen: Granos de café Typica - variedad tradicional ecuatoriana
      // Para usar imagen local, coloca en /images/coffee/typica-lojana.jpg y cambia la URL
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80'
    },
    {
      id: '2',
      name: 'Café Bourbon',
      region: 'Manabí',
      description: 'Originario de Manabí, este café se caracteriza por su sabor intenso y aromático. Perfecto para los amantes del café con cuerpo completo. La variedad Bourbon es apreciada por su dulzura natural y notas afrutadas características, originaria de la isla de Reunión. En Ecuador, se cultiva principalmente en las provincias costeras como Manabí.',
      flavorNotes: ['Intenso', 'Aromático', 'Cuerpo completo'],
      // Imagen: Granos de café Bourbon - conocido por su dulzura y notas afrutadas
      // Para usar imagen local, coloca en /images/coffee/bourbon-manabi.jpg y cambia la URL
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=600&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Café Caturra',
      region: 'Pichincha',
      description: 'Cultivado en las montañas de Pichincha, este café ofrece un perfil de sabor complejo con notas frutales y un acabado limpio. Caturra es una mutación natural de Bourbon, destacada por su alta productividad y excelente perfil de sabor, ideal para las condiciones de altura de Pichincha. Esta variedad es muy popular en Ecuador por su adaptabilidad y calidad.',
      flavorNotes: ['Frutal', 'Acidez brillante', 'Acabado limpio'],
      // Imagen: Café Caturra - mutación de Bourbon, muy cultivada en Ecuador
      // Para usar imagen local, coloca en /images/coffee/caturra-pichincha.jpg y cambia la URL
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80'
    },
    {
      id: '4',
      name: 'Café Especial',
      region: 'Zamora Chinchipe',
      description: 'Nuestro café especial de Zamora Chinchipe, una región reconocida por producir algunos de los mejores cafés del país. Sabor excepcional con notas de chocolate y caramelo. Esta región produce cafés de altura con características únicas, cultivados en condiciones ideales para desarrollar sabores complejos y excepcionales. Zamora Chinchipe es una de las regiones cafetaleras más prestigiosas de Ecuador.',
      flavorNotes: ['Chocolate', 'Caramelo', 'Excepcional'],
      // Imagen: Café especial de altura - Zamora Chinchipe, región premium
      // Para usar imagen local, coloca en /images/coffee/especial-zamora.jpg y cambia la URL
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'
    }
  ];

  private reviews: Review[] = [
    {
      id: '1',
      author: 'María González',
      rating: 5,
      comment: 'El mejor café que he probado en Portoviejo. El ambiente es acogedor y el personal muy amable. Definitivamente volveré.',
      date: '2024-12-15',
      photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxSy7iti5t3frwIFJxLZjjYKs0z_hHHA3vKubCZfGhUYoUxe7xDhIDFVXsE9Oz8QIEeVpipLuLabxzf4mMuEAwQmorieQ85uwv6rLCgUbyukQn9_08H7TueRwIJLV27Ym1xJ09r=w800-h600-p-k-no'
    },
    {
      id: '2',
      author: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Excelente selección de cafés ecuatorianos. Cada variedad tiene su personalidad única. Muy recomendado para los amantes del café.',
      date: '2024-12-10',
      photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwX-5DNlLR8qKl6Fu4RkhzWB02liGr3G2Xxmhfp_aMjDAtUEOOrYGDQHxxiVZ1_1GttsGHwnOjhE65JCCvJai94lq73ibZZNCzumdutHK6J0Tb9WYNZGLfb8VSI2CpOCsJtfZH3Ew=w800-h600-p-k-no'
    },
    {
      id: '3',
      author: 'Ana Martínez',
      rating: 5,
      comment: 'Un lugar perfecto para disfrutar de un buen café. La atención es excelente y los sabores son increíbles. El café de Loja es mi favorito.',
      date: '2024-12-05',
      photoUrl: 'https://lh3.googleusercontent.com/geougc-cs/AMBA38uY5SDTn7KibaGu7czOggCB1dh_oY-lcbiUz0g869tZIuL4uGb1fW-OeV4O-pu-9mII6vJs_BRmd93PvC1E-1APL5Ju90kw0WfjebPQ0a1XUaAEcW-n-5gcbIjvt_f6NOb_WdB-=w800-h600-p'
    },
    {
      id: '4',
      author: 'Luis Fernández',
      rating: 4,
      comment: 'Muy buen café y ambiente tranquilo. Ideal para trabajar o leer. El único detalle es que a veces está un poco lleno, pero vale la pena esperar.',
      date: '2024-11-28',
      photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxUlYUDlvI8OeCbZiescKTnJ4XC-AlJYRVwH_4VQwNgOVjO-JCrSXzDtcQetSaBf-Jh8q0W5gNSe3YuYn4OAUgn-yNIyIHDiu872qeHqnV1Oxl7R_Va5tMMl07WfVAKnxoTRALA=w800-h600-p-k-no'
    }
  ];

  // Gallery images - Imágenes reales de Google Maps del Café del Valle
  private galleryImages: GalleryImage[] = [
    {
      id: '1',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxSy7iti5t3frwIFJxLZjjYKs0z_hHHA3vKubCZfGhUYoUxe7xDhIDFVXsE9Oz8QIEeVpipLuLabxzf4mMuEAwQmorieQ85uwv6rLCgUbyukQn9_08H7TueRwIJLV27Ym1xJ09r=w1200-h800-p-k-no',
      alt: 'Café del Valle - Vista principal',
      title: 'Vista principal del café'
    },
    {
      id: '2',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwX-5DNlLR8qKl6Fu4RkhzWB02liGr3G2Xxmhfp_aMjDAtUEOOrYGDQHxxiVZ1_1GttsGHwnOjhE65JCCvJai94lq73ibZZNCzumdutHK6J0Tb9WYNZGLfb8VSI2CpOCsJtfZH3Ew=w1200-h800-p-k-no',
      alt: 'Interior del café',
      title: 'Ambiente acogedor'
    },
    {
      id: '3',
      url: 'https://lh3.googleusercontent.com/geougc-cs/AMBA38uY5SDTn7KibaGu7czOggCB1dh_oY-lcbiUz0g869tZIuL4uGb1fW-OeV4O-pu-9mII6vJs_BRmd93PvC1E-1APL5Ju90kw0WfjebPQ0a1XUaAEcW-n-5gcbIjvt_f6NOb_WdB-=w1200-h800-p',
      alt: 'Espacio del café',
      title: 'Nuestro espacio'
    },
    {
      id: '4',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxUlYUDlvI8OeCbZiescKTnJ4XC-AlJYRVwH_4VQwNgOVjO-JCrSXzDtcQetSaBf-Jh8q0W5gNSe3YuYn4OAUgn-yNIyIHDiu872qeHqnV1Oxl7R_Va5tMMl07WfVAKnxoTRALA=w1200-h800-p-k-no',
      alt: 'Café del Valle',
      title: 'Bienvenidos a Café del Valle'
    },
    {
      id: '5',
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwcdLbyfIjPnr9Z9O0bUn1S1kfkLPoOlief4CzBBMrFRDyFxBxGhaPyP5m3K5Z8TanB6P4QyfK82HxJ4AVezuxPjvfU1-tEpAUkfFOohjhNKrq0iPx08h0K7SeBYf3nl2ISCu4p=w1200-h800-p-k-no',
      alt: 'Vista exterior',
      title: 'Ubicación en Portoviejo'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&h=800&fit=crop&q=80',
      alt: 'Interior del café',
      title: 'Ambiente cálido'
    }
  ];

  getCafeInfo(): CafeInfo {
    return this.cafeInfo;
  }

  getCoffeeVarieties(): CoffeeVariety[] {
    return this.coffeeVarieties;
  }

  getReviews(): Review[] {
    return this.reviews;
  }

  getGalleryImages(): GalleryImage[] {
    return this.galleryImages;
  }

  // Menu Items - Preparado para integración con Headless CMS
  private menuItems: MenuItem[] = [
    // Bebidas - Imágenes del menú de Google Maps
    {
      id: '1',
      name: 'Espresso',
      description: 'Café espresso intenso y aromático, preparado con nuestros mejores granos ecuatorianos',
      price: 2.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&q=80',
      available: true,
      featured: true
    },
    {
      id: '2',
      name: 'Cappuccino',
      description: 'Espresso con leche vaporizada y espuma de leche, decorado con arte latte',
      price: 3.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80',
      available: true,
      featured: true
    },
    {
      id: '3',
      name: 'Café Latte',
      description: 'Espresso suave con leche vaporizada, perfecto para cualquier momento del día',
      price: 3.00,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80',
      available: true
    },
    {
      id: '4',
      name: 'Americano',
      description: 'Espresso diluido con agua caliente, sabor intenso y cuerpo completo',
      price: 2.50,
      category: 'bebidas',
      image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxUlYUDlvI8OeCbZiescKTnJ4XC-AlJYRVwH_4VQwNgOVjO-JCrSXzDtcQetSaBf-Jh8q0W5gNSe3YuYn4OAUgn-yNIyIHDiu872qeHqnV1Oxl7R_Va5tMMl07WfVAKnxoTRALA=w800-h600-p-k-no',
      available: true
    },
    {
      id: '5',
      name: 'Mocha',
      description: 'Espresso con chocolate y leche vaporizada, un placer dulce y cremoso',
      price: 4.00,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80',
      available: true
    },
    {
      id: '6',
      name: 'Café Frío',
      description: 'Café helado preparado con nuestros granos especiales, refrescante y delicioso',
      price: 3.50,
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&h=600&fit=crop&q=80',
      available: true
    },
    // Comidas - Imágenes del menú de Google Maps
    {
      id: '7',
      name: 'Sandwich de Pollo',
      description: 'Pechuga de pollo a la plancha, lechuga, tomate y mayonesa en pan artesanal',
      price: 5.50,
      category: 'comidas',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop&q=80',
      available: true,
      featured: true
    },
    {
      id: '8',
      name: 'Sandwich Vegetariano',
      description: 'Aguacate, queso, tomate, lechuga y aderezo especial en pan integral',
      price: 4.50,
      category: 'comidas',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop&q=80',
      available: true
    },
    {
      id: '9',
      name: 'Tostadas con Mermelada',
      description: 'Pan tostado artesanal servido con mermelada casera de frutas locales',
      price: 3.00,
      category: 'comidas',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
      available: true
    },
    {
      id: '10',
      name: 'Quiche del Día',
      description: 'Quiche casero preparado diariamente con ingredientes frescos',
      price: 4.50,
      category: 'comidas',
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&h=600&fit=crop&q=80',
      available: true
    },
    // Postres - Imágenes del menú de Google Maps
    {
      id: '11',
      name: 'Torta de Chocolate',
      description: 'Torta húmeda de chocolate belga, cubierta con ganache y decoración elegante',
      price: 4.00,
      category: 'postres',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80',
      available: true,
      featured: true
    },
    {
      id: '12',
      name: 'Brownie con Helado',
      description: 'Brownie casero caliente servido con helado de vainilla y salsa de chocolate',
      price: 4.50,
      category: 'postres',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
      available: true
    },
    {
      id: '13',
      name: 'Cheesecake',
      description: 'Cheesecake cremoso con base de galleta, disponible en diferentes sabores',
      price: 4.00,
      category: 'postres',
      image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&q=80',
      available: true
    },
    // Especiales - Imágenes del menú de Google Maps
    {
      id: '14',
      name: 'Café de Especialidad del Día',
      description: 'Nuestra selección especial de café de origen único, preparado con métodos artesanales',
      price: 5.00,
      category: 'especiales',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80',
      available: true,
      featured: true
    },
    {
      id: '15',
      name: 'Degustación de Cafés',
      description: 'Prueba tres variedades diferentes de nuestros cafés ecuatorianos en una experiencia única',
      price: 8.00,
      category: 'especiales',
      image: 'https://lh3.googleusercontent.com/geougc-cs/AMBA38uY5SDTn7KibaGu7czOggCB1dh_oY-lcbiUz0g869tZIuL4uGb1fW-OeV4O-pu-9mII6vJs_BRmd93PvC1E-1APL5Ju90kw0WfjebPQ0a1XUaAEcW-n-5gcbIjvt_f6NOb_WdB-=w800-h600-p',
      available: true
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItemsByCategory(category: MenuItem['category']): MenuItem[] {
    return this.menuItems.filter(item => item.category === category);
  }

  getFeaturedMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => item.featured);
  }

  // Blog Posts - Preparado para integración con Headless CMS
  private blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'El Café Ecuatoriano: Una Tradición que Perdura',
      slug: 'cafe-ecuatoriano-tradicion',
      excerpt: 'Descubre la rica historia del café ecuatoriano y cómo se ha convertido en uno de los mejores del mundo gracias a sus condiciones geográficas únicas.',
      content: `
        <p>El café ecuatoriano ha ganado reconocimiento internacional por su calidad excepcional. Las condiciones geográficas únicas de Ecuador, con sus diferentes altitudes y microclimas, crean el ambiente perfecto para cultivar variedades de café de alta calidad.</p>
        <p>En Café del Valle, trabajamos directamente con productores locales de diferentes regiones del país, asegurándonos de ofrecerte los mejores granos seleccionados a mano.</p>
        <p>Desde las montañas de Loja hasta las tierras costeras de Manabí, cada región aporta características únicas a nuestros cafés.</p>
      `,
      author: 'Equipo Café del Valle',
      publishedAt: '2025-12-15',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=800&fit=crop&q=80',
      category: 'Cultura del Café',
      tags: ['Ecuador', 'Tradición', 'Calidad'],
      featured: true
    },
    {
      id: '2',
      title: 'Guía de Variedades: Typica, Bourbon y Caturra',
      slug: 'guia-variedades-cafe',
      excerpt: 'Conoce las principales variedades de café que cultivamos y sus características únicas de sabor y aroma.',
      content: `
        <p>En Café del Valle, nos especializamos en tres variedades principales de café arábigo: Typica, Bourbon y Caturra.</p>
        <h3>Café Typica</h3>
        <p>La variedad Typica es una de las más antiguas y tradicionales. Se caracteriza por sus granos alargados y su sabor suave y equilibrado, con notas dulces y cítricas.</p>
        <h3>Café Bourbon</h3>
        <p>Originaria de la isla de Reunión, la variedad Bourbon es apreciada por su dulzura natural y notas afrutadas. Ofrece un cuerpo completo y un sabor intenso.</p>
        <h3>Café Caturra</h3>
        <p>Una mutación natural de Bourbon, Caturra destaca por su alta productividad y excelente perfil de sabor, con notas frutales y acidez brillante.</p>
      `,
      author: 'Equipo Café del Valle',
      publishedAt: '2025-11-20',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=800&fit=crop&q=80',
      category: 'Educación',
      tags: ['Variedades', 'Guía', 'Educación'],
      featured: true
    },
    {
      id: '3',
      title: 'Nuevo Horario de Atención',
      slug: 'nuevo-horario-atencion',
      excerpt: 'Hemos ampliado nuestro horario de atención para servirte mejor. Conoce nuestros nuevos horarios.',
      content: `
        <p>Estamos emocionados de anunciar que hemos ampliado nuestro horario de atención para servirte mejor.</p>
        <ul>
          <li><strong>Lunes - Viernes:</strong> 7:00 AM - 8:00 PM</li>
          <li><strong>Sábado:</strong> 8:00 AM - 9:00 PM</li>
          <li><strong>Domingo:</strong> 8:00 AM - 7:00 PM</li>
        </ul>
        <p>Te esperamos en nuestro nuevo local en Atanacio Santos y Calle Augusto Moreira, Ciudadela San Cristóbal, Portoviejo.</p>
      `,
      author: 'Equipo Café del Valle',
      publishedAt: '2025-10-25',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=800&fit=crop&q=80',
      category: 'Noticias',
      tags: ['Horario', 'Noticias'],
      featured: false
    },
    {
      id: '4',
      title: 'El Proceso de Tueste: Arte y Ciencia',
      slug: 'proceso-tueste-cafe',
      excerpt: 'Aprende sobre el proceso de tueste del café y cómo afecta el sabor final de tu taza.',
      content: `
        <p>El tueste del café es tanto un arte como una ciencia. En Café del Valle, utilizamos diferentes perfiles de tueste para resaltar las características únicas de cada variedad.</p>
        <h3>Tueste Claro</h3>
        <p>Preserva los sabores originales del grano, con mayor acidez y notas más complejas.</p>
        <h3>Tueste Medio</h3>
        <p>Equilibra el sabor, creando un perfil balanceado entre acidez y cuerpo.</p>
        <h3>Tueste Oscuro</h3>
        <p>Desarrolla sabores más intensos y notas de chocolate y caramelo.</p>
      `,
      author: 'Equipo Café del Valle',
      publishedAt: '2026-01-03',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop&q=80',
      category: 'Educación',
      tags: ['Tueste', 'Proceso', 'Educación'],
      featured: false
    }
  ];

  // Métodos para obtener datos - Preparados para migración a Headless CMS
  // Estos métodos simulan llamadas a API y pueden ser fácilmente reemplazados
  // por llamadas HTTP reales a un Headless CMS como Strapi, Contentful, etc.

  /**
   * Obtiene todos los posts del blog
   * En producción, esto haría una llamada HTTP: return this.http.get<BlogPost[]>('/api/blog/posts')
   */
  getBlogPosts(): Observable<BlogPost[]> {
    // Simula una llamada a API con un pequeño delay
    return of(this.blogPosts).pipe(delay(100));
  }

  /**
   * Obtiene un post específico por slug
   * En producción: return this.http.get<BlogPost>(`/api/blog/posts/${slug}`)
   */
  getBlogPostBySlug(slug: string): Observable<BlogPost | undefined> {
    const post = this.blogPosts.find(p => p.slug === slug);
    return of(post).pipe(delay(100));
  }

  /**
   * Obtiene posts destacados
   * En producción: return this.http.get<BlogPost[]>('/api/blog/posts?featured=true')
   */
  getFeaturedPosts(): Observable<BlogPost[]> {
    const featured = this.blogPosts.filter(p => p.featured);
    return of(featured).pipe(delay(100));
  }

  /**
   * Obtiene posts por categoría
   * En producción: return this.http.get<BlogPost[]>(`/api/blog/posts?category=${category}`)
   */
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    const posts = this.blogPosts.filter(p => p.category === category);
    return of(posts).pipe(delay(100));
  }

  /**
   * Obtiene los últimos N posts
   * En producción: return this.http.get<BlogPost[]>(`/api/blog/posts?limit=${limit}&sort=publishedAt:desc`)
   */
  getLatestPosts(limit: number = 3): Observable<BlogPost[]> {
    const sorted = [...this.blogPosts].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return of(sorted.slice(0, limit)).pipe(delay(100));
  }

  // Métodos para otros datos - También preparados para API
  /**
   * Obtiene información del café
   * En producción: return this.http.get<CafeInfo>('/api/cafe/info')
   */
  getCafeInfoAsync(): Observable<CafeInfo> {
    return of(this.cafeInfo).pipe(delay(50));
  }

  /**
   * Obtiene variedades de café
   * En producción: return this.http.get<CoffeeVariety[]>('/api/cafe/varieties')
   */
  getCoffeeVarietiesAsync(): Observable<CoffeeVariety[]> {
    return of(this.coffeeVarieties).pipe(delay(50));
  }

  /**
   * Obtiene reseñas
   * En producción: return this.http.get<Review[]>('/api/reviews')
   */
  getReviewsAsync(): Observable<Review[]> {
    return of(this.reviews).pipe(delay(50));
  }

  /**
   * Obtiene imágenes de la galería
   * En producción: return this.http.get<GalleryImage[]>('/api/gallery/images')
   */
  getGalleryImagesAsync(): Observable<GalleryImage[]> {
    return of(this.galleryImages).pipe(delay(50));
  }

  /**
   * Obtiene items del menú
   * En producción: return this.http.get<MenuItem[]>('/api/menu/items')
   */
  getMenuItemsAsync(): Observable<MenuItem[]> {
    return of(this.menuItems).pipe(delay(50));
  }

  /**
   * Obtiene items del menú por categoría
   * En producción: return this.http.get<MenuItem[]>(`/api/menu/items?category=${category}`)
   */
  getMenuItemsByCategoryAsync(category: MenuItem['category']): Observable<MenuItem[]> {
    const items = this.menuItems.filter(item => item.category === category);
    return of(items).pipe(delay(50));
  }

  /**
   * Obtiene items destacados del menú
   * En producción: return this.http.get<MenuItem[]>('/api/menu/items?featured=true')
   */
  getFeaturedMenuItemsAsync(): Observable<MenuItem[]> {
    const items = this.menuItems.filter(item => item.featured);
    return of(items).pipe(delay(50));
  }
}
