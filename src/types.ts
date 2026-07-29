export type ProductCategory = 
  | 'Tablets'
  | 'Syrups'
  | 'Personal Care'
  | 'Health Devices'
  | 'Vitamins'
  | 'First Aid';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  image: string;
  description: string;
  dosage: string;
  prescriptionRequired: boolean;
  sideEffects: string[];
  activeIngredient: string;
  isFeatured?: boolean;
  isOffer?: boolean;
  discountBadge?: string;
  packSize?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  prescriptionUploaded?: boolean;
  prescriptionFileName?: string;
}

export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  location: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'cod' | 'card' | 'upi';
  paymentStatus: 'Paid' | 'Pending on Delivery';
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  orderDate: string;
  estimatedDelivery: string;
  status: OrderStatus;
  trackingHistory: TrackingStep[];
  prescriptionUploaded?: boolean;
  prescriptionFileName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface CustomerReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  productName?: string;
}

export type PageType = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'tracking' 
  | 'about' 
  | 'contact' 
  | 'admin' 
  | 'wishlist';
