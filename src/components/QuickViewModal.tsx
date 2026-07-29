import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, FileText, Plus, Minus } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo 
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Panel */}
        <div className="md:w-1/2 bg-slate-50 relative p-6 flex items-center justify-center min-h-[260px]">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-64 object-contain rounded-2xl"
          />
          {quickViewProduct.discountBadge && (
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {quickViewProduct.discountBadge}
            </span>
          )}
        </div>

        {/* Details Panel */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {quickViewProduct.category}
              </span>
              <span className="text-xs text-slate-400">{quickViewProduct.brand}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2 my-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold text-slate-800">{quickViewProduct.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({quickViewProduct.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 my-3">
              <span className="text-2xl font-black text-slate-900">
                ₹{quickViewProduct.price.toFixed(2)}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{quickViewProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {quickViewProduct.prescriptionRequired && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-xs text-amber-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Doctor's prescription required for this medicine.</span>
              </div>
            )}

            <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
              {quickViewProduct.description}
            </p>

            <div className="text-xs space-y-1 text-slate-500 bg-slate-50 p-3 rounded-xl mb-4">
              <div><strong className="text-slate-700">Dosage:</strong> {quickViewProduct.dosage}</div>
              <div><strong className="text-slate-700">Active Ingredient:</strong> {quickViewProduct.activeIngredient}</div>
            </div>
          </div>

          <div>
            {/* Quantity Controls & Actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(quickViewProduct, quantity);
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                const pid = quickViewProduct.id;
                setQuickViewProduct(null);
                navigateTo('product-detail', pid);
              }}
              className="w-full text-center text-xs text-emerald-700 font-semibold hover:underline"
            >
              View Full Product Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
