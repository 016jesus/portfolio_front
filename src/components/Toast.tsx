import { create } from 'zustand';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration);
    }
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'error', message, duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'warning', message, duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().add({ type: 'info', message, duration }),
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bg: Record<ToastType, string> = {
  success: 'border-green-500/40 bg-green-50/90 dark:bg-green-950/60',
  error: 'border-red-500/40 bg-red-50/90 dark:bg-red-950/60',
  warning: 'border-yellow-500/40 bg-yellow-50/90 dark:bg-yellow-950/60',
  info: 'border-blue-500/40 bg-blue-50/90 dark:bg-blue-950/60',
};

const ToastItem = ({ toast: t }: { toast: Toast }) => {
  const remove = useToastStore((s) => s.remove);
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg ${bg[t.type]} max-w-sm w-full animate-in slide-in-from-right-full`}
    >
      <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
      <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{t.message}</p>
      <button
        onClick={() => remove(t.id)}
        className="shrink-0 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
};
