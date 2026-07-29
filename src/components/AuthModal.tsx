import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCheck, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@medcare.com', role, name || 'Customer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            {role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isSignUp ? 'Create MedCare Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access orders, prescription uploads, and fast checkout.
          </p>
        </div>

        {/* Demo Fast Login Shortcuts */}
        <div className="bg-slate-50 p-3 rounded-2xl mb-5 border border-slate-200/60">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Test Login Options
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => login('customer@medcare.com', 'user', 'Sarah Jenkins')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <User className="w-3.5 h-3.5" />
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => login('admin@medcare.com', 'admin', 'Dr. Mark Williams')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors hover:bg-slate-50">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Customer
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors hover:bg-slate-50">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Admin Pharmacist
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
