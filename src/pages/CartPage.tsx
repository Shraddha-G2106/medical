import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartSubtotal, 
    navigateTo, 
    addToast,
    setIsPrescriptionModalOpen
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>({
    code: 'HEALTH10',
    discountPercent: 10
  });

  const subtotal = getCartSubtotal();
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const shippingFee = subtotal > 300 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - promoDiscount + shippingFee);

  const hasPrescriptionRequiredItems = cart.some((i) => i.product.prescriptionRequired);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'HEALTH10' || cleanCode === 'MEDCARE20') {
      const pct = cleanCode === 'MEDCARE20' ? 20 : 10;
      setAppliedPromo({ code: cleanCode, discountPercent: pct });
      addToast(`Promo code "${cleanCode}" applied successfully! (${pct}% OFF)`, 'success');
      setPromoCode('');
    } else {
      addToast('Invalid promo code. Try "HEALTH10" or "MEDCARE20"', 'warning');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't added any medicines or health products to your cart yet. Browse our verified pharmacy shop to order.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            Explore Medicines Shop
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review items before placing your pharmacy order
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>

        {/* Prescription Required Alert Banner */}
        {hasPrescriptionRequiredItems && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold">Prescription Medicine Notice:</strong> One or more items in your cart require a doctor's prescription.
              </div>
            </div>
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Prescription Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-contain rounded-xl bg-slate-50 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.product.category}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-detail', item.product.id)}
                      className="font-bold text-slate-900 hover:text-emerald-600 text-sm cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">Brand: {item.product.brand}</p>
                    {item.product.prescriptionRequired && (
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-600" />
                        Rx Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item Price */}
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ₹{item.product.price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping Medicines
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Discount Code / Coupon
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. HEALTH10"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Active: <strong>{appliedPromo.code}</strong> ({appliedPromo.discountPercent}% OFF)</span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-emerald-900 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Details Breakdown */}
              <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promo Savings ({appliedPromo?.code})</span>
                    <span className="font-bold">-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-700">FREE Delivery</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>

                {subtotal < 300 && subtotal > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                    Add ₹{(300 - subtotal).toFixed(2)} more for FREE delivery!
                  </p>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-3">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                256-Bit SSL Encrypted Healthcare Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
