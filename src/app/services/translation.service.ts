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
    this.translations['nav.branch'] = {
      es: 'Sucursal',
      en: 'Location',
      fr: 'Succursale'
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
    this.translations['nav.club.join'] = {
      es: 'Únete al club',
      en: 'Join the club',
      fr: 'Rejoindre le club'
    };
    this.translations['nav.club.consultaSocio'] = {
      es: 'Mi suscripción',
      en: 'My subscription',
      fr: 'Mon abonnement'
    };
    this.translations['nav.club.consultaPuntos'] = {
      es: 'Mis puntos',
      en: 'My points',
      fr: 'Mes points'
    };
    this.translations['nav.club.label'] = {
      es: 'Club',
      en: 'Club',
      fr: 'Club'
    };
    this.translations['footer.club.join'] = {
      es: 'Únete al club',
      en: 'Join the club',
      fr: 'Rejoindre le club'
    };
    this.translations['nav.club.miPlanCodigo'] = {
      es: 'Plan por código',
      en: 'Plan by code',
      fr: 'Plan par code'
    };

    // Hero Section
    this.translations['hero.tagline'] = {
      es: 'El sabor auténtico del café ecuatoriano',
      en: 'The authentic taste of Ecuadorian coffee',
      fr: 'Le goût authentique du café équatorien'
    };
    this.translations['hero.title'] = {
      es: 'Café del Valle',
      en: 'Café del Valle',
      fr: 'Café del Valle'
    };
    this.translations['hero.description'] = {
      es: 'Descubre el auténtico sabor del café ecuatoriano, de la mano con procesos artesanales y granos de alta calidad.',
      en: 'Discover the authentic taste of Ecuadorian coffee, through artisanal processes and high-quality beans.',
      fr: 'Découvrez le goût authentique du café équatorien, grâce à des processus artisanaux et des grains de haute qualité.'
    };
    this.translations['hero.button.coffee'] = {
      es: 'Nuestros Cafés',
      en: 'Our Coffee',
      fr: 'Nos Cafés'
    };
    this.translations['hero.button.menu'] = {
      es: 'Ver Menú',
      en: 'View Menu',
      fr: 'Voir le Menu'
    };
    this.translations['hero.button.visit'] = {
      es: 'Visítanos',
      en: 'Visit Us',
      fr: 'Visitez-nous'
    };
    this.translations['hero.scroll'] = {
      es: 'Descubre más',
      en: 'Discover more',
      fr: 'Découvrir plus'
    };
    this.translations['hero.scrollAria'] = {
      es: 'Ir a la siguiente sección: descubre más sobre nosotros',
      en: 'Go to the next section: discover more about us',
      fr: 'Aller à la section suivante : en savoir plus sur nous'
    };
    this.translations['public.backHome'] = {
      es: 'Inicio',
      en: 'Home',
      fr: 'Accueil'
    };
    this.translations['public.backHomeAria'] = {
      es: 'Volver a la página principal de Café del Valle',
      en: 'Return to Café del Valle home page',
      fr: "Retour à la page d'accueil de Café del Valle"
    };
    this.translations['public.website'] = {
      es: 'Sitio público',
      en: 'Public site',
      fr: 'Site public'
    };

    // About Section
    this.translations['about.subtitle'] = {
      es: 'Nuestra Historia',
      en: 'Our History',
      fr: 'Notre Histoire'
    };
    this.translations['about.est_date'] = {
      es: 'Desde 2024',
      en: 'Since 2024',
      fr: 'Depuis 2024'
    };
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
    this.translations['coffee.subtitle_small'] = {
      es: 'Nuestras Variedades',
      en: 'Our Varieties',
      fr: 'Nos Variétés'
    };
    this.translations['coffee.title'] = {
      es: 'Cafés de Especialidad',
      en: 'Specialty Coffees',
      fr: 'Cafés de Spécialité'
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
    this.translations['menu.subtitle_small'] = {
      es: 'Nuestra Carta',
      en: 'Our Menu',
      fr: 'Notre Carte'
    };
    this.translations['menu.title'] = {
      es: 'Sabor en cada bocado',
      en: 'Flavor in every bite',
      fr: 'Saveur à chaque bouchée'
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
    this.translations['gallery.subtitle_small'] = {
      es: 'Nuestros Momentos',
      en: 'Our Moments',
      fr: 'Nos Moments'
    };
    this.translations['gallery.title'] = {
      es: 'Galería de Experiencias',
      en: 'Experience Gallery',
      fr: 'Galerie d\'Expériences'
    };
    this.translations['gallery.subtitle'] = {
      es: 'Momentos especiales en Café del Valle',
      en: 'Special moments at Café del Valle',
      fr: 'Moments spéciaux au Café del Valle'
    };
    this.translations['gallery.tag'] = {
      es: 'Ambiente',
      en: 'Atmosphere',
      fr: 'Ambiance'
    };

    // Reviews Section
    this.translations['reviews.subtitle_small'] = {
      es: 'Testimonios',
      en: 'Testimonials',
      fr: 'Témoignages'
    };
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

    // Google Maps Reviews Section
    this.translations['googleMapsReviews.subtitle_small'] = {
      es: 'Google Maps',
      en: 'Google Maps',
      fr: 'Google Maps'
    };
    this.translations['googleMapsReviews.title'] = {
      es: 'Lo Que Dicen en Google Maps',
      en: 'What They Say on Google Maps',
      fr: 'Ce Qu\'ils Disent sur Google Maps'
    };
    this.translations['googleMapsReviews.subtitle'] = {
      es: 'Reseñas reales de nuestros clientes en Google Maps',
      en: 'Real reviews from our customers on Google Maps',
      fr: 'Avis réels de nos clients sur Google Maps'
    };
    this.translations['googleMapsReviews.loading'] = {
      es: 'Cargando reseñas...',
      en: 'Loading reviews...',
      fr: 'Chargement des avis...'
    };
    this.translations['googleMapsReviews.empty'] = {
      es: 'No hay reseñas disponibles en este momento.',
      en: 'No reviews available at this time.',
      fr: 'Aucun avis disponible pour le moment.'
    };

    // Subscription Plans Section
    this.translations['subscriptions.subtitle_small'] = {
      es: 'Membresía',
      en: 'Membership',
      fr: 'Adhésion'
    };
    this.translations['subscriptions.title'] = {
      es: 'Únete al Club',
      en: 'Join the Club',
      fr: 'Rejoignez le Club'
    };
    this.translations['subscriptions.subtitle'] = {
      es: 'Experimenta el mejor café entregado en tu puerta o disfrutado en nuestro café. Elige el plan que se adapte a tu estilo de vida.',
      en: 'Experience the finest coffee delivered to your door or enjoyed in our cafe. Choose the plan that suits your lifestyle.',
      fr: 'Découvrez le meilleur café livré à votre porte ou dégusté dans notre café. Choisissez le plan qui correspond à votre style de vie.'
    };
    this.translations['subscriptions.button.interested'] = {
      es: 'Me Interesa',
      en: 'I\'m Interested',
      fr: 'Je suis intéressé'
    };
    this.translations['subscriptions.empty'] = {
      es: 'No hay planes de suscripción disponibles en este momento. ¡Vuelve pronto!',
      en: 'No subscription plans currently available. Check back soon!',
      fr: 'Aucun plan d\'abonnement disponible pour le moment. Revenez bientôt!'
    };
    this.translations['subscriptions.modal.title'] = {
      es: 'Únete a la Lista',
      en: 'Join the List',
      fr: 'Rejoignez la Liste'
    };
    this.translations['subscriptions.modal.subtitle'] = {
      es: 'Expresa tu interés por:',
      en: 'Express interest for:',
      fr: 'Exprimez votre intérêt pour:'
    };
    this.translations['subscriptions.modal.success.title'] = {
      es: '¡Interés Registrado!',
      en: 'Interest Registered!',
      fr: 'Intérêt Enregistré!'
    };
    this.translations['subscriptions.modal.success.message'] = {
      es: 'Gracias por tu interés en el',
      en: 'Thank you for your interest in the',
      fr: 'Merci pour votre intérêt pour le'
    };
    this.translations['subscriptions.modal.success.contact'] = {
      es: 'Nos pondremos en contacto contigo pronto.',
      en: 'We will contact you shortly.',
      fr: 'Nous vous contacterons sous peu.'
    };
    this.translations['subscriptions.modal.success.nextSteps'] = {
      es: 'Revisaremos tu solicitud y te contactaremos por correo o teléfono. Mientras tanto, puedes consultar tu suscripción con tu cédula (“Mi suscripción”), tus puntos (“Mis puntos”), o tu cupo y usos con el código de tu QR en “Plan por código”.',
      en: 'We will review your request and contact you by email or phone. Meanwhile, you can check your subscription with your ID (“My subscription”), your points (“My points”), or your quota and usage with your QR code on “Plan by code”.',
      fr: 'Nous examinerons votre demande et vous contacterons par e-mail ou par téléphone. En attendant, consultez votre abonnement avec votre pièce d’identité, vos points, ou votre quota avec le code QR sur « Plan par code ».'
    };
    this.translations['subscriptions.modal.form.name'] = {
      es: 'Nombre Completo',
      en: 'Full Name',
      fr: 'Nom Complet'
    };
    this.translations['subscriptions.modal.form.email'] = {
      es: 'Correo Electrónico',
      en: 'Email Address',
      fr: 'Adresse E-mail'
    };
    this.translations['subscriptions.modal.form.phone'] = {
      es: 'Número de Teléfono',
      en: 'Phone Number',
      fr: 'Numéro de Téléphone'
    };
    this.translations['subscriptions.modal.form.idNumber'] = {
      es: 'Cédula o identificación',
      en: 'National ID',
      fr: 'Pièce d\'identité'
    };
    this.translations['subscriptions.modal.form.idNumberPlaceholder'] = {
      es: 'Ej. 1723456789',
      en: 'e.g. 1723456789',
      fr: 'ex. 1723456789'
    };
    this.translations['subscriptions.modal.form.notes'] = {
      es: 'Notas / Preferencias de Bebidas',
      en: 'Notes / Beverage Preferences',
      fr: 'Notes / Préférences de Boissons'
    };
    this.translations['subscriptions.modal.form.namePlaceholder'] = {
      es: 'Juan Pérez',
      en: 'John Doe',
      fr: 'Jean Dupont'
    };
    this.translations['subscriptions.modal.form.emailPlaceholder'] = {
      es: 'juan@ejemplo.com',
      en: 'john@example.com',
      fr: 'jean@exemple.com'
    };
    this.translations['subscriptions.modal.form.phonePlaceholder'] = {
      es: '+593 99 123 4567',
      en: '+1 (555) 000-0000',
      fr: '+33 1 23 45 67 89'
    };
    this.translations['subscriptions.modal.form.notesPlaceholder'] = {
      es: 'Me encanta el café tostado oscuro...',
      en: 'I love dark roast...',
      fr: 'J\'adore le café torréfié foncé...'
    };
    this.translations['subscriptions.modal.form.sending'] = {
      es: 'Enviando...',
      en: 'Sending...',
      fr: 'Envoi...'
    };
    this.translations['subscriptions.modal.form.submit'] = {
      es: 'Completar Consulta',
      en: 'Complete Inquiry',
      fr: 'Compléter la Demande'
    };
    this.translations['subscriptions.modal.close'] = {
      es: 'Cerrar modal',
      en: 'Close modal',
      fr: 'Fermer la fenêtre'
    };
    this.translations['subscriptions.modal.error'] = {
      es: 'No se pudo enviar tu interés. Por favor intenta de nuevo.',
      en: 'Could not submit your interest. Please try again.',
      fr: 'Impossible d\'envoyer votre intérêt. Veuillez réessayer.'
    };

    // Blog Section
    this.translations['blog.subtitle_small'] = {
      es: 'Nuestras Crónicas',
      en: 'Our Chronicles',
      fr: 'Nos Chroniques'
    };
    this.translations['blog.title'] = {
      es: 'Cultura y Pasión',
      en: 'Culture and Passion',
      fr: 'Culture et Passion'
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
    this.translations['contact.subtitle_small'] = {
      es: 'Encuéntranos',
      en: 'Find Us',
      fr: 'Trouvez-nous'
    };
    this.translations['contact.title'] = {
      es: 'Ven a Visitarnos',
      en: 'Come Visit Us',
      fr: 'Venez nous voir'
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
      es: 'Enlaces Rápidos',
      en: 'Quick Links',
      fr: 'Liens Rapides'
    };
    this.translations['footer.about'] = {
      es: 'Nosotros',
      en: 'About Us',
      fr: 'À propos'
    };
    this.translations['footer.coffee'] = {
      es: 'Cafés',
      en: 'Our Coffee',
      fr: 'Nos Cafés'
    };
    this.translations['footer.menu'] = {
      es: 'Nuestra Carta',
      en: 'Our Menu',
      fr: 'Notre Carte'
    };
    this.translations['footer.blog'] = {
      es: 'Crónicas',
      en: 'Chronicles',
      fr: 'Chroniques'
    };
    this.translations['footer.contact.title'] = {
      es: 'Contacto',
      en: 'Contact',
      fr: 'Contact'
    };
    this.translations['footer.newsletter.desc'] = {
      es: 'Recibe nuestras novedades y promociones directamente en tu correo.',
      en: 'Receive our news and promotions directly in your email.',
      fr: 'Recevez nos nouvelles et promotions directement dans votre e-mail.'
    };
    this.translations['footer.email.placeholder'] = {
      es: 'Tu correo electrónico',
      en: 'Your email address',
      fr: 'Votre adresse e-mail'
    };
    this.translations['footer.rights'] = {
      es: 'Todos los derechos reservados.',
      en: 'All rights reserved.',
      fr: 'Tous droits réservés.'
    };
    this.translations['footer.bitflow.credit'] = {
      es: 'Desarrollado por',
      en: 'Developed by',
      fr: 'Développé par'
    };
  }
}

