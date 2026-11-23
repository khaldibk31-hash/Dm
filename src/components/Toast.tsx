import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/store';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
              ? AlertCircle
              : Info;
        const accentClass =
          toast.type === 'success'
            ? 'text-emerald-400'
            : toast.type === 'error'
              ? 'text-rose-400'
              : 'text-[#D4AF37]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-[#141414] border border-[#D4AF37]/30 rounded-xl px-4 py-3 shadow-2xl text-sm text-[#F7F3EA]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${accentClass}`} />
              <span className="font-medium leading-snug">{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-[#A89F91] hover:text-[#F7F3EA] transition-colors shrink-0 cursor-pointer"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
