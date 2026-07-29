import { createClient } from '@supabase/supabase-js';
import { Product, Order, User } from '../types';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://wwbluyrojnnnjatfzjnn.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0km21JsSI0ze0_jQ-X92Lg_cJfoku2_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { 
          connected: true, 
          message: 'Connected to Supabase! (Tables pending setup in SQL editor)' 
        };
      }
      return { 
        connected: true, 
        message: `Connected to Supabase (${error.message})` 
      };
    }
    return { connected: true, message: 'Connected & Synced with Supabase!' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection failed' };
  }
};

// Sync functions to persist medical forms and data to Supabase
export const syncProductToSupabase = async (product: Omit<Product, 'id'> | Product) => {
  try {
    const { data, error } = await supabase.from('products').upsert([
      {
        id: 'id' in product ? product.id : undefined,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        stock: product.stock,
        image_url: product.image,
        description: product.description,
        dosage: product.dosage,
        prescription_required: product.prescriptionRequired,
        side_effects: product.sideEffects,
        active_ingredient: product.activeIngredient,
        is_featured: product.isFeatured || false,
        is_offer: product.isOffer || false,
        discount_badge: product.discountBadge || null,
        pack_size: product.packSize || null,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn('Supabase product sync notice:', error.message);
    }
    return { success: !error, error };
  } catch (e: any) {
    console.warn('Supabase product sync exception:', e);
    return { success: false, error: e };
  }
};

export const syncOrderToSupabase = async (order: Order) => {
  try {
    const { data, error } = await supabase.from('orders').insert([
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

    if (error) {
      console.warn('Supabase order sync notice:', error.message);
    }
    return { success: !error, error };
  } catch (e: any) {
    console.warn('Supabase order sync exception:', e);
    return { success: false, error: e };
  }
};

export const syncPrescriptionToSupabase = async (fileData: {
  fileName: string;
  userEmail?: string;
  orderId?: string;
  uploadedAt: string;
}) => {
  try {
    const { data, error } = await supabase.from('prescriptions').insert([
      {
        file_name: fileData.fileName,
        user_email: fileData.userEmail || 'guest@medcare.com',
        order_id: fileData.orderId || null,
        uploaded_at: fileData.uploadedAt,
        status: 'Pending Verification'
      }
    ]);
    if (error) {
      console.warn('Supabase prescription sync notice:', error.message);
    }
    return { success: !error, error };
  } catch (e: any) {
    console.warn('Supabase prescription sync exception:', e);
    return { success: false, error: e };
  }
};

export const syncUserToSupabase = async (user: User) => {
  try {
    const { data, error } = await supabase.from('users').upsert([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        address: user.address || null,
        updated_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn('Supabase user sync notice:', error.message);
    }
    return { success: !error, error };
  } catch (e: any) {
    console.warn('Supabase user sync exception:', e);
    return { success: false, error: e };
  }
};

export const syncContactToSupabase = async (contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  try {
    const { data, error } = await supabase.from('contact_messages').insert([
      {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        subject: contact.subject,
        message: contact.message,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn('Supabase contact message sync notice:', error.message);
    }
    return { success: !error, error };
  } catch (e: any) {
    console.warn('Supabase contact message sync exception:', e);
    return { success: false, error: e };
  }
};
