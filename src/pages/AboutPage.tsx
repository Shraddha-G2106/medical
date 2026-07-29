import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Award, 
  Truck, 
  Users, 
  HeartPulse, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building2,
  Clock
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  const team = [
    {
      name: 'Dr. Mark Williams, PharmD',
      title: 'Chief Registered Pharmacist',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
      bio: '18+ years leading clinical pharmacy operations with specialization in infectious disease pharmacotherapy.'
    },
    {
      name: 'Sarah Lin, M.Pharm',
      title: 'Quality Assurance Director',
      image: 'https://images.unsplash.com/photo-1594824813566-78a1ed6a2a0a?auto=format&fit=crop&q=80&w=300',
      bio: 'Oversees FDA cold-chain compliance and strict batch testing for all incoming pharmaceutical inventory.'
    },
    {
      name: 'Dr. James Vance, MD',
      title: 'Medical Advisory Chair',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      bio: 'Board-certified internist guiding patient safety protocols and digital prescription review standards.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Our Healthcare Heritage
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Delivering Healthcare You Can Trust, Right to Your Doorstep.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Founded with a mission to eliminate medicine scarcity and bring authentic, affordable healthcare supplies to families everywhere with total safety and transparency.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">50,000+</div>
            <p className="text-xs text-slate-500 font-medium">Happy Patients Served</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">100%</div>
            <p className="text-xs text-slate-500 font-medium">Authentic Sourced Medicines</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">15 Mins</div>
            <p className="text-xs text-slate-500 font-medium">Avg. Prescription Review Time</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">24/7</div>
            <p className="text-xs text-slate-500 font-medium">Licensed Pharmacist Support</p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Authenticity Guaranteed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We partner exclusively with accredited pharmaceutical manufacturers and authorized distributors. Every tablet, syrup, and device undergoes rigorous QR barcode verification.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cold-Chain Temperature Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thermolabile medicines like insulin and vaccines are transported in specialized insulated thermal boxes equipped with real-time temperature logs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Licensed Medical Staff</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our team consists of PharmD graduates and registered clinicians who review every order, check for drug interactions, and advise patients 24/7.
            </p>
          </div>
        </div>

        {/* Pharmacist Team Section */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
              Medical Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Meet Our Registered Pharmacists
            </h2>
            <p className="text-xs text-slate-500">
              Experienced medical professionals ensuring your family's health & safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center space-y-3 shadow-xs">
                <img
                  src={member.image}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-50 shadow-md"
                />
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  {member.title}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Order Your Medicines?</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Experience fast delivery, genuine medicines, and round-the-clock expert support with MedCare Pharmacy.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
            >
              Explore Shop
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
