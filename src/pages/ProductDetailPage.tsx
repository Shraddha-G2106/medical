import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  AlertTriangle, 
  Truck,
  Pill,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsPrescriptionModalOpen 
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-4 bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Medicines Catalog
        </button>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 lg:p-10">
            {/* Left Image View */}
            <div className="md:col-span-5 relative bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full max-h-[380px] object-contain rounded-2xl"
              />

              {product.discountBadge && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {product.discountBadge}
                </span>
              )}

              {product.prescriptionRequired && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Rx Required
                </span>
              )}
            </div>

            {/* Right Information Column */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Brand: {product.brand}</span>
                  {product.packSize && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {product.packSize}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-slate-800">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock ({product.stock} left)
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                      Save ₹{(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Prescription Notice */}
                {product.prescriptionRequired && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Doctor's Prescription Required
                    </div>
                    <p className="text-amber-700 leading-relaxed">
                      This medication requires a valid prescription from a licensed medical practitioner. You can upload it during checkout or via our upload tool.
                    </p>
                    <button
                      onClick={() => setIsPrescriptionModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Prescription File
                    </button>
                  </div>
                )}

                {/* Description & Usage */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Active Ingredient & Dosage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <strong className="block text-slate-800 font-bold mb-0.5">Active Ingredient:</strong>
                    <span className="text-slate-600">{product.activeIngredient}</span>
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-bold mb-0.5">Recommended Dosage:</strong>
                    <span className="text-slate-600">{product.dosage}</span>
                  </div>
                </div>

                {/* Side Effects */}
                {product.sideEffects && product.sideEffects.length > 0 && (
                  <div className="mt-3">
                    <strong className="text-xs text-slate-800 font-bold block mb-1">
                      Possible Side Effects / Precautions:
                    </strong>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sideEffects.map((effect, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Controls */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-800 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart • ₹{(product.price * quantity).toFixed(2)}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] text-slate-500 border-t border-slate-100 pt-4">
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                    <span>Cold-Pack Express</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                    <span>Pharmacist Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
              You May Also Need ({product.category})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
