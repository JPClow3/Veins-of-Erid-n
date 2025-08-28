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
    info: 'bg-surface/80 border-accent-primary/50 text-accent-primary',
    success: 'bg-surface/80 border-teal-500/50 text-teal-200', // Assuming teal for success
    warning: 'bg-surface/80 border-yellow-500/50 text-yellow-200', // Assuming yellow for warning
    error: 'bg-error-bg border-error/50 text-error',
  };

  const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative w-full max-w-sm p-3 rounded-lg shadow-2xl shadow-background/50 border-l-4 font-ui text-sm font-semibold backdrop-blur-md ${typeClasses[toast.type]} ${animationClass}`}
    >
      {toast.message}
      <button onClick={() => onRemove(toast.id)} className="absolute top-1 right-1 text-text-secondary hover:text-text-primary">&times;</button>
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
        @keyframes toast-in {
            from { transform: translateX(100%) scale(0.9); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes toast-out {
            from { transform: translateX(0) scale(1); opacity: 1; }
            to { transform: translateX(100%) scale(0.9); opacity: 0; }
        }
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