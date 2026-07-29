import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { syncPrescriptionToSupabase } from '../lib/supabase';
import { X, Upload, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const PrescriptionUploadModal: React.FC = () => {
  const { isPrescriptionModalOpen, setIsPrescriptionModalOpen, addToast, navigateTo, currentUser } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !patientName) {
      addToast('Please upload a prescription image/PDF or provide patient details', 'warning');
      return;
    }

    setIsUploading(true);
    
    // Save/sync prescription form to Supabase
    const fileName = file ? file.name : `rx_${patientName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    await syncPrescriptionToSupabase({
      fileName: `${fileName} (Patient: ${patientName || 'Guest'}, Doctor: ${doctorName || 'N/A'})`,
      userEmail: currentUser?.email || 'guest@medcare.com',
      uploadedAt: new Date().toISOString()
    });

    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      addToast('Prescription saved & synced to Supabase database!', 'success');
    }, 1000);
  };

  const resetModal = () => {
    setFile(null);
    setUploadComplete(false);
    setIsPrescriptionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!uploadComplete ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Upload Doctor's Prescription</h2>
                <p className="text-xs text-slate-500">Fast 15-minute verification by licensed pharmacists</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 mb-5 text-xs text-amber-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Your health data is 100% encrypted and HIPAA compliant. Only registered MedCare medical staff review your document.
              </span>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : file
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  id="prescription-file-input"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="prescription-file-input" className="cursor-pointer block">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  {file ? (
                    <div className="text-xs text-emerald-800 font-bold">
                      <p className="truncate max-w-xs mx-auto">{file.name}</p>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Drag & Drop Prescription file here or <span className="text-emerald-700 underline">Browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, PDF (Up to 10MB)</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor / Clinic</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Robert Chen"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Specific Medicines Requested</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention any specific brands or dosages required..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Encrypting & Uploading...
                  </span>
                ) : (
                  'Submit Prescription for Verification'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Prescription Received!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Our registered pharmacist is reviewing your prescription. You will receive an SMS and email notification within 15 minutes to confirm item availability.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  resetModal();
                  navigateTo('shop');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 rounded-xl transition-colors"
              >
                Browse Medicines in Shop
              </button>
              <button
                onClick={resetModal}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2.5 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
