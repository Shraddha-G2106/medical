import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500">
            Save medicines, supplements, or devices to your wishlist for easy reordering later.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            Browse Medicines Catalog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            You have {wishlist.length} saved medical products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
