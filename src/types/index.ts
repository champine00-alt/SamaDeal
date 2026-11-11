export type Condition = 'Comme neuf' | 'Très bon état' | 'Bon état' | 'État correct' | 'Pour pièces';

export type CategoryId = 
  | 'telephones-electronique'
  | 'vetements-chaussures'
  | 'meubles-decoration'
  | 'electromenager'
  | 'vehicules'
  | 'livres-loisirs'
  | 'informatique';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export interface Seller {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  password?: string;
  role?: 'acheteur' | 'vendeur' | 'admin' | 'user';
  avatar: string;
  phone: string;
  whatsapp: string;
  city: string;
  neighborhood?: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
  emailVerified: boolean;
  whatsappVerified: boolean;
  twoFactorEnabled?: boolean;
  responseTime: string;
  totalSales: number;
  salesCount?: number;
  activeListingsCount?: number;
  badge?: string;
  responseRate?: string;
  isBlocked?: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  timestamp?: string;
  date?: string;
  isRead?: boolean;
  read?: boolean;
  type: 'offer' | 'message' | 'payment' | 'listing' | 'security' | 'account' | 'escrow';
  actionUrl?: string;
}

export interface PlatformSettings {
  escrowFeePercent: number;
  boostPriceFCFA: number;
  maintenanceMode: boolean;
  autoApproveListings: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // in FCFA (XOF)
  originalPrice?: number;
  currency: string;
  category: CategoryId;
  condition: Condition;
  images: string[];
  city: string;
  neighborhood: string;
  sellerId: string;
  seller: Seller;
  isNegotiable: boolean;
  hasDelivery: boolean;
  deliveryFee?: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  status: 'active' | 'pending' | 'reserved' | 'sold';
  createdAt: string;
  viewsCount: number;
  favoritesCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface EscrowPayment {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  fee: number;
  total: number;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  paymentMethod: 'wave' | 'orange_money';
  status: 'pending_escrow' | 'in_escrow' | 'delivered' | 'refunded';
  createdAt: string;
  deliveryType: 'hand_delivery' | 'courier';
}

export interface ReportItem {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details: string;
  reporterEmail?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
