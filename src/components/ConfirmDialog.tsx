import { useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, Loader2, X } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
      if (e.key === 'Enter' && !loading) onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    confirmBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, loading, onCancel, onConfirm]);

  if (!open) return null;

  const isDanger = variant === 'danger';
  const Icon = isDanger ? AlertTriangle : AlertCircle;

  const iconWrap = isDanger
    ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
    : 'bg-[#2da44e]/10 text-[#2da44e]';

  const confirmBtn = isDanger
    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
    : 'bg-[#2da44e] hover:bg-[#2c974b] focus-visible:ring-[#2da44e]';

  return (
    <div
      className="glass-overlay fixed inset-0 z-[60] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="glass-modal rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconWrap}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label={cancelLabel}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 bg-white/30 dark:bg-slate-950/30 border-t border-white/40 dark:border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#21262d] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#30363d] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${confirmBtn}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
