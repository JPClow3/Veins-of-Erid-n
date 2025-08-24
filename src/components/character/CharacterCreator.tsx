import React from 'react';
import Header from '../common/Header';
import LoadingIndicator from '../common/LoadingIndicator';

interface CharacterCreatorProps {
  onBegin: () => void;
  isLoading: boolean;
  error: string | null;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onBegin, isLoading, error }) => {
  return (
    <div className="min-h-screen text-slate-300 flex flex-col items-center justify-center p-4 text-center">
      <div>
        <div className="animate-fade-in-up">
          <Header />
        </div>
        <div className="max-w-5xl mx-auto">
            <p className="mt-6 text-xl text-slate-300 font-body leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              Your past is a fractured memory, but your future is unwritten. The final step is to remember who you are before you awaken to the world of Eridûn.
            </p>
        </div>
        
        {error && (
          <div role="alert" className="font-ui mt-8 border border-red-500/50 bg-red-900/30 text-red-300 p-4 rounded-lg max-w-xl mx-auto flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '2.0s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
            <LoadingIndicator className="h-8 w-8" />
            <p className="text-xl text-violet-300 font-heading">Preparing your destiny...</p>
          </div>
        ) : (
          <button
            onClick={onBegin}
            disabled={isLoading}
            className="mt-10 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-violet-400/50 font-ui text-lg tracking-wider disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up shadow-lg shadow-violet-950/50 hover:shadow-xl hover:shadow-violet-950/60"
            style={{ animationDelay: '2.5s' }}
          >
            Begin Your Awakening
          </button>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
          opacity: 0; /* Start hidden */
          animation-fill-mode: forwards; /* Keep final state */
        }
      `}</style>
    </div>
  );
};

export default CharacterCreator;