import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-900 text-white border-emerald-700'
                : isWarning
                ? 'bg-amber-900 text-white border-amber-700'
                : isError
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {isError && <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
