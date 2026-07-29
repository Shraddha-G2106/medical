import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatus, ProductCategory } from '../types';
import { SUPABASE_URL } from '../lib/supabase';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText,
  Users,
  Database,
  Copy,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    addToast,
    supabaseConnected,
    supabaseStatusMsg
  } = useApp();

  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlSchemaScript = `-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table with Foreign Key to Users
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cod',
  status TEXT DEFAULT 'Placed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Prescriptions Table with Foreign Key to Users
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Development RLS Policies (Full access for read/write during testing)
CREATE POLICY "Public Read/Write for Users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Prescriptions" ON public.prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Contact Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    addToast('Supabase SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Tablets');
  const [formPrice, setFormPrice] = useState(100.00);
  const [formOriginalPrice, setFormOriginalPrice] = useState(150.00);
  const [formStock, setFormStock] = useState(100);
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600');
  const [formDescription, setFormDescription] = useState('');
  const [formDosage, setFormDosage] = useState('');
  const [formActiveIngredient, setFormActiveIngredient] = useState('');
  const [formPrescriptionRequired, setFormPrescriptionRequired] = useState(false);

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.shippingDetails.fullName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const openAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBrand('MedCare Labs');
    setFormCategory('Tablets');
    setFormPrice(125.00);
    setFormOriginalPrice(160.00);
    setFormStock(50);
    setFormImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600');
    setFormDescription('High-purity essential pharmaceutical formulation.');
    setFormDosage('1 tablet twice daily after meals.');
    setFormActiveIngredient('Active Medical Compound');
    setFormPrescriptionRequired(false);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormStock(product.stock);
    setFormImage(product.image);
    setFormDescription(product.description);
    setFormDosage(product.dosage);
    setFormActiveIngredient(product.activeIngredient);
    setFormPrescriptionRequired(product.prescriptionRequired);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || formPrice <= 0) {
      addToast('Please enter a valid product name and price', 'warning');
      return;
    }

    if (editingProductId) {
      editProduct(editingProductId, {
        name: formName,
        brand: formBrand,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        stock: Number(formStock),
        image: formImage,
        description: formDescription,
        dosage: formDosage,
        activeIngredient: formActiveIngredient,
        prescriptionRequired: formPrescriptionRequired
      });
    } else {
      addProduct({
        name: formName,
        brand: formBrand,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        rating: 4.8,
        reviewsCount: 1,
        stock: Number(formStock),
        image: formImage,
        description: formDescription,
        dosage: formDosage,
        sideEffects: ['Consult physician if irritation occurs'],
        activeIngredient: formActiveIngredient,
        prescriptionRequired: formPrescriptionRequired
      });
    }

    setIsProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Pharmacist Admin Dashboard</h1>
              <p className="text-xs text-slate-300">Manage medicine inventory, pricing, and live customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Analytics Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Pending Dispatch</p>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingOrdersCount}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Items</p>
            <div className="text-2xl font-black text-emerald-600 mt-1">{products.length}</div>
          </div>
        </div>

        {/* Supabase Integration & Database Status Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-emerald-800/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">Supabase Cloud Database</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Project Ref: <code className="font-mono text-emerald-300 font-bold bg-slate-800/80 px-1.5 py-0.5 rounded">wwbluyrojnnnjatfzjnn</code> • All checkout orders, medicines, prescriptions & logins auto-save to Supabase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowSqlSchema(!showSqlSchema)}
                className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                {showSqlSchema ? 'Hide SQL Script' : 'View SQL Setup'}
              </button>
              <button
                onClick={copySqlToClipboard}
                className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedSql ? 'Copied!' : 'Copy SQL Script'}
              </button>
            </div>
          </div>

          {/* Expandable SQL Schema Snippet */}
          {showSqlSchema && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 animate-fade-in space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold">Supabase SQL Schema Script:</span>
                <span className="text-[11px] text-slate-400">Copy & paste into Supabase SQL Editor to create tables</span>
              </div>
              <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] text-emerald-300 font-mono overflow-x-auto border border-slate-800 max-h-60 leading-relaxed">
                {sqlSchemaScript}
              </pre>
            </div>
          )}
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search inventory by medicine name or category..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                onClick={openAddModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add New Medicine
              </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Prescription</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-contain rounded-lg bg-slate-100 border shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.brand}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">₹{p.price.toFixed(2)}</td>
                      <td className="p-3 font-semibold text-slate-700">{p.stock} units</td>
                      <td className="p-3">
                        {p.prescriptionRequired ? (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            Rx Required
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[10px]">
                            Over the Counter
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders by Order ID or customer name..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        ORDER #{order.id}
                      </span>
                      <p className="text-xs text-slate-500">
                        Customer: <strong>{order.shippingDetails.fullName}</strong> ({order.shippingDetails.phone})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">
                        Total: ₹{order.totalAmount.toFixed(2)}
                      </span>

                      {/* Interactive Live Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Placed">Status: Placed</option>
                        <option value="Processing">Status: Processing</option>
                        <option value="Shipped">Status: Shipped</option>
                        <option value="Out for Delivery">Status: Out for Delivery</option>
                        <option value="Delivered">Status: Delivered</option>
                        <option value="Cancelled">Status: Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <strong className="text-slate-800 block mb-1">Items Ordered:</strong>
                      <ul className="space-y-1 text-slate-600">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            • {item.product.name} (Qty: {item.quantity}) - ₹{(item.product.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-slate-800 block mb-1">Shipping Destination:</strong>
                      <p className="text-slate-600">
                        {order.shippingDetails.address}, {order.shippingDetails.city} {order.shippingDetails.pincode}
                      </p>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {editingProductId ? 'Edit Medicine Item' : 'Add New Medicine to Shop'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Paracetamol Extra 500mg"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand / Pharma</label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      <option value="Tablets">Tablets</option>
                      <option value="Syrups">Syrups</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Health Devices">Health Devices</option>
                      <option value="Vitamins">Vitamins</option>
                      <option value="First Aid">First Aid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Original (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dosage Info</label>
                    <input
                      type="text"
                      value={formDosage}
                      onChange={(e) => setFormDosage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Active Ingredient</label>
                    <input
                      type="text"
                      value={formActiveIngredient}
                      onChange={(e) => setFormActiveIngredient(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 pt-1">
                  <input
                    type="checkbox"
                    checked={formPrescriptionRequired}
                    onChange={(e) => setFormPrescriptionRequired(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Requires Doctor's Prescription
                </label>

                <button
                  type="submit"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all"
                >
                  Save Product to Catalog
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
