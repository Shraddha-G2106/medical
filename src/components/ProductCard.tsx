import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Star, FileText, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct, 
    navigateTo, 
    cart 
  } = useApp();

  const isWishlisted = isInWishlist(product.id);
  const inCart = cart.some((i) => i.product.id === product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top badges */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountBadge && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.discountBadge}
          </span>
        )}

        {/* Prescription Required Badge */}
        {product.prescriptionRequired && (
          <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Rx Required
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute ${
            product.prescriptionRequired ? 'top-11 right-3' : 'top-3 right-3'
          } p-2 rounded-full shadow-md backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="w-full bg-slate-900/90 text-white text-xs font-medium py-2 px-3 rounded-xl backdrop-blur-xs shadow-md hover:bg-slate-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{product.brand}</span>
          </div>

          <h3
            onClick={() => navigateTo('product-detail', product.id)}
            className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1 text-base mt-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating and Pack Size */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-400">({product.reviewsCount})</span>
          </div>
          {product.packSize && (
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.packSize}
            </span>
          )}
        </div>

        {/* Price and Action Button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : inCart
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
