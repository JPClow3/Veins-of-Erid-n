import React from 'react';
import useGameStore from '../../store/gameStore';
import type { Toast } from '../../types/ui';

const ToastMessage: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Let the exit animation play before removing from the DOM
      setTimeout(() => onRemove(toast.id), 300);
    }, 4700); // A little less than the store's timeout to ensure animation runs

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const typeClasses = {
    info: 'bg-slate-800/80 border-violet-500/50 text-violet-300',
    success: 'bg-teal-900/80 border-teal-500/50 text-teal-200',
    warning: 'bg-yellow-900/80 border-yellow-500/50 text-yellow-200',
    error: 'bg-red-900/80 border-red-500/50 text-red-300',
  };

  const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative w-full max-w-sm p-3 rounded-lg shadow-2xl shadow-slate-950/50 border-l-4 font-ui text-sm font-semibold backdrop-blur-md ${typeClasses[toast.type]} ${animationClass}`}
    >
      {toast.message}
      <button onClick={() => onRemove(toast.id)} className="absolute top-1 right-1 text-slate-400 hover:text-white">&times;</button>
    </div>
  );
};

const ToastNotifications = () => {
  const { toasts, removeToast } = useGameStore(state => ({
    toasts: state.toasts,
    removeToast: state.removeToast,
  }));

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-3" aria-label="Notifications">
      {toasts.map(toast => (
        <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
      <style>{`
        .animate-toast-in {
            animation: toast-in 0.3s ease-out forwards;
        }
        .animate-toast-out {
            animation: toast-out 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastNotifications;
