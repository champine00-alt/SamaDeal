import { Category, Listing, Seller } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_marketplace_senegal_1794384364731.jpg';
export const IPHONE_IMAGE = '/src/assets/images/item_iphone_smartphone_1794384365019.jpg';
export const BOUBOU_IMAGE = '/src/assets/images/item_boubou_fashion_1794384366036.jpg';
export const SCOOTER_IMAGE = '/src/assets/images/item_scooter_moto_1794384365790.jpg';

export const SENEGAL_CITIES = [
  'Toutes les villes',
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Mbour & Saly',
  'Touba',
  'Ziguinchor',
  'Kaolack',
  'Rufisque'
];

export const DAKAR_NEIGHBORHOODS = [
  'Tous les quartiers',
  'Almadies',
  'Plateau',
  'Mermoz',
  'Sacré-Cœur',
  'Ouakam',
  'Yoff',
  'Ngor',
  'Médina',
  'Fann Résidence',
  'Liberté 6',
  'Parcelles Assainies',
  'Grand Yoff',
  'Pikine',
  'Guédiawaye',
  'Hann Maristes'
];

export const CATEGORIES: Category[] = [
  {
    id: 'telephones-electronique',
    name: 'Téléphones & Tablettes',
    iconName: 'Smartphone',
    description: 'Smartphones, tablettes, écouteurs et montres connectées',
    itemCount: 428
  },
  {
    id: 'vetements-chaussures',
    name: 'Vêtements & Mode',
    iconName: 'Shirt',
    description: 'Boubous traditionnels, robes, baskets, sacs et prêt-à-porter',
    itemCount: 612
  },
  {
    id: 'informatique',
    name: 'Ordinateurs & Tech',
    iconName: 'Laptop',
    description: 'PC portables, MacBooks, écrans, claviers et accessoires',
    itemCount: 284
  },
  {
    id: 'electromenager',
    name: 'Électroménager',
    iconName: 'Refrigerator',
    description: 'Réfrigérateurs, climatiseurs, mixeurs, machines à laver',
    itemCount: 319
  },
  {
    id: 'meubles-decoration',
    name: 'Maison & Mobilier',
    iconName: 'Armchair',
    description: 'Canapés, lits, tables à manger, tapis et luminaires',
    itemCount: 247
  },
  {
    id: 'vehicules',
    name: 'Véhicules & Motos',
    iconName: 'Car',
    description: 'Voitures occasion, scooters, motos et vélos à Dakar',
    itemCount: 195
  },
  {
    id: 'livres-loisirs',
    name: 'Livres & Loisirs',
    iconName: 'BookOpen',
    description: 'Romans, manuels scolaires UCAD, sport et jeux vidéo',
    itemCount: 163
  }
];

export const SUPER_ADMIN_EMAIL = 'champine00@gmail.com';

export const ADMIN_USER: Seller = {
  id: 'admin_champine',
  name: 'Administrateur SamaDeal',
  email: SUPER_ADMIN_EMAIL,
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  phone: '+221 77 000 00 00',
  whatsapp: '221770000000',
  city: 'Dakar (Plateau)',
  rating: 5.0,
  reviewCount: 99,
  memberSince: 'Fondateur',
  emailVerified: true,
  whatsappVerified: true,
  responseTime: '< 1 min',
  totalSales: 120
};

export const CURRENT_USER: Seller = {
  id: 'user_current',
  name: 'Aminata Sall',
  email: 'aminata.sall@gmail.com',
  password: 'password123',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  phone: '+221 77 452 89 12',
  whatsapp: '221774528912',
  city: 'Dakar',
  neighborhood: 'Mermoz',
  rating: 4.9,
  reviewCount: 14,
  memberSince: 'Mars 2024',
  emailVerified: true,
  whatsappVerified: true,
  twoFactorEnabled: false,
  responseTime: '< 15 min',
  totalSales: 8
};

export const DEFAULT_PLATFORM_SETTINGS = {
  escrowFeePercent: 1.5,
  boostPriceFCFA: 1500,
  maintenanceMode: false,
  autoApproveListings: true
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user_current',
    title: 'Nouvelle offre reçue !',
    message: 'Moussa Ndiaye a proposé 270 000 FCFA pour votre annonce.',
    timestamp: 'Il y a 10 min',
    isRead: false,
    type: 'offer' as const
  },
  {
    id: 'notif-2',
    userId: 'user_current',
    title: 'Paiement sous séquestre sécurisé',
    message: 'Votre commande "Smart TV Samsung" est garantie par SamaDeal.',
    timestamp: 'Hier à 14:10',
    isRead: true,
    type: 'payment' as const
  },
  {
    id: 'notif-3',
    userId: 'user_current',
    title: 'Annonce validée',
    message: 'Votre article est en ligne et visible partout au Sénégal.',
    timestamp: 'Il y a 2 jours',
    isRead: true,
    type: 'listing' as const
  }
];

export const INITIAL_SELLERS: Record<string, Seller> = {
  moussa: {
    id: 'seller_moussa',
    name: 'Moussa Ndiaye',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    phone: '+221 77 123 45 67',
    whatsapp: '221771234567',
    city: 'Dakar (Almadies)',
    rating: 4.95,
    reviewCount: 38,
    memberSince: 'Janvier 2023',
    emailVerified: true,
    whatsappVerified: true,
    responseTime: '< 10 min',
    totalSales: 29
  },
  aissatou: {
    id: 'seller_aissatou',
    name: 'Aïssatou Sow',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80',
    phone: '+221 78 890 12 34',
    whatsapp: '221788901234',
    city: 'Dakar (Sacré-Cœur)',
    rating: 5.0,
    reviewCount: 22,
    memberSince: 'Novembre 2023',
    emailVerified: true,
    whatsappVerified: true,
    responseTime: '< 5 min',
    totalSales: 19
  },
  cheikh: {
    id: 'seller_cheikh',
    name: 'Cheikh Tidiane Bâ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    phone: '+221 76 345 67 89',
    whatsapp: '221763456789',
    city: 'Thiès (Cité Lamy)',
    rating: 4.8,
    reviewCount: 17,
    memberSince: 'Février 2024',
    emailVerified: true,
    whatsappVerified: true,
    responseTime: '< 30 min',
    totalSales: 11
  },
  ibrahima: {
    id: 'seller_ibrahima',
    name: 'Ibrahima Diallo',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    phone: '+221 70 987 65 43',
    whatsapp: '221709876543',
    city: 'Dakar (Ouakam)',
    rating: 4.7,
    reviewCount: 9,
    memberSince: 'Mai 2024',
    emailVerified: false,
    whatsappVerified: false,
    responseTime: '< 1 heure',
    totalSales: 5
  }
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'deal-001',
    title: 'iPhone 13 128 Go Minuit avec boîte d\'origine',
    description: 'iPhone 13 en parfait état, batterie à 91%, toujours protégé avec verre trempé et coque rigide. Vendu avec sa boîte d\'origine, câble USB-C vers Lightning et 2 coques de protection offertes. Aucun choc, débloqué tout opérateur (Orange, Free, Expresso). Essai possible sur place à Dakar.',
    price: 285000,
    originalPrice: 320000,
    currency: 'FCFA',
    category: 'telephones-electronique',
    condition: 'Comme neuf',
    images: [
      IPHONE_IMAGE,
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Dakar',
    neighborhood: 'Almadies',
    sellerId: INITIAL_SELLERS.moussa.id,
    seller: INITIAL_SELLERS.moussa,
    isNegotiable: true,
    hasDelivery: true,
    deliveryFee: 2000,
    isFeatured: true,
    status: 'active',
    createdAt: 'Il y a 2 heures',
    viewsCount: 142,
    favoritesCount: 28
  },
  {
    id: 'deal-002',
    title: 'Grand Boubou sénégalais brodé fil d\'or sur mesure',
    description: 'Magnifique boubou de fête 3 pièces en basin riche bleu roi avec broderies raffinées au fil d\'or faites par un maître tailleur à Dakar. Porté une seule fois pour une cérémonie de mariage. Tissu lourd de grande valeur, taille L / XL. Idéal pour Tabaski, Korité ou cérémonies.',
    price: 45000,
    originalPrice: 75000,
    currency: 'FCFA',
    category: 'vetements-chaussures',
    condition: 'Comme neuf',
    images: [
      BOUBOU_IMAGE
    ],
    city: 'Dakar',
    neighborhood: 'Sacré-Cœur',
    sellerId: INITIAL_SELLERS.aissatou.id,
    seller: INITIAL_SELLERS.aissatou,
    isNegotiable: false,
    hasDelivery: true,
    deliveryFee: 1500,
    isFeatured: true,
    status: 'active',
    createdAt: 'Il y a 5 heures',
    viewsCount: 230,
    favoritesCount: 45
  },
  {
    id: 'deal-003',
    title: 'Scooter urbain électrique NIU MQi+ Sport (Carte grise OK)',
    description: 'Scooter électrique moderne et très économique pour circuler rapidement à Dakar sans embouteillages. Autonomie réelle 65 km par charge complète (se recharge sur n\'importe quelle prise domestique en 4h). Batterie amovible Panasonic. Vendu avec chargeur rapide, rétroviseurs et top-case. Papiers en règle.',
    price: 420000,
    originalPrice: 550000,
    currency: 'FCFA',
    category: 'vehicules',
    condition: 'Très bon état',
    images: [
      SCOOTER_IMAGE
    ],
    city: 'Dakar',
    neighborhood: 'Mermoz',
    sellerId: INITIAL_SELLERS.moussa.id,
    seller: INITIAL_SELLERS.moussa,
    isNegotiable: true,
    hasDelivery: false,
    isFeatured: true,
    isUrgent: true,
    status: 'active',
    createdAt: 'Hier à 16:30',
    viewsCount: 388,
    favoritesCount: 52
  },
  {
    id: 'deal-004',
    title: 'MacBook Air M1 256 Go Gris Sidéral - Clavier AZERTY',
    description: 'MacBook Air puce Apple Silicon M1, 8 Go de RAM unifiée, 256 Go SSD. Clavier AZERTY français d\'origine. Idéal pour étudiant, télétravail ou développeur. Batterie à 94% de santé. Vendu avec chargeur Apple 30W d\'origine et housse de transport.',
    price: 460000,
    originalPrice: 510000,
    currency: 'FCFA',
    category: 'informatique',
    condition: 'Très bon état',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Dakar',
    neighborhood: 'Plateau',
    sellerId: INITIAL_SELLERS.ibrahima.id,
    seller: INITIAL_SELLERS.ibrahima,
    isNegotiable: true,
    hasDelivery: true,
    deliveryFee: 2000,
    isFeatured: false,
    status: 'active',
    createdAt: 'Il y a 1 jour',
    viewsCount: 195,
    favoritesCount: 34
  },
  {
    id: 'deal-005',
    title: 'Canapé d\'angle modulable 5 places en tissu antitache gris',
    description: 'Canapé d\'angle très confortable, mousse haute résilience 35 kg/m3. Pieds en bois verni. Tissu lavable et antitache parfait pour salon familial. Vendu cause déménagement. Possibilité de venir le tester à Mermoz.',
    price: 175000,
    originalPrice: 240000,
    currency: 'FCFA',
    category: 'meubles-decoration',
    condition: 'Bon état',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Dakar',
    neighborhood: 'Mermoz',
    sellerId: INITIAL_SELLERS.aissatou.id,
    seller: INITIAL_SELLERS.aissatou,
    isNegotiable: true,
    hasDelivery: false,
    isFeatured: false,
    status: 'active',
    createdAt: 'Il y a 2 jours',
    viewsCount: 160,
    favoritesCount: 19
  },
  {
    id: 'deal-006',
    title: 'Réfrigérateur No-Frost Samsung 340L Inox Silver',
    description: 'Grand réfrigérateur congélateur Samsung à froid ventilé No-Frost (jamais de givre à dégivrer). Moteur Digital Inverter silencieux et économique en électricité. Fonctionne impeccablement malgré les variations de tension. Compartiment fraîcheur pour fruits et légumes.',
    price: 155000,
    originalPrice: 210000,
    currency: 'FCFA',
    category: 'electromenager',
    condition: 'Très bon état',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Thiès',
    neighborhood: 'Cité Lamy',
    sellerId: INITIAL_SELLERS.cheikh.id,
    seller: INITIAL_SELLERS.cheikh,
    isNegotiable: true,
    hasDelivery: true,
    deliveryFee: 5000,
    isFeatured: false,
    status: 'active',
    createdAt: 'Il y a 2 jours',
    viewsCount: 145,
    favoritesCount: 22
  },
  {
    id: 'deal-007',
    title: 'Smart TV Samsung Crystal UHD 55 pouces 4K HDR',
    description: 'Téléviseur connecté Samsung 55" (140 cm) Ultra HD 4K avec télécommande intelligente. Applications intégrées : YouTube, Netflix, Prime Video, IPTV, Canal+. Image lumineuse et nette, son puissant. Vendu avec son pied d\'origine et son câble secteur.',
    price: 195000,
    originalPrice: 260000,
    currency: 'FCFA',
    category: 'telephones-electronique',
    condition: 'Comme neuf',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Dakar',
    neighborhood: 'Ouakam',
    sellerId: INITIAL_SELLERS.ibrahima.id,
    seller: INITIAL_SELLERS.ibrahima,
    isNegotiable: false,
    hasDelivery: true,
    deliveryFee: 3000,
    isFeatured: false,
    status: 'active',
    createdAt: 'Il y a 3 jours',
    viewsCount: 310,
    favoritesCount: 41
  },
  {
    id: 'deal-008',
    title: 'Lot de 8 romans africains & manuels de droit UCAD',
    description: 'Collection d\'ouvrages littéraires classiques : Une si longue lettre de Mariama Bâ, L\'Aventure ambiguë de Cheikh Hamidou Kane, Les Bouts de bois de Dieu d\'Ousmane Sembène, plus 4 manuels de méthodologie juridique de licence. Tous en très bon état, pages non surlignées.',
    price: 15000,
    originalPrice: 32000,
    currency: 'FCFA',
    category: 'livres-loisirs',
    condition: 'Très bon état',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Dakar',
    neighborhood: 'Médina',
    sellerId: INITIAL_SELLERS.cheikh.id,
    seller: INITIAL_SELLERS.cheikh,
    isNegotiable: false,
    hasDelivery: true,
    deliveryFee: 1000,
    isFeatured: false,
    status: 'active',
    createdAt: 'Il y a 4 jours',
    viewsCount: 88,
    favoritesCount: 15
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-001',
    listingId: 'deal-001',
    listingTitle: 'iPhone 13 128 Go Minuit avec boîte',
    listingPrice: 285000,
    listingImage: IPHONE_IMAGE,
    sellerId: INITIAL_SELLERS.moussa.id,
    sellerName: 'Moussa Ndiaye',
    buyerId: CURRENT_USER.id,
    buyerName: CURRENT_USER.name,
    lastMessage: 'D\'accord pour 270 000 FCFA avec remise en main propre aux Almadies !',
    lastMessageTime: '10:42',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.name,
        text: 'Bonjour Moussa, l\'iPhone 13 est toujours disponible ?',
        timestamp: 'Hier 19:15'
      },
      {
        id: 'm2',
        senderId: INITIAL_SELLERS.moussa.id,
        senderName: 'Moussa Ndiaye',
        text: 'Bonjour Aminata ! Oui, il est disponible et prêt à être testé.',
        timestamp: 'Hier 19:18'
      },
      {
        id: 'm3',
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.name,
        text: 'Je vous propose 270 000 FCFA payables immédiatement par Wave ou en espèces.',
        timestamp: 'Hier 19:22',
        isOffer: true,
        offerAmount: 270000,
        offerStatus: 'accepted'
      },
      {
        id: 'm4',
        senderId: INITIAL_SELLERS.moussa.id,
        senderName: 'Moussa Ndiaye',
        text: 'D\'accord pour 270 000 FCFA avec remise en main propre aux Almadies ! Tu es dispo vers quelle heure ?',
        timestamp: '10:42'
      }
    ]
  }
];
