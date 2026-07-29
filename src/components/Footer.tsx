import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Truck, 
  Heart,
  Send,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Thank you for subscribing to MedCare Health Tips & Discounts!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine Medicines</h4>
              <p className="text-[11px] text-slate-400">Sourced directly from certified pharma labs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cold-Chain Delivery</h4>
              <p className="text-[11px] text-slate-400">Temperature-controlled safe transport</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Certified Pharmacists</h4>
              <p className="text-[11px] text-slate-400">Every order double-checked before dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Payment & Data</h4>
              <p className="text-[11px] text-slate-400">256-bit SSL encrypted & HIPAA compliant</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                MedCare <span className="text-emerald-400">Pharmacy</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              MedCare Pharmacy is your trusted online healthcare partner. Delivering authentic prescription medicines, health monitors, vitamins, and personal care products directly to your doorstep safely and rapidly.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                742 Medical Plaza, Suite 300, Health City
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                1-800-MED-CARE (Mon-Sun 24/7 Support)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                support@medcarepharmacy.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Tablets & Capsules
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Cough & Cold Syrups
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Health & BP Monitors
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Vitamins & Supplements
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Personal Care & Skincare
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Emergency First Aid Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('tracking')} className="hover:text-emerald-400 transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-emerald-400 transition-colors">
                  About Our Pharmacy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-emerald-400 transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Health Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for weekly wellness advice, health alerts, and exclusive medicine discounts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="pt-8 mt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-2">
          <p className="max-w-3xl mx-auto">
            <strong>Medical Disclaimer:</strong> Information provided on MedCare Pharmacy website is for educational and informational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Prescription items are dispensed strictly upon receipt of valid authorization from licensed physicians.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <p>© 2026 MedCare Pharmacy Inc. All Rights Reserved. FDA Licensed & Quality Certified.</p>
            <p className="flex items-center gap-1">
              Crafted for Healthcare Excellence
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
