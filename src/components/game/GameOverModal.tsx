import React, { useEffect, useRef } from 'react';

interface GameOverModalProps {
  endingDescription: string;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ endingDescription, onPlayAgain }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the button when the modal opens
    playAgainButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(modalRef.current.querySelectorAll('button'));
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative bg-slate-900 rounded-xl p-8 max-w-2xl w-full text-center ring-1 ring-violet-500/30 shadow-2xl shadow-violet-500/10 transform animate-slide-up">
        <h2 className="text-3xl font-bold text-violet-400 mb-4 font-heading">The End</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-8 font-body">{endingDescription}</p>
        <button
          ref={playAgainButtonRef}
          onClick={onPlayAgain}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-violet-400/50 font-ui shadow-lg shadow-violet-950/50 hover:shadow-xl hover:shadow-violet-950/60"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
            animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;