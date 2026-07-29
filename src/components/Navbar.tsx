import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Search, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  Upload, 
  ShieldCheck, 
  ChevronRight,
  Truck,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    getCartTotalItems, 
    wishlist, 
    currentUser, 
    setIsAuthModalOpen, 
    setIsPrescriptionModalOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedCategory
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = getCartTotalItems();
  const wishlistCount = wishlist.length;

  // Search autocomplete items
  const matchingProducts = searchQuery.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigateTo('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
              EXPRESS 2-HOUR
            </span>
            <span>Free Express Delivery on orders over ₹300. Use code <strong>HEALTH10</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              Toll Free: 1-800-MED-CARE
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              24/7 Pharmacist Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              MedCare <span className="text-emerald-600">Pharmacy</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block -mt-1">
              Licensed Digital Healthcare
            </span>
          </div>
        </div>

        {/* Central Search Bar */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search medicines, supplements, devices (e.g. Paracetamol, BP Monitor)..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Suggested Medicines
              </div>
              {matchingProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                    navigateTo('product-detail', p.id);
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.category} • {p.brand}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">₹{p.price.toFixed(2)}</span>
                </div>
              ))}
              <button
                onClick={() => {
                  setIsSearchFocused(false);
                  navigateTo('shop');
                }}
                className="w-full text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 py-2 border-t border-slate-100 mt-1"
              >
                View all results &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prescription Upload Quick Button */}
          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            Upload Rx
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          <div className="relative">
            {!currentUser && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Admin Dashboard Quick Link Button if admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin')}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1 py-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Medicines & Shop' },
              { id: 'tracking', label: 'Track Order' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact Support' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id as any)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  currentPage === link.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'hover:bg-slate-200/60 text-slate-700'
                }`}
              >
                {link.label}
              </button>
            ))}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentPage === 'admin'
                    ? 'bg-slate-900 text-emerald-400 font-bold'
                    : 'text-amber-700 hover:bg-amber-50 font-bold'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <Truck className="w-3.5 h-3.5" />
              Live Order Dispatch Active
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-4 animate-fade-in shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Quick Prescription Upload Mobile */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsPrescriptionModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 py-2.5 rounded-xl font-semibold text-xs"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Prescription Document
          </button>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'shop', label: 'Browse Medicines & Shop' },
              { id: 'cart', label: `Cart (${cartCount} items)` },
              { id: 'wishlist', label: `Wishlist (${wishlistCount} items)` },
              { id: 'tracking', label: 'Track Order Status' },
              { id: 'about', label: 'About MedCare' },
              { id: 'contact', label: 'Contact Pharmacy' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo(link.id as any);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  currentPage === link.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('admin');
                }}
                className="text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 flex items-center justify-between mt-1"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Admin Dashboard
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
