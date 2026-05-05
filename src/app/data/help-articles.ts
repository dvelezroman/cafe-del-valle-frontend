import type { Language } from '../services/translation.service';

export type HelpAudience = 'all' | 'partner' | 'admin';

export interface HelpArticle {
  id: string;
  audience: HelpAudience;
  /** Short label for topic chips */
  topicLabel: Record<Language, string>;
  title: Record<Language, string>;
  /** Paragraphs separated by blank lines (shown with pre-line) */
  body: Record<Language, string>;
  /** Optional internal routes to suggest */
  links?: { route: string; label: Record<Language, string> }[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'website',
    audience: 'all',
    topicLabel: {
      es: 'Sitio web',
      en: 'Website',
      fr: 'Site web',
    },
    title: {
      es: 'Cómo usar el sitio público',
      en: 'Using the public website',
      fr: 'Utiliser le site public',
    },
    body: {
      es:
        'La página principal reúne todas las secciones: Nosotros, variedades de café, carta/menú, galería, reseñas, blog y contacto.\n\n' +
        'Usa el menú superior para saltar a cada bloque. Puedes cambiar el idioma (ES / EN / FR) en cualquier momento.\n\n' +
        'Si hay varias sucursales, el selector de sucursal adapta menú o datos según la ubicación elegida.',
      en:
        'The home page brings together every section: About, coffee varieties, menu, gallery, reviews, blog, and contact.\n\n' +
        'Use the top navigation to jump to each block. You can switch language (ES / EN / FR) at any time.\n\n' +
        'If several branches exist, the branch picker adjusts menu or data for the selected location.',
      fr:
        'La page d’accueil regroupe toutes les sections : À propos, variétés de café, carte, galerie, avis, blog et contact.\n\n' +
        'Utilisez le menu du haut pour accéder à chaque bloc. Vous pouvez changer la langue (ES / EN / FR) à tout moment.\n\n' +
        'S’il y a plusieurs succursales, le sélecteur adapte le menu ou les données selon le lieu choisi.',
    },
    links: [{ route: '/', label: { es: 'Ir al inicio', en: 'Home', fr: 'Accueil' } }],
  },
  {
    id: 'club-plans',
    audience: 'all',
    topicLabel: {
      es: 'Club y planes',
      en: 'Club & plans',
      fr: 'Club et offres',
    },
    title: {
      es: 'Unirse al club y solicitar un plan',
      en: 'Join the club and request a plan',
      fr: 'Rejoindre le club et demander un offre',
    },
    body: {
      es:
        'En «Únete al club» / Solicitud de socio verás los planes de suscripción activos, precios y beneficios.\n\n' +
        'Pulsa «Me interesa» en un plan y completa el formulario (nombre, correo, teléfono, cédula, notas). Eso registra tu solicitud para que el equipo del café te contacte.\n\n' +
        'También puedes llegar desde el bloque de membresía en la página de inicio.',
      en:
        'Under “Join the club” / membership request you’ll see active subscription plans, prices, and perks.\n\n' +
        'Tap “I’m interested”, fill in the form (name, email, phone, ID, notes). That registers your request so the team can reach out.\n\n' +
        'You can also open the membership block embedded on the home page.',
      fr:
        'Dans « Rejoindre le club » / demande d’adhésion, vous voyez les offres actives, les prix et les avantages.\n\n' +
        'Appuyez sur « Je suis intéressé », remplissez le formulaire (nom, e-mail, téléphone, pièce d’identité, notes). Votre demande est enregistrée pour que l’équipe vous contacte.\n\n' +
        'Vous pouvez aussi utiliser le bloc adhésion intégré sur la page d’accueil.',
    },
    links: [
      { route: '/solicitud-socio', label: { es: 'Solicitud de socio', en: 'Membership request', fr: 'Demande d’adhésion' } },
    ],
  },
  {
    id: 'consulta-socio',
    audience: 'all',
    topicLabel: {
      es: 'Consultar socio',
      en: 'Member lookup',
      fr: 'Statut membre',
    },
    title: {
      es: 'Consulta de socio (Mi suscripción por cédula)',
      en: 'Member status with your ID',
      fr: 'Statut membre avec votre pièce d’identité',
    },
    body: {
      es:
        'En esta consulta solo necesitas tu número de identificación (cédula).\n\n' +
        'El sistema muestra la información de membresía permitida en consulta pública (por ejemplo si tu solicitud está en proceso o si ya figuras como socio, según los datos registrados).\n\n' +
        'No requiere iniciar sesión.',
      en:
        'You only need your national ID number.\n\n' +
        'The app shows the membership information allowed for public lookup (for example whether your application is pending or you appear as a member, depending on stored data).\n\n' +
        'No login is required.',
      fr:
        'Vous avez seulement besoin du numéro de votre pièce d’identité.\n\n' +
        'L’application affiche les informations de membre autorisées en consultation publique.\n\n' +
        'Aucune connexion n’est requise.',
    },
    links: [
      { route: '/consulta-socio', label: { es: 'Ir a consulta', en: 'Open lookup', fr: 'Ouvrir la consultation' } },
    ],
  },
  {
    id: 'consulta-puntos',
    audience: 'all',
    topicLabel: {
      es: 'Mis puntos',
      en: 'My points',
      fr: 'Mes points',
    },
    title: {
      es: 'Consultar puntos de fidelidad',
      en: 'Check loyalty points',
      fr: 'Consulter les points de fidélité',
    },
    body: {
      es:
        'Introduce tu cédula en «Mis puntos» / consulta de puntos.\n\n' +
        'Verás el saldo o información de puntos asociada a tu perfil en el programa de lealtad, según lo que el café haya registrado.\n\n' +
        'Es una consulta pública; no necesitas contraseña.',
      en:
        'Enter your ID on “My points” / points lookup.\n\n' +
        'You’ll see the balance or loyalty information tied to your profile, as recorded by the café.\n\n' +
        'This is a public lookup; no password needed.',
      fr:
        'Saisissez votre numéro d’identité dans « Mes points ».\n\n' +
        'Vous verrez le solde ou les informations de fidélité liées à votre profil.\n\n' +
        'Consultation publique, sans mot de passe.',
    },
    links: [
      { route: '/consulta-puntos', label: { es: 'Ir a mis puntos', en: 'My points', fr: 'Mes points' } },
    ],
  },
  {
    id: 'plan-codigo',
    audience: 'all',
    topicLabel: {
      es: 'Plan por código',
      en: 'Plan by code',
      fr: 'Plan par code',
    },
    title: {
      es: 'Ver tu suscripción con el código de socio',
      en: 'View your subscription with your member code',
      fr: 'Voir votre abonnement avec votre code membre',
    },
    body: {
      es:
        'En «Plan por código» ingresa el código que te asignaron (por ejemplo el de tu tarjeta o QR).\n\n' +
        'Podrás ver el estado de tu suscripción (activa, pendiente, vencida, etc.) y el uso autorizado según tu plan.\n\n' +
        'No uses la cédula aquí: este formulario pide específicamente el código de socio.',
      en:
        'On “Plan by code”, enter the code you were given (e.g. card or QR code).\n\n' +
        'You can see subscription status (active, pending, expired, etc.) and allowed usage under your plan.\n\n' +
        'Do not use your national ID here—this screen expects the member code.',
      fr:
        'Dans « Plan par code », saisissez le code qui vous a été attribué.\n\n' +
        'Vous verrez le statut de l’abonnement et l’usage autorisé.\n\n' +
        'N’utilisez pas la pièce d’identité sur cet écran : il attend le code membre.',
    },
    links: [
      { route: '/mi-suscripcion', label: { es: 'Plan por código', en: 'Plan by code', fr: 'Plan par code' } },
    ],
  },
  {
    id: 'partner-portal',
    audience: 'partner',
    topicLabel: {
      es: 'Portal del socio',
      en: 'Member portal',
      fr: 'Espace membre',
    },
    title: {
      es: 'Portal del club (sesión de socio)',
      en: 'Club portal (member session)',
      fr: 'Espace club (session membre)',
    },
    body: {
      es:
        'Los socios aprobados inician sesión en la misma pantalla de acceso del staff (`/admin/login`) con el correo y contraseña que les dio el café.\n\n' +
        'Tras iniciar sesión, el sistema puede redirigir al panel interno: si tu cuenta es de socio, abre manualmente `/partner` o `/partner/dashboard`.\n\n' +
        'Allí verás tu estado, nivel de lealtad, código de referidos (puedes copiarlo) y un acceso a «Mi actividad» con tu historial.',
      en:
        'Approved members sign in on the same login screen as staff (`/admin/login`) using the email and password the café gave you.\n\n' +
        'After login, the app may send you to the internal dashboard—if your role is “partner”, open `/partner` or `/partner/dashboard` manually.\n\n' +
        'There you’ll see status, loyalty tier, referral code (copyable), and “My activity” with your history.',
      fr:
        'Les membres approuvés se connectent sur la même page que le personnel (`/admin/login`).\n\n' +
        'Après connexion, ouvrez manuellement `/partner` si vous êtes redirigé ailleurs.\n\n' +
        'Vous y voyez votre statut, votre niveau, le code de parrainage et « Mon activité ».',
    },
    links: [
      { route: '/partner/dashboard', label: { es: 'Ir al portal', en: 'Open portal', fr: 'Ouvrir l’espace' } },
    ],
  },
  {
    id: 'admin-panel',
    audience: 'admin',
    topicLabel: {
      es: 'Panel admin',
      en: 'Admin panel',
      fr: 'Administration',
    },
    title: {
      es: 'Panel de administración',
      en: 'Administration dashboard',
      fr: 'Tableau d’administration',
    },
    body: {
      es:
        'Solo cuentas con rol administrador pueden entrar a `/admin/dashboard`.\n\n' +
        'Desde el menú lateral gestionas información del café, menú, sucursales, blog, socios, planes, cola de solicitudes, códigos QR, suscriptores, canjes rápidos, historiales y usuarios.\n\n' +
        'Cierra sesión al terminar, especialmente en equipos compartidos.',
      en:
        'Only administrator accounts can open `/admin/dashboard`.\n\n' +
        'Use the sidebar to manage café info, menu, branches, blog, partners, plans, the membership queue, QR codes, subscribers, quick redemptions, histories, and users.\n\n' +
        'Sign out when finished, especially on shared devices.',
      fr:
        'Seuls les comptes administrateur accèdent à `/admin/dashboard`.\n\n' +
        'Le menu latéral couvre infos café, carte, succursales, blog, partenaires, offres, file d’attente, codes QR, abonnés, échanges rapides, historiques et utilisateurs.\n\n' +
        'Déconnectez-vous après utilisation sur un poste partagé.',
    },
    links: [
      { route: '/admin/dashboard', label: { es: 'Abrir panel', en: 'Open panel', fr: 'Ouvrir le tableau' } },
    ],
  },
];

export function getArticlesForUser(user: { role: string } | null): HelpArticle[] {
  const role = user?.role;
  return HELP_ARTICLES.filter(
    (a) =>
      a.audience === 'all' ||
      (a.audience === 'partner' && role === 'PARTNER') ||
      (a.audience === 'admin' && role === 'ADMIN'),
  );
}

export function getArticleById(id: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.id === id);
}
