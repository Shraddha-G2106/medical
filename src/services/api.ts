import { supabase } from '../lib/supabase';
import { Product, Order, User } from '../types';

// 1. PRODUCTS API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) {
      return [];
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: Number(item.price),
      originalPrice: Number(item.original_price || item.price),
      rating: Number(item.rating || 4.5),
      reviewsCount: Number(item.reviews_count || 10),
      stock: Number(item.stock || 50),
      image: item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      description: item.description || '',
      dosage: item.dosage || '',
      prescriptionRequired: Boolean(item.prescription_required),
      sideEffects: Array.isArray(item.side_effects) ? item.side_effects : ['None reported'],
      activeIngredient: item.active_ingredient || '',
      isFeatured: Boolean(item.is_featured),
      isOffer: Boolean(item.is_offer),
      discountBadge: item.discount_badge,
      packSize: item.pack_size
    }));
  } catch (err) {
    console.warn('Error fetching products from Supabase:', err);
    return [];
  }
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
  const id = 'prod-' + Date.now();
  const newProduct: Product = { ...productData, id };
  
  try {
    const { error } = await supabase.from('products').insert([
      {
        id: newProduct.id,
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        rating: newProduct.rating,
        reviews_count: newProduct.reviewsCount,
        stock: newProduct.stock,
        image_url: newProduct.image,
        description: newProduct.description,
        dosage: newProduct.dosage,
        prescription_required: newProduct.prescriptionRequired,
        side_effects: newProduct.sideEffects,
        active_ingredient: newProduct.activeIngredient,
        is_featured: newProduct.isFeatured || false,
        is_offer: newProduct.isOffer || false,
        discount_badge: newProduct.discountBadge || null,
        pack_size: newProduct.packSize || null,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) console.warn('Supabase insert product notice:', error.message);
  } catch (err) {
    console.warn('Supabase product insert error:', err);
  }
  return newProduct;
};

export const updateProductInSupabase = async (id: string, updated: Partial<Product>) => {
  try {
    const payload: any = {};
    if (updated.name !== undefined) payload.name = updated.name;
    if (updated.price !== undefined) payload.price = updated.price;
    if (updated.stock !== undefined) payload.stock = updated.stock;
    if (updated.category !== undefined) payload.category = updated.category;
    if (updated.brand !== undefined) payload.brand = updated.brand;

    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) console.warn('Supabase update product error:', error.message);
  } catch (err) {
    console.warn('Supabase update product exception:', err);
  }
};

export const deleteProductFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.warn('Supabase delete product error:', error.message);
  } catch (err) {
    console.warn('Supabase delete product exception:', err);
  }
};

// 2. ORDERS API
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.order_id,
      items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
      shippingDetails: {
        fullName: item.customer_name || 'Customer',
        email: item.customer_email || 'customer@example.com',
        phone: item.customer_phone || '',
        address: item.shipping_address || '',
        city: '',
        state: '',
        pincode: ''
      },
      paymentMethod: item.payment_method || 'cod',
      paymentStatus: item.payment_status || 'Paid',
      subtotal: Number(item.subtotal || 0),
      discountAmount: Number(item.discount_amount || 0),
      deliveryFee: Number(item.delivery_fee || 0),
      totalAmount: Number(item.total_amount || 0),
      prescriptionUploaded: Boolean(item.prescription_uploaded),
      prescriptionFileName: item.prescription_file_name,
      status: item.status || 'Placed',
      orderDate: item.order_date || new Date().toISOString().split('T')[0],
      estimatedDelivery: 'Today within 2 Hours',
      trackingHistory: []
    }));
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err);
    return [];
  }
};

export const createOrderInSupabase = async (order: Order) => {
  try {
    const { error } = await supabase.from('orders').insert([
      {
        order_id: order.id,
        items: JSON.stringify(order.items),
        customer_name: order.shippingDetails.fullName,
        customer_email: order.shippingDetails.email,
        customer_phone: order.shippingDetails.phone,
        shipping_address: `${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.pincode}`,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        subtotal: order.subtotal,
        discount_amount: order.discountAmount,
        delivery_fee: order.deliveryFee,
        total_amount: order.totalAmount,
        prescription_uploaded: order.prescriptionUploaded || false,
        prescription_file_name: order.prescriptionFileName || null,
        status: order.status,
        order_date: order.orderDate,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) console.warn('Supabase create order notice:', error.message);
  } catch (err) {
    console.warn('Supabase create order exception:', err);
  }
};

// 3. PRESCRIPTION UPLOAD SERVICE
export const uploadPrescription = async (file: File | null, patientName: string, doctorName: string, userEmail?: string) => {
  const fileName = file ? file.name : `prescription_${Date.now()}.pdf`;
  try {
    // If Supabase storage bucket 'prescriptions' exists, we can upload file, else save record in table
    if (file) {
      await supabase.storage.from('prescriptions').upload(`uploads/${Date.now()}_${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      }).catch((e) => console.log('Storage upload notice (bucket optional):', e.message));
    }

    const { error } = await supabase.from('prescriptions').insert([
      {
        file_name: `${fileName} (Patient: ${patientName || 'Guest'}, Doctor: ${doctorName || 'N/A'})`,
        user_email: userEmail || 'guest@medcare.com',
        uploaded_at: new Date().toISOString(),
        status: 'Pending Review'
      }
    ]);
    if (error) console.warn('Supabase prescription record notice:', error.message);
  } catch (err) {
    console.warn('Supabase prescription upload exception:', err);
  }
};

// 4. AUTH & USER SERVICE
export const loginUserInSupabase = async (email: string, name: string, role: 'user' | 'admin'): Promise<User> => {
  const userId = 'usr-' + Date.now();
  const user: User = {
    id: userId,
    name,
    email,
    role
  };

  try {
    await supabase.from('users').upsert([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        updated_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.warn('Supabase user upsert exception:', err);
  }

  return user;
};

// 5. REAL-TIME SUBSCRIPTIONS
export const subscribeToOrders = (onOrderChange: () => void) => {
  const channel = supabase
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      onOrderChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToProducts = (onProductChange: () => void) => {
  const channel = supabase
    .channel('public:products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      onProductChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// 6. CONTACT FORM SERVICE
export const submitContactMessage = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  try {
    const { error } = await supabase.from('contact_messages').insert([
      {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        subject: contactData.subject,
        message: contactData.message,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) console.warn('Supabase contact message error:', error.message);
    return { success: !error, error };
  } catch (err) {
    console.warn('Supabase contact message exception:', err);
    return { success: false, error: err };
  }
};
