import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { submitContactMessage } from '../services/api';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building, 
  PhoneCall,
  Loader2,
  Database
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Medicine Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setIsSubmitting(true);

      // Save inquiry to Supabase contact_messages table
      await submitContactMessage({
        name,
        email,
        phone,
        subject,
        message
      });

      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Message saved & sent to Supabase Pharmacist Support!', 'success');
    }
  };

  const storeLocations = [
    {
      name: 'MedCare Central Plaza Store',
      address: '742 Medical Plaza, Suite 300, Springfield',
      phone: '+1 (555) 234-5678',
      hours: 'Open 24 Hours / 7 Days'
    },
    {
      name: 'MedCare Westside Health Branch',
      address: '108 Westside Boulevard, Springfield',
      phone: '+1 (555) 876-5432',
      hours: 'Mon - Sat: 7:00 AM - 11:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
            Customer Support Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Get in Touch with MedCare Pharmacists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about your prescription, order tracking, or dosage instructions? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Information & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
                Direct Contact Lines
              </h2>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">24/7 Toll-Free Hotline</h4>
                    <p className="text-slate-500 mt-0.5">1-800-MED-CARE (1-800-633-2273)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Email Pharmacist Support</h4>
                    <p className="text-slate-500 mt-0.5">support@medcarepharmacy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Dispatch Working Hours</h4>
                    <p className="text-slate-500 mt-0.5">Online Ordering: 24/7/365</p>
                    <p className="text-slate-500">Physical Dispensing Hub: 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Locations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Physical Pharmacy Branches
              </h2>

              <div className="space-y-3">
                {storeLocations.map((loc, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{loc.name}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {loc.address}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {loc.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 mb-6">Send Us a Message</h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Topic</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800"
                      >
                        <option value="Medicine Inquiry">Medicine Inquiry / Availability</option>
                        <option value="Prescription Verification">Prescription Verification</option>
                        <option value="Order Tracking Help">Order Tracking Help</option>
                        <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message Detail</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry or requested medication details..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving to Supabase Database...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message & Save to Supabase
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-extrabold text-slate-900">Message Delivered & Saved!</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    Stored in Supabase <code className="font-mono font-bold">contact_messages</code> Table
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out to MedCare. A licensed pharmacist will review your inquiry and respond to <strong>{email}</strong> within 1-2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Store Map Mockup */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Interactive Store Location Map
          </h2>
          <div className="w-full h-64 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center text-center p-6">
            <div className="space-y-2">
              <MapPin className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
              <p className="text-xs font-bold text-slate-800">
                MedCare Main Dispensing Center & Cold-Chain Storage
              </p>
              <p className="text-[11px] text-slate-500">
                742 Medical Plaza, Suite 300, Springfield, IL 62701
              </p>
              <span className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                Open 24/7 for Emergency Pickups
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
