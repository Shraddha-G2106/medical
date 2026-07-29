import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  User, 
  Toast, 
  PageType, 
  ProductCategory, 
  OrderStatus 
} from '../types';
import { INITIAL_PRODUCTS, SAMPLE_INITIAL_ORDER } from '../data/initialData';
import { 
  syncOrderToSupabase, 
  syncProductToSupabase, 
  syncUserToSupabase, 
  checkSupabaseConnection, 
  SUPABASE_URL 
} from '../lib/supabase';
import {
  fetchProducts,
  fetchOrders,
  subscribeToOrders,
  subscribeToProducts
} from '../services/api';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  currentUser: User | null;
  toasts: Toast[];
  currentPage: PageType;
  selectedProductId: string | null;
  activeTrackingOrderId: string | null;
  searchQuery: string;
  selectedCategory: ProductCategory | 'All';
  isAuthModalOpen: boolean;
  isPrescriptionModalOpen: boolean;
  quickViewProduct: Product | null;
  supabaseConnected: boolean;
  supabaseStatusMsg: string;
  
  // Setters & Actions
  setCurrentPage: (page: PageType) => void;
  setSelectedProductId: (id: string | null) => void;
  setActiveTrackingOrderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsPrescriptionModalOpen: (open: boolean) => void;
  setQuickViewProduct: (prod: Product | null) => void;

  // Cart
  addToCart: (product: Product, quantity?: number, prescriptionFileName?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTotalItems: () => number;

  // Wishlist
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Toasts
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Orders
  placeOrder: (
    shippingDetails: Order['shippingDetails'], 
    paymentMethod: Order['paymentMethod'], 
    prescriptionFileName?: string
  ) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Products (Admin Actions)
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Auth
  login: (email: string, role: 'user' | 'admin', name?: string) => void;
  logout: () => void;
  navigateTo: (page: PageType, productId?: string, orderId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistence state loaders
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('medcare_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('medcare_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('medcare_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('medcare_orders');
    return saved ? JSON.parse(saved) : [SAMPLE_INITIAL_ORDER];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medcare_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      role: 'user',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield'
    };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('MC-84920');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<string>('Connecting to Supabase...');

  // Check Supabase connection & fetch initial database tables on mount
  useEffect(() => {
    checkSupabaseConnection().then((res) => {
      setSupabaseConnected(res.connected);
      setSupabaseStatusMsg(res.message);
    });

    // Load initial products from Supabase
    fetchProducts().then((remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setProducts(remoteProds);
      }
    });

    // Load initial orders from Supabase
    fetchOrders().then((remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders((prev) => {
          const merged = [...remoteOrders];
          // Keep existing local sample if not present
          prev.forEach((localOrd) => {
            if (!merged.some((m) => m.id === localOrd.id)) {
              merged.push(localOrd);
            }
          });
          return merged;
        });
      }
    });

    // Set up real-time subscriptions
    const unsubOrders = subscribeToOrders(() => {
      fetchOrders().then((remote) => {
        if (remote && remote.length > 0) setOrders(remote);
      });
    });

    const unsubProducts = subscribeToProducts(() => {
      fetchProducts().then((remote) => {
        if (remote && remote.length > 0) setProducts(remote);
      });
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('medcare_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('medcare_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('medcare_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('medcare_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('medcare_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('medcare_user');
    }
  }, [currentUser]);

  // Toast handler
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, prescriptionFileName?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (prescriptionFileName) {
          updated[existingIndex].prescriptionUploaded = true;
          updated[existingIndex].prescriptionFileName = prescriptionFileName;
        }
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            prescriptionUploaded: !!prescriptionFileName,
            prescriptionFileName
          }
        ];
      }
    });
    addToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast(`Removed "${product.name}" from Wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast(`Saved "${product.name}" to Wishlist`, 'success');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Order Operations
  const placeOrder = (
    shippingDetails: Order['shippingDetails'],
    paymentMethod: Order['paymentMethod'],
    prescriptionFileName?: string
  ): Order => {
    const subtotal = getCartSubtotal();
    const discountAmount = subtotal > 500 ? subtotal * 0.1 : 0; // 10% discount over ₹500
    const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

    const newOrderId = 'MC-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: newOrderId,
      items: [...cart],
      shippingDetails,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending on Delivery' : 'Paid',
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
      orderDate: dateStr,
      estimatedDelivery: 'Tomorrow by 5:00 PM',
      status: 'Placed',
      prescriptionUploaded: !!prescriptionFileName,
      prescriptionFileName,
      trackingHistory: [
        {
          status: 'Placed',
          timestamp: dateStr,
          location: 'MedCare Online Portal',
          note: 'Order successfully placed. Verification in progress.',
          completed: true
        },
        {
          status: 'Processing',
          timestamp: 'Pending Pharmacist Review',
          location: 'Central Pharmacy Hub',
          note: 'Verification and packing pending.',
          completed: false
        },
        {
          status: 'Shipped',
          timestamp: 'Pending Transport',
          location: 'Logistics Center',
          note: 'Awaiting cold-pack dispatch.',
          completed: false
        },
        {
          status: 'Out for Delivery',
          timestamp: 'Pending Delivery Agent',
          location: 'Local Delivery Hub',
          note: 'Awaiting dispatch to destination.',
          completed: false
        },
        {
          status: 'Delivered',
          timestamp: 'Pending Delivery',
          location: 'Destination Address',
          note: 'Pending final signoff.',
          completed: false
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrderId(newOrderId);
    addToast(`Order #${newOrderId} placed & saved to Supabase!`, 'success');

    // Sync order to Supabase database
    syncOrderToSupabase(newOrder);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedHistory = ord.trackingHistory.map((step) => {
          if (step.status === newStatus) {
            return {
              ...step,
              completed: true,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
          }
          return step;
        });

        const updatedOrd = {
          ...ord,
          status: newStatus,
          trackingHistory: updatedHistory
        };

        syncOrderToSupabase(updatedOrd);
        return updatedOrd;
      })
    );
    addToast(`Order #${orderId} status updated to ${newStatus}`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase().trim());
  };

  // Product Admin Operations
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const id = 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 1000);
    const newProduct: Product = { ...productData, id };
    setProducts((prev) => [newProduct, ...prev]);
    
    // Sync to Supabase catalog
    syncProductToSupabase(newProduct);

    addToast(`Product "${productData.name}" saved to catalog & Supabase!`, 'success');
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updatedProd = { ...prod, ...updated };
          syncProductToSupabase(updatedProd);
          return updatedProd;
        }
        return prod;
      })
    );
    addToast(`Product updated & synced with Supabase`, 'info');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (prod) {
      addToast(`Deleted "${prod.name}"`, 'warning');
    }
  };

  // Auth Operations
  const login = (email: string, role: 'user' | 'admin', name = 'Customer') => {
    const newUser: User = {
      id: role === 'admin' ? 'admin-1' : 'usr-' + Date.now(),
      name: role === 'admin' ? 'Pharmacist Admin' : name,
      email,
      role,
      phone: '+1 (555) 987-6543',
      address: '123 Medical Center Way'
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Sync User record to Supabase
    syncUserToSupabase(newUser);

    addToast(`Logged in as ${role === 'admin' ? 'Administrator' : newUser.name}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully', 'info');
  };

  const navigateTo = (page: PageType, productId?: string, orderId?: string) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    if (orderId) setActiveTrackingOrderId(orderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currentUser,
        toasts,
        currentPage,
        selectedProductId,
        activeTrackingOrderId,
        searchQuery,
        selectedCategory,
        isAuthModalOpen,
        isPrescriptionModalOpen,
        quickViewProduct,
        supabaseConnected,
        supabaseStatusMsg,

        setCurrentPage,
        setSelectedProductId,
        setActiveTrackingOrderId,
        setSearchQuery,
        setSelectedCategory,
        setIsAuthModalOpen,
        setIsPrescriptionModalOpen,
        setQuickViewProduct,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartTotalItems,

        toggleWishlist,
        isInWishlist,

        addToast,
        removeToast,

        placeOrder,
        updateOrderStatus,
        getOrderById,

        addProduct,
        editProduct,
        deleteProduct,

        login,
        logout,
        navigateTo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
