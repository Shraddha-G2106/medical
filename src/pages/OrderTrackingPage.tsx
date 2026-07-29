import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  PhoneCall, 
  AlertCircle, 
  FileText,
  Building,
  UserCheck
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { activeTrackingOrderId, setActiveTrackingOrderId, getOrderById, orders } = useApp();
  const [searchInput, setSearchInput] = useState(activeTrackingOrderId || 'MC-84920');

  const currentOrder = getOrderById(searchInput);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTrackingOrderId(searchInput.trim());
    }
  };

  const stepsOrder: OrderStatus[] = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    return stepsOrder.indexOf(status);
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
            Live Order Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Track Pharmacy Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your MedCare Order ID below to view cold-chain transport status.
          </p>
        </div>

        {/* Order ID Search Form & Chips */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Package className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. MC-84920)..."
                className="w-full pl-11 pr-3 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md shrink-0"
            >
              Track Order
            </button>
          </form>

          {/* Clickable Quick Sample Orders Chips for easy test */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-700">Quick Test Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchInput(o.id);
                  setActiveTrackingOrderId(o.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                  searchInput === o.id
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                #{o.id} ({o.status})
              </button>
            ))}
          </div>
        </div>

        {/* Order Tracking Result View */}
        {currentOrder ? (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    ORDER #{currentOrder.id}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                    Status: <span className="text-emerald-400">{currentOrder.status}</span>
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-300">
                  <p>Ordered: <strong>{currentOrder.orderDate}</strong></p>
                  <p className="text-emerald-300 font-bold mt-0.5">
                    Est. Arrival: {currentOrder.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="pt-4">
                <div className="relative flex items-center justify-between">
                  {/* Background Track Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 z-0"
                    style={{
                      width: `${(currentStepIdx / (stepsOrder.length - 1)) * 100}%`
                    }}
                  />

                  {stepsOrder.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          } ${isCurrent ? 'ring-4 ring-emerald-400/40 scale-110' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-bold mt-2 text-center max-w-[70px] ${
                            isDone ? 'text-emerald-300' : 'text-slate-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tracking Detailed Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Detailed Logistics Timeline
              </h3>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentOrder.trackingHistory.map((step, idx) => (
                  <div key={idx} className="relative pl-9 space-y-1">
                    <div
                      className={`absolute left-1.5 top-1.5 w-4 h-4 rounded-full border-2 ${
                        step.completed
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'bg-white border-slate-300'
                      }`}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.status} — {step.location}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items List */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Ordered Medicines ({currentOrder.items.length})
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border shrink-0"
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

                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-slate-900 flex justify-between">
                  <span>Total Amount ({currentOrder.paymentMethod.toUpperCase()}):</span>
                  <span className="text-emerald-700">₹{currentOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Destination & Patient Details
                </h3>

                <div className="text-xs text-slate-600 space-y-2">
                  <p className="flex items-center gap-2 font-bold text-slate-800">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    {currentOrder.shippingDetails.fullName}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    {currentOrder.shippingDetails.address}, {currentOrder.shippingDetails.city} {currentOrder.shippingDetails.pincode}
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                    {currentOrder.shippingDetails.phone}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href="tel:18006332273"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    Call Logistics Hotline
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Order ID Not Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please check your order confirmation email or try one of the sample order chips above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
