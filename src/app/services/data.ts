import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cafeInfo: CafeInfo = {
    name: 'Café del Valle',
    tagline: 'El sabor auténtico del café ecuatoriano',
    description: 'Somos especialistas en café de origen ecuatoriano, seleccionando los mejores granos de diversas regiones del país. Nuestro compromiso es ofrecerte una experiencia única con cada taza, resaltando los sabores y aromas característicos del café ecuatoriano.',
    address: 'Atanacio Santos y Calle Augusto Moreira, Ciudadela San Cristóbal, Portoviejo, Ecuador',
    phone: '+593 99 718 6022',
    coordinates: {
      lat: -1.0603766,
      lng: -80.4545953
    },
    hours: {
      'Lunes - Viernes': '7:00 AM - 8:00 PM',
      'Sábado': '8:00 AM - 9:00 PM',
      'Domingo': '8:00 AM - 7:00 PM'
    }
  };

  private coffeeVarieties: CoffeeVariety[] = [
    {
      id: '1',
      name: 'Café Typica',
      region: 'Loja',
      description: 'Variedad clásica ecuatoriana con un sabor suave y equilibrado. Cultivado en las alturas de Loja, este café ofrece notas dulces y un cuerpo medio.',
      flavorNotes: ['Dulce', 'Cítrico', 'Equilibrado']
    },
    {
      id: '2',
      name: 'Café Bourbon',
      region: 'Manabí',
      description: 'Originario de Manabí, este café se caracteriza por su sabor intenso y aromático. Perfecto para los amantes del café con cuerpo completo.',
      flavorNotes: ['Intenso', 'Aromático', 'Cuerpo completo']
    },
    {
      id: '3',
      name: 'Café Caturra',
      region: 'Pichincha',
      description: 'Cultivado en las montañas de Pichincha, este café ofrece un perfil de sabor complejo con notas frutales y un acabado limpio.',
      flavorNotes: ['Frutal', 'Acidez brillante', 'Acabado limpio']
    },
    {
      id: '4',
      name: 'Café Especial',
      region: 'Zamora Chinchipe',
      description: 'Nuestro café especial de Zamora Chinchipe, una región reconocida por producir algunos de los mejores cafés del país. Sabor excepcional con notas de chocolate y caramelo.',
      flavorNotes: ['Chocolate', 'Caramelo', 'Excepcional']
    }
  ];

  private reviews: Review[] = [
    {
      id: '1',
      author: 'María González',
      rating: 5,
      comment: 'El mejor café que he probado en Portoviejo. El ambiente es acogedor y el personal muy amable. Definitivamente volveré.',
      date: '2024-12-15'
    },
    {
      id: '2',
      author: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Excelente selección de cafés ecuatorianos. Cada variedad tiene su personalidad única. Muy recomendado para los amantes del café.',
      date: '2024-12-10'
    },
    {
      id: '3',
      author: 'Ana Martínez',
      rating: 5,
      comment: 'Un lugar perfecto para disfrutar de un buen café. La atención es excelente y los sabores son increíbles. El café de Loja es mi favorito.',
      date: '2024-12-05'
    },
    {
      id: '4',
      author: 'Luis Fernández',
      rating: 4,
      comment: 'Muy buen café y ambiente tranquilo. Ideal para trabajar o leer. El único detalle es que a veces está un poco lleno, pero vale la pena esperar.',
      date: '2024-11-28'
    }
  ];

  private galleryImages: GalleryImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      alt: 'Interior del café',
      title: 'Ambiente acogedor'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      alt: 'Granos de café',
      title: 'Granos seleccionados'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      alt: 'Taza de café',
      title: 'Café artesanal'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
      alt: 'Preparación de café',
      title: 'Preparación cuidadosa'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      alt: 'Café espresso',
      title: 'Espresso perfecto'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
      alt: 'Barista preparando café',
      title: 'Arte del barista'
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
}
