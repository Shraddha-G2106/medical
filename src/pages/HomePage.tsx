import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { 
  ShieldCheck, 
  Truck, 
  Upload, 
  Search, 
  ArrowRight, 
  Clock, 
  Star, 
  Sparkles, 
  Pill, 
  Activity, 
  HeartPulse, 
  Sparkle,
  PhoneCall,
  CheckCircle2,
  FileText,
  BadgePercent
} from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/initialData';

export const HomePage: React.FC = () => {
  const { 
    products, 
    navigateTo, 
    setIsPrescriptionModalOpen, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const [activeCategoryTab, setActiveCategoryTab] = useState<ProductCategory | 'All'>('All');

  // Categories list
  const categories: { name: ProductCategory; icon: any; color: string; desc: string; count: number }[] = [
    { name: 'Tablets', icon: Pill, color: 'bg-blue-50 text-blue-600 border-blue-200', desc: 'Pain, Antibiotics, Fever', count: 280 },
    { name: 'Syrups', icon: HeartPulse, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', desc: 'Cough, Cold, Pediatric', count: 145 },
    { name: 'Personal Care', icon: Sparkle, color: 'bg-rose-50 text-rose-600 border-rose-200', desc: 'Skin, Hair & Hygiene', count: 310 },
    { name: 'Health Devices', icon: Activity, color: 'bg-purple-50 text-purple-600 border-purple-200', desc: 'BP Monitors, Oximeters', count: 85 },
    { name: 'Vitamins', icon: Sparkles, color: 'bg-amber-50 text-amber-600 border-amber-200', desc: 'Immunity & Energy', count: 190 },
    { name: 'First Aid', icon: ShieldCheck, color: 'bg-teal-50 text-teal-600 border-teal-200', desc: 'Bandages & Antiseptics', count: 110 }
  ];

  // Filter featured products
  const featuredProducts = products.filter((p) => p.isFeatured);
  const offerProducts = products.filter((p) => p.isOffer);

  const displayedProducts = activeCategoryTab === 'All'
    ? featuredProducts
    : products.filter((p) => p.category === activeCategoryTab);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white overflow-hidden py-16 lg:py-20">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Trusted Online Pharmacy <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  Genuine Care Delivered Fast.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Order 100% authentic medicines, healthcare monitors, vitamins, and skincare products online with instant doctor prescription upload and cold-pack shipping.
              </p>

              {/* Main Search Bar inside Hero */}
              <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto lg:mx-0 relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines by name, brand, or illness (e.g. Paracetamol)..."
                    className="w-full pl-12 pr-32 py-4 bg-white/95 text-slate-900 placeholder-slate-400 rounded-2xl text-xs sm:text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  Browse Medicine Shop
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all backdrop-blur-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Upload Prescription
                </button>
              </div>

              {/* Quick Guarantee Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-2 border-t border-white/10 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2-Hour Express</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Licensed Pharmacist</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                      Rx
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Need Medicine Consultation?</h4>
                      <p className="text-[11px] text-slate-300">Speak directly with our registered pharmacist</p>
                    </div>
                  </div>
                  <span className="bg-emerald-400 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    ONLINE
                  </span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Order Dispatch Status</span>
                    <span className="font-bold text-emerald-400">99.8% On-Time</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[98%]" />
                  </div>
                </div>

                {/* Hero featured mini pill card */}
                <div className="bg-white text-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200"
                    alt="BP Monitor"
                    className="w-14 h-14 object-cover rounded-xl bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      23% OFF DEAL
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 mt-0.5">Digital BP Monitor Kit</h5>
                    <p className="text-xs font-black text-slate-900">₹1,499.00 <span className="text-[10px] text-slate-400 line-through">₹1,950.00</span></p>
                  </div>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
              Healthcare Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Explore Popular Medicine Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              navigateTo('shop');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  navigateTo('shop');
                }}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center text-center group hover:-translate-y-1 hover:shadow-lg ${cat.color}`}
              >
                <div className="p-3.5 rounded-2xl bg-white shadow-xs group-hover:scale-110 transition-transform mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                <span className="mt-2 text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded-full text-slate-600">
                  {cat.count}+ Products
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prescription Upload Quick Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5" />
              Prescription Order Tool
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Have a Doctor's Prescription? Upload & Sit Back!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Upload your prescription image or PDF. Our certified pharmacist will verify the items, prepare your cart, and call you to confirm delivery.
            </p>
          </div>

          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            Upload Prescription Now
          </button>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
              Top Quality Assured
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Featured Medicines & Supplies
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {(['All', 'Tablets', 'Syrups', 'Health Devices', 'Vitamins'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategoryTab === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Offers & Discount Banner */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-amber-500 to-amber-600">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="bg-slate-900 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <BadgePercent className="w-4 h-4 text-amber-400" />
                Special Offer Season
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Up to 30% OFF on Essential Health Devices & Vitamins!
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 max-w-lg">
                Stock up on blood pressure monitors, pulse oximeters, daily multivitamins, and first aid kits at guaranteed low prices. Use code <strong className="bg-amber-900/40 text-white px-2 py-0.5 rounded font-mono">HEALTH20</strong> at checkout.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  Shop Discounted Items
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center text-white space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Limited Time Offer</p>
                <div className="text-2xl font-black font-mono">24h : 18m : 45s</div>
                <p className="text-[11px] text-amber-100">Free cold-chain shipping included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 bg-white border-y border-slate-200/60 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
              Verified Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Loved by Over 50,000+ Happy Customers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Read real feedback from patients, doctors, and families using MedCare Pharmacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {rev.userName}
                      {rev.verifiedPurchase && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">{rev.date} • Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
