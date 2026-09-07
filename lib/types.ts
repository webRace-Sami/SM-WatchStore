export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface SafeUser {
  id: string;
  username: string;
  email?: string | null;
  role: UserRole;
  fullName: string;
  phone: string;
  secondaryPhone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  createdAt: string;
}

export type ImageSourceType = 'google' | 'upload' | 'preset';

export interface WatchImage {
  url: string;
  source: ImageSourceType;
  alt?: string;
  isPrimary?: boolean;
}

export interface Watch {
  id: string;
  title: string;
  brand: string;
  model: string;
  sku: string;
  price: number;
  discountPrice?: number | null;
  stockCount: number;
  isAvailable: boolean;
  category: string;
  movement: string;
  caseDiameter?: string | null;
  dialColor?: string | null;
  strapMaterial?: string | null;
  waterResistance?: string | null;
  description: string;
  features: string[];
  images: WatchImage[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  watch: Watch;
  quantity: number;
}

export type PaymentType = 'FULL' | 'HALF';
export type PaymentStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'COURIER_ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  watchId?: string | null;
  watchTitle: string;
  watchImage?: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  city: string;
  postalCode?: string | null;
  subtotal: number;
  taxAmount: number;
  courierFee: number;
  courierDiscount: number;
  totalAmount: number;
  paymentType: PaymentType;
  advancePaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string | null;
  paymentNotes?: string | null;
  courierServiceName?: string | null;
  courierTrackingNumber?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: SafeUser | null;
}

export interface BankAccountItem {
  type: 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Raast';
  title: string;
  accountNumber: string;
  accountName: string;
  bankName?: string;
  iban?: string;
  qrCodeUrl?: string;
}

export interface StoreSettings {
  id: string;
  companyName: string;
  brandTagline: string;
  logoUrl?: string | null;
  contactPhone: string;
  whatsappNumber: string;
  officialEmail: string;
  physicalAddress: string;
  city: string;
  googleMapsUrl: string;
  isOpen: boolean;
  openingHoursText: string;
  gstTaxPercentage: number;
  baseCourierPrice: number;
  courierDiscountTier1Min: number;
  courierDiscountTier1Rate: number;
  courierDiscountTier2Min: number;
  courierDiscountTier2Rate: number;
  bankDetails: BankAccountItem[];
  strictReturnPolicy: string;
  noCodNotice: string;
  announcementBanner?: string | null;
  updatedAt: string;
}

export interface CourierCalculationResult {
  baseFee: number;
  discountRate: number; // e.g. 0, 50, 100
  discountAmount: number;
  finalCourierFee: number;
  isDiscountTier1: boolean; // > 25,000 (50% off)
  isDiscountTier2: boolean; // >= 50,000 (100% free)
  amountNeededForNextTier: number;
  nextTierDiscount: number;
  message: string;
}
