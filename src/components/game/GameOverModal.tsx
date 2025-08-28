import React, { useEffect, useRef } from 'react';

interface GameOverModalProps {
  endingDescription: string;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ endingDescription, onPlayAgain }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    playAgainButtonRef.current?.focus();
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative bg-surface rounded-xl p-8 max-w-2xl w-full text-center ring-1 ring-border-accent shadow-2xl shadow-glow-primary transform animate-fade-in-up">
        <h2 className="text-3xl font-bold text-accent-primary mb-4 font-heading">The End</h2>
        <p className="text-text-primary text-lg leading-relaxed mb-8 font-body">{endingDescription}</p>
        <button
          ref={playAgainButtonRef}
          onClick={onPlayAgain}
          className="group relative inline-flex items-center justify-center px-8 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent-primary/50 font-ui shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30"
        >
           <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
           <span className="relative z-10">Play Again</span>
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;