import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('es');
  private translations: { [key: string]: { [lang in Language]: string } } = {};

  constructor() {
    this.loadTranslations();
    // Load saved language preference
    const savedLang = localStorage.getItem('cafe-del-valle-language') as Language;
    if (savedLang && ['es', 'en', 'fr'].includes(savedLang)) {
      this.currentLanguage$.next(savedLang);
    }
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageValue(): Language {
    return this.currentLanguage$.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
    localStorage.setItem('cafe-del-valle-language', lang);
  }

  translate(key: string, params?: { [key: string]: string }): string {
    const lang = this.currentLanguage$.value;
    let translation = this.translations[key]?.[lang] || this.translations[key]?.['es'] || key;
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{{${paramKey}}}`, params[paramKey]);
      });
    }
    
    return translation;
  }

  private loadTranslations(): void {
    // Navigation
    this.translations['nav.about'] = {
      es: 'Nosotros',
      en: 'About',
      fr: 'À propos'
    };
    this.translations['nav.coffee'] = {
      es: 'Cafés',
      en: 'Coffee',
      fr: 'Café'
    };
    this.translations['nav.menu'] = {
      es: 'Menú',
      en: 'Menu',
      fr: 'Menu'
    };
    this.translations['nav.gallery'] = {
      es: 'Galería',
      en: 'Gallery',
      fr: 'Galerie'
    };
    this.translations['nav.reviews'] = {
      es: 'Reseñas',
      en: 'Reviews',
      fr: 'Avis'
    };
    this.translations['nav.blog'] = {
      es: 'Blog',
      en: 'Blog',
      fr: 'Blog'
    };
    this.translations['nav.contact'] = {
      es: 'Contacto',
      en: 'Contact',
      fr: 'Contact'
    };

    // Hero Section
    this.translations['hero.tagline'] = {
      es: 'El sabor auténtico del café ecuatoriano',
      en: 'The authentic taste of Ecuadorian coffee',
      fr: 'Le goût authentique du café équatorien'
    };
    this.translations['hero.description'] = {
      es: 'Descubre el auténtico sabor del café ecuatoriano, seleccionado de las mejores regiones del país.',
      en: 'Discover the authentic taste of Ecuadorian coffee, selected from the best regions of the country.',
      fr: 'Découvrez le goût authentique du café équatorien, sélectionné dans les meilleures régions du pays.'
    };
    this.translations['hero.button.coffee'] = {
      es: 'Nuestros Cafés',
      en: 'Our Coffee',
      fr: 'Nos Cafés'
    };
    this.translations['hero.button.visit'] = {
      es: 'Visítanos',
      en: 'Visit Us',
      fr: 'Visitez-nous'
    };

    // About Section
    this.translations['about.title'] = {
      es: 'Sobre Nosotros',
      en: 'About Us',
      fr: 'À propos de nous'
    };
    this.translations['about.cafe.description'] = {
      es: 'Café del Valle es un lugar donde la tradición y la pasión por el café se encuentran. Ofrecemos una experiencia única con cafés de origen ecuatoriano, seleccionados de las mejores regiones del país.',
      en: 'Café del Valle is a place where tradition and passion for coffee meet. We offer a unique experience with Ecuadorian origin coffees, selected from the best regions of the country.',
      fr: 'Café del Valle est un endroit où la tradition et la passion pour le café se rencontrent. Nous offrons une expérience unique avec des cafés d\'origine équatorienne, sélectionnés dans les meilleures régions du pays.'
    };
    this.translations['about.description'] = {
      es: 'En Café del Valle, nos enorgullecemos de ofrecer café de la más alta calidad, directamente desde las mejores regiones cafetaleras de Ecuador. Cada taza que servimos cuenta una historia de tradición, dedicación y pasión por el café.',
      en: 'At Café del Valle, we are proud to offer the highest quality coffee, directly from the best coffee regions of Ecuador. Every cup we serve tells a story of tradition, dedication and passion for coffee.',
      fr: 'Chez Café del Valle, nous sommes fiers d\'offrir le café de la plus haute qualité, directement des meilleures régions caféières d\'Équateur. Chaque tasse que nous servons raconte une histoire de tradition, de dévouement et de passion pour le café.'
    };
    this.translations['about.description2'] = {
      es: 'Trabajamos directamente con productores locales para asegurar que cada grano sea seleccionado con cuidado y tostado a la perfección, preservando los sabores únicos que hacen del café ecuatoriano algo especial.',
      en: 'We work directly with local producers to ensure that each bean is carefully selected and roasted to perfection, preserving the unique flavors that make Ecuadorian coffee special.',
      fr: 'Nous travaillons directement avec les producteurs locaux pour garantir que chaque grain soit soigneusement sélectionné et torréfié à la perfection, préservant les saveurs uniques qui rendent le café équatorien spécial.'
    };
    this.translations['about.feature.origin.title'] = {
      es: 'Café de Origen',
      en: 'Origin Coffee',
      fr: 'Café d\'Origine'
    };
    this.translations['about.feature.origin.desc'] = {
      es: 'Granos seleccionados de diversas regiones de Ecuador',
      en: 'Beans selected from various regions of Ecuador',
      fr: 'Grains sélectionnés de diverses régions d\'Équateur'
    };
    this.translations['about.feature.sustainable.title'] = {
      es: 'Sostenible',
      en: 'Sustainable',
      fr: 'Durable'
    };
    this.translations['about.feature.sustainable.desc'] = {
      es: 'Comprometidos con prácticas agrícolas sostenibles',
      en: 'Committed to sustainable agricultural practices',
      fr: 'Engagés dans des pratiques agricoles durables'
    };
    this.translations['about.feature.artisan.title'] = {
      es: 'Artesanal',
      en: 'Artisanal',
      fr: 'Artisanal'
    };
    this.translations['about.feature.artisan.desc'] = {
      es: 'Tostado y preparado con dedicación y experiencia',
      en: 'Roasted and prepared with dedication and experience',
      fr: 'Torréfié et préparé avec dévouement et expérience'
    };

    // Coffee Section
    this.translations['coffee.title'] = {
      es: 'Nuestros Cafés',
      en: 'Our Coffee',
      fr: 'Nos Cafés'
    };
    this.translations['coffee.subtitle'] = {
      es: 'Descubre nuestra selección de cafés ecuatorianos, cada uno con su personalidad única',
      en: 'Discover our selection of Ecuadorian coffees, each with its unique personality',
      fr: 'Découvrez notre sélection de cafés équatoriens, chacun avec sa personnalité unique'
    };
    this.translations['coffee.flavor.notes'] = {
      es: 'Notas de sabor:',
      en: 'Flavor notes:',
      fr: 'Notes de saveur:'
    };

    // Coffee Varieties Descriptions
    this.translations['coffee.typica.description'] = {
      es: 'Variedad clásica ecuatoriana con un sabor suave y equilibrado. Cultivado en las alturas de Loja, este café ofrece notas dulces y un cuerpo medio. La Typica es una de las variedades más antiguas y tradicionales del mundo, conocida por su alta calidad en taza y granos alargados característicos.',
      en: 'Classic Ecuadorian variety with a smooth and balanced flavor. Grown in the heights of Loja, this coffee offers sweet notes and a medium body. Typica is one of the oldest and most traditional varieties in the world, known for its high cup quality and characteristic elongated beans.',
      fr: 'Variété équatorienne classique au goût doux et équilibré. Cultivé dans les hauteurs de Loja, ce café offre des notes sucrées et un corps moyen. La Typica est l\'une des variétés les plus anciennes et traditionnelles au monde, connue pour sa haute qualité en tasse et ses grains allongés caractéristiques.'
    };
    this.translations['coffee.bourbon.description'] = {
      es: 'Originario de Manabí, este café se caracteriza por su sabor intenso y aromático. Perfecto para los amantes del café con cuerpo completo. La variedad Bourbon es apreciada por su dulzura natural y notas afrutadas características, originaria de la isla de Reunión. En Ecuador, se cultiva principalmente en las provincias costeras como Manabí.',
      en: 'Originating from Manabí, this coffee is characterized by its intense and aromatic flavor. Perfect for lovers of full-bodied coffee. The Bourbon variety is appreciated for its natural sweetness and characteristic fruity notes, originally from Reunion Island. In Ecuador, it is mainly grown in coastal provinces like Manabí.',
      fr: 'Originaire de Manabí, ce café se caractérise par sa saveur intense et aromatique. Parfait pour les amateurs de café corsé. La variété Bourbon est appréciée pour sa douceur naturelle et ses notes fruitées caractéristiques, originaire de l\'île de la Réunion. En Équateur, elle est principalement cultivée dans les provinces côtières comme Manabí.'
    };
    this.translations['coffee.caturra.description'] = {
      es: 'Cultivado en las montañas de Pichincha, este café ofrece un perfil de sabor complejo con notas frutales y un acabado limpio. Caturra es una mutación natural de Bourbon, destacada por su alta productividad y excelente perfil de sabor, ideal para las condiciones de altura de Pichincha. Esta variedad es muy popular en Ecuador por su adaptabilidad y calidad.',
      en: 'Grown in the mountains of Pichincha, this coffee offers a complex flavor profile with fruity notes and a clean finish. Caturra is a natural mutation of Bourbon, known for its high productivity and excellent flavor profile, ideal for the high-altitude conditions of Pichincha. This variety is very popular in Ecuador for its adaptability and quality.',
      fr: 'Cultivé dans les montagnes de Pichincha, ce café offre un profil de saveur complexe avec des notes fruitées et une finale propre. Caturra est une mutation naturelle du Bourbon, connue pour sa haute productivité et son excellent profil de saveur, idéale pour les conditions d\'altitude de Pichincha. Cette variété est très populaire en Équateur pour son adaptabilité et sa qualité.'
    };
    this.translations['coffee.especial.description'] = {
      es: 'Nuestro café especial de Zamora Chinchipe, una región reconocida por producir algunos de los mejores cafés del país. Sabor excepcional con notas de chocolate y caramelo. Esta región produce cafés de altura con características únicas, cultivados en condiciones ideales para desarrollar sabores complejos y excepcionales. Zamora Chinchipe es una de las regiones cafetaleras más prestigiosas de Ecuador.',
      en: 'Our special coffee from Zamora Chinchipe, a region recognized for producing some of the best coffees in the country. Exceptional flavor with chocolate and caramel notes. This region produces high-altitude coffees with unique characteristics, grown under ideal conditions to develop complex and exceptional flavors. Zamora Chinchipe is one of the most prestigious coffee regions in Ecuador.',
      fr: 'Notre café spécial de Zamora Chinchipe, une région reconnue pour produire certains des meilleurs cafés du pays. Saveur exceptionnelle avec des notes de chocolat et de caramel. Cette région produit des cafés d\'altitude aux caractéristiques uniques, cultivés dans des conditions idéales pour développer des saveurs complexes et exceptionnelles. Zamora Chinchipe est l\'une des régions caféières les plus prestigieuses d\'Équateur.'
    };

    // Coffee Flavor Notes Translations
    this.translations['coffee.notes.dulce'] = {
      es: 'Dulce',
      en: 'Sweet',
      fr: 'Doux'
    };
    this.translations['coffee.notes.citrico'] = {
      es: 'Cítrico',
      en: 'Citrus',
      fr: 'Agrumes'
    };
    this.translations['coffee.notes.equilibrado'] = {
      es: 'Equilibrado',
      en: 'Balanced',
      fr: 'Équilibré'
    };
    this.translations['coffee.notes.intenso'] = {
      es: 'Intenso',
      en: 'Intense',
      fr: 'Intense'
    };
    this.translations['coffee.notes.aromatico'] = {
      es: 'Aromático',
      en: 'Aromatic',
      fr: 'Aromatique'
    };
    this.translations['coffee.notes.cuerpo.completo'] = {
      es: 'Cuerpo completo',
      en: 'Full body',
      fr: 'Corps complet'
    };
    this.translations['coffee.notes.frutal'] = {
      es: 'Frutal',
      en: 'Fruity',
      fr: 'Fruité'
    };
    this.translations['coffee.notes.acidez.brillante'] = {
      es: 'Acidez brillante',
      en: 'Bright acidity',
      fr: 'Acidité vive'
    };
    this.translations['coffee.notes.acabado.limpio'] = {
      es: 'Acabado limpio',
      en: 'Clean finish',
      fr: 'Finale propre'
    };
    this.translations['coffee.notes.chocolate'] = {
      es: 'Chocolate',
      en: 'Chocolate',
      fr: 'Chocolat'
    };
    this.translations['coffee.notes.caramelo'] = {
      es: 'Caramelo',
      en: 'Caramel',
      fr: 'Caramel'
    };
    this.translations['coffee.notes.excepcional'] = {
      es: 'Excepcional',
      en: 'Exceptional',
      fr: 'Exceptionnel'
    };

    // Menu Section
    this.translations['menu.title'] = {
      es: 'Nuestro Menú',
      en: 'Our Menu',
      fr: 'Notre Menu'
    };
    this.translations['menu.subtitle'] = {
      es: 'Descubre nuestra selección de bebidas, comidas y postres preparados con ingredientes frescos y de calidad',
      en: 'Discover our selection of drinks, meals and desserts prepared with fresh, quality ingredients',
      fr: 'Découvrez notre sélection de boissons, plats et desserts préparés avec des ingrédients frais et de qualité'
    };
    this.translations['menu.filter.all'] = {
      es: 'Todos',
      en: 'All',
      fr: 'Tous'
    };
    this.translations['menu.filter.drinks'] = {
      es: 'Bebidas',
      en: 'Drinks',
      fr: 'Boissons'
    };
    this.translations['menu.filter.food'] = {
      es: 'Comidas',
      en: 'Food',
      fr: 'Repas'
    };
    this.translations['menu.filter.desserts'] = {
      es: 'Postres',
      en: 'Desserts',
      fr: 'Desserts'
    };
    this.translations['menu.filter.special'] = {
      es: 'Especiales',
      en: 'Special',
      fr: 'Spécial'
    };
    this.translations['menu.featured'] = {
      es: 'Destacado',
      en: 'Featured',
      fr: 'En vedette'
    };
    this.translations['menu.unavailable'] = {
      es: 'No disponible',
      en: 'Unavailable',
      fr: 'Indisponible'
    };
    this.translations['menu.no.items'] = {
      es: 'No hay items disponibles en esta categoría.',
      en: 'No items available in this category.',
      fr: 'Aucun article disponible dans cette catégorie.'
    };

    // Menu Items Descriptions
    // Bebidas
    this.translations['menu.item.1.description'] = {
      es: 'Café espresso intenso y aromático, preparado con nuestros mejores granos ecuatorianos',
      en: 'Intense and aromatic espresso coffee, prepared with our best Ecuadorian beans',
      fr: 'Café espresso intense et aromatique, préparé avec nos meilleurs grains équatoriens'
    };
    this.translations['menu.item.2.description'] = {
      es: 'Espresso con leche vaporizada y espuma de leche, decorado con arte latte',
      en: 'Espresso with steamed milk and milk foam, decorated with latte art',
      fr: 'Espresso avec lait vapeur et mousse de lait, décoré avec de l\'art latte'
    };
    this.translations['menu.item.3.description'] = {
      es: 'Espresso suave con leche vaporizada, perfecto para cualquier momento del día',
      en: 'Smooth espresso with steamed milk, perfect for any time of day',
      fr: 'Espresso doux avec lait vapeur, parfait pour n\'importe quel moment de la journée'
    };
    this.translations['menu.item.4.description'] = {
      es: 'Espresso diluido con agua caliente, sabor intenso y cuerpo completo',
      en: 'Espresso diluted with hot water, intense flavor and full body',
      fr: 'Espresso dilué avec de l\'eau chaude, saveur intense et corps complet'
    };
    this.translations['menu.item.5.description'] = {
      es: 'Espresso con chocolate y leche vaporizada, un placer dulce y cremoso',
      en: 'Espresso with chocolate and steamed milk, a sweet and creamy delight',
      fr: 'Espresso au chocolat et lait vapeur, un délice doux et crémeux'
    };
    this.translations['menu.item.6.description'] = {
      es: 'Café helado preparado con nuestros granos especiales, refrescante y delicioso',
      en: 'Iced coffee prepared with our special beans, refreshing and delicious',
      fr: 'Café glacé préparé avec nos grains spéciaux, rafraîchissant et délicieux'
    };
    // Comidas
    this.translations['menu.item.7.description'] = {
      es: 'Pechuga de pollo a la plancha, lechuga, tomate y mayonesa en pan artesanal',
      en: 'Grilled chicken breast, lettuce, tomato and mayonnaise on artisan bread',
      fr: 'Poitrine de poulet grillée, laitue, tomate et mayonnaise sur pain artisanal'
    };
    this.translations['menu.item.8.description'] = {
      es: 'Aguacate, queso, tomate, lechuga y aderezo especial en pan integral',
      en: 'Avocado, cheese, tomato, lettuce and special dressing on whole grain bread',
      fr: 'Avocat, fromage, tomate, laitue et vinaigrette spéciale sur pain complet'
    };
    this.translations['menu.item.9.description'] = {
      es: 'Pan tostado artesanal servido con mermelada casera de frutas locales',
      en: 'Artisan toasted bread served with homemade jam from local fruits',
      fr: 'Pain grillé artisanal servi avec confiture maison aux fruits locaux'
    };
    this.translations['menu.item.10.description'] = {
      es: 'Quiche casero preparado diariamente con ingredientes frescos',
      en: 'Homemade quiche prepared daily with fresh ingredients',
      fr: 'Quiche maison préparée quotidiennement avec des ingrédients frais'
    };
    // Postres
    this.translations['menu.item.11.description'] = {
      es: 'Torta húmeda de chocolate belga, cubierta con ganache y decoración elegante',
      en: 'Moist Belgian chocolate cake, covered with ganache and elegant decoration',
      fr: 'Gâteau au chocolat belge moelleux, recouvert de ganache et décoration élégante'
    };
    this.translations['menu.item.12.description'] = {
      es: 'Brownie casero caliente servido con helado de vainilla y salsa de chocolate',
      en: 'Hot homemade brownie served with vanilla ice cream and chocolate sauce',
      fr: 'Brownie maison chaud servi avec glace à la vanille et sauce au chocolat'
    };
    this.translations['menu.item.13.description'] = {
      es: 'Cheesecake cremoso con base de galleta, disponible en diferentes sabores',
      en: 'Creamy cheesecake with cookie base, available in different flavors',
      fr: 'Cheesecake crémeux avec base de biscuits, disponible en différentes saveurs'
    };
    // Especiales
    this.translations['menu.item.14.description'] = {
      es: 'Nuestra selección especial de café de origen único, preparado con métodos artesanales',
      en: 'Our special selection of single-origin coffee, prepared with artisanal methods',
      fr: 'Notre sélection spéciale de café d\'origine unique, préparé avec des méthodes artisanales'
    };
    this.translations['menu.item.15.description'] = {
      es: 'Prueba tres variedades diferentes de nuestros cafés ecuatorianos en una experiencia única',
      en: 'Try three different varieties of our Ecuadorian coffees in a unique experience',
      fr: 'Dégustez trois variétés différentes de nos cafés équatoriens dans une expérience unique'
    };

    // Gallery Section
    this.translations['gallery.title'] = {
      es: 'Galería',
      en: 'Gallery',
      fr: 'Galerie'
    };
    this.translations['gallery.subtitle'] = {
      es: 'Momentos especiales en Café del Valle',
      en: 'Special moments at Café del Valle',
      fr: 'Moments spéciaux au Café del Valle'
    };

    // Reviews Section
    this.translations['reviews.title'] = {
      es: 'Lo Que Dicen Nuestros Clientes',
      en: 'What Our Customers Say',
      fr: 'Ce Que Disent Nos Clients'
    };
    this.translations['reviews.subtitle'] = {
      es: 'La opinión de nuestros clientes es lo más importante para nosotros',
      en: 'Our customers\' opinion is the most important thing to us',
      fr: 'L\'opinion de nos clients est la chose la plus importante pour nous'
    };

    // Blog Section
    this.translations['blog.title'] = {
      es: 'Nuestro Blog',
      en: 'Our Blog',
      fr: 'Notre Blog'
    };
    this.translations['blog.subtitle'] = {
      es: 'Noticias, historias y consejos sobre el mundo del café',
      en: 'News, stories and tips about the world of coffee',
      fr: 'Actualités, histoires et conseils sur le monde du café'
    };
    this.translations['blog.recent'] = {
      es: 'Últimas Entradas',
      en: 'Latest Posts',
      fr: 'Derniers Articles'
    };
    this.translations['blog.read.more'] = {
      es: 'Leer más →',
      en: 'Read more →',
      fr: 'Lire la suite →'
    };
    this.translations['blog.no.posts'] = {
      es: 'No hay entradas de blog disponibles en este momento.',
      en: 'No blog posts available at this time.',
      fr: 'Aucun article de blog disponible pour le moment.'
    };
    this.translations['blog.by'] = {
      es: 'Por',
      en: 'By',
      fr: 'Par'
    };

    // Contact Section
    this.translations['contact.title'] = {
      es: 'Visítanos',
      en: 'Visit Us',
      fr: 'Visitez-nous'
    };
    this.translations['contact.subtitle'] = {
      es: 'Estamos ubicados en el corazón de Portoviejo. ¡Te esperamos!',
      en: 'We are located in the heart of Portoviejo. We look forward to seeing you!',
      fr: 'Nous sommes situés au cœur de Portoviejo. Nous avons hâte de vous voir!'
    };
    this.translations['contact.address'] = {
      es: 'Dirección',
      en: 'Address',
      fr: 'Adresse'
    };
    this.translations['contact.phone'] = {
      es: 'Teléfono',
      en: 'Phone',
      fr: 'Téléphone'
    };
    this.translations['contact.hours'] = {
      es: 'Horarios',
      en: 'Hours',
      fr: 'Heures'
    };
    this.translations['contact.view.maps'] = {
      es: 'Ver en Google Maps',
      en: 'View on Google Maps',
      fr: 'Voir sur Google Maps'
    };

    // Day Names Translations
    this.translations['days.monday'] = {
      es: 'Lunes',
      en: 'Monday',
      fr: 'Lundi'
    };
    this.translations['days.tuesday'] = {
      es: 'Martes',
      en: 'Tuesday',
      fr: 'Mardi'
    };
    this.translations['days.wednesday'] = {
      es: 'Miércoles',
      en: 'Wednesday',
      fr: 'Mercredi'
    };
    this.translations['days.thursday'] = {
      es: 'Jueves',
      en: 'Thursday',
      fr: 'Jeudi'
    };
    this.translations['days.friday'] = {
      es: 'Viernes',
      en: 'Friday',
      fr: 'Vendredi'
    };
    this.translations['days.saturday'] = {
      es: 'Sábado',
      en: 'Saturday',
      fr: 'Samedi'
    };
    this.translations['days.sunday'] = {
      es: 'Domingo',
      en: 'Sunday',
      fr: 'Dimanche'
    };
    this.translations['days.monday.saturday'] = {
      es: 'Lunes - Sábado',
      en: 'Monday - Saturday',
      fr: 'Lundi - Samedi'
    };
    this.translations['days.monday.friday'] = {
      es: 'Lunes - Viernes',
      en: 'Monday - Friday',
      fr: 'Lundi - Vendredi'
    };

    // Footer
    this.translations['footer.tagline'] = {
      es: 'El sabor auténtico del café ecuatoriano',
      en: 'The authentic taste of Ecuadorian coffee',
      fr: 'Le goût authentique du café équatorien'
    };
    this.translations['footer.links'] = {
      es: 'Enlaces',
      en: 'Links',
      fr: 'Liens'
    };
    this.translations['footer.about'] = {
      es: 'Sobre Nosotros',
      en: 'About Us',
      fr: 'À propos de nous'
    };
    this.translations['footer.coffee'] = {
      es: 'Nuestros Cafés',
      en: 'Our Coffee',
      fr: 'Nos Cafés'
    };
    this.translations['footer.contact'] = {
      es: 'Contacto',
      en: 'Contact',
      fr: 'Contact'
    };
    this.translations['footer.contact.title'] = {
      es: 'Contacto',
      en: 'Contact',
      fr: 'Contact'
    };
    this.translations['footer.rights'] = {
      es: 'Todos los derechos reservados.',
      en: 'All rights reserved.',
      fr: 'Tous droits réservés.'
    };
  }
}

