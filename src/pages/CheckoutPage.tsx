import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  QrCode, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    currentUser, 
    getCartSubtotal, 
    placeOrder, 
    navigateTo, 
    addToast,
    setIsPrescriptionModalOpen 
  } = useApp();

  const [fullName, setFullName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.j@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(currentUser?.address || '742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [pincode, setPincode] = useState('97477');

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('online');
  const [prescriptionFile, setPrescriptionFile] = useState<string>('Prescription_Doc_2026.pdf');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = getCartSubtotal();
  const discountAmount = subtotal > 500 ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const hasRxItem = cart.some((i) => i.product.prescriptionRequired);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || !city || !pincode) {
      addToast('Please complete all shipping address fields', 'warning');
      return;
    }

    if (cart.length === 0) {
      addToast('Your cart is empty', 'warning');
      navigateTo('shop');
      return;
    }

    setIsPlacing(true);

    setTimeout(() => {
      const createdOrder = placeOrder(
        {
          fullName,
          email,
          phone,
          address,
          city,
          pincode
        },
        paymentMethod === 'online' ? 'card' : paymentMethod,
        hasRxItem ? prescriptionFile : undefined
      );

      setIsPlacing(false);
      navigateTo('tracking', undefined, createdOrder.id);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">No items to checkout</h2>
          <button
            onClick={() => navigateTo('shop')}
            className="bg-emerald-600 text-white font-semibold text-xs px-6 py-2.5 rounded-xl"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigateTo('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shopping Cart
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
          Pharmacy Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer & Shipping Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Shipping & Patient Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (For Delivery Alerts)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Delivery Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, suite, street name..."
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="97477"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Prescription Attachment (If required) */}
            {hasRxItem && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Prescription Verification
                  </h3>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between gap-4 text-xs text-amber-900">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold">Prescription Attached for Order</p>
                      <p className="text-[11px] text-amber-700 font-mono mt-0.5">{prescriptionFile}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {hasRxItem ? '3' : '2'}
                </div>
                <h3 className="text-base font-bold text-slate-900">Select Payment Option</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Online Credit/Debit Card */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-xs text-slate-900">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant online checkout</p>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-xs text-slate-900">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay upon package arrival</p>
                </div>

                {/* UPI / Net Banking */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-xs text-slate-900">UPI / QR Code</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant mobile scanner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Order Review Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
                Items in Order ({cart.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-3">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPlacing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isPlacing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Place Order (₹{grandTotal.toFixed(2)})
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Encrypted Transaction Guarantee
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
