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
    <div className="min-h-screen text-text-primary flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-fade-in-up">
        <Header />
      </div>
      <div className="max-w-3xl mx-auto">
          <p className="mt-6 text-xl text-text-primary font-body leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Your past is a fractured memory, but your future is unwritten. The final step is to remember who you are before you awaken to the world of Eridûn.
          </p>
      </div>
      
      {error && (
        <div role="alert" className="font-ui mt-8 border border-error/50 bg-error-bg text-error p-4 rounded-lg max-w-xl mx-auto flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-4">
            <LoadingIndicator className="h-8 w-8" />
            <p className="text-xl text-accent-primary font-heading">Preparing your destiny...</p>
          </div>
        ) : (
          <button
            onClick={onBegin}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent-primary/50 font-ui text-lg tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30 overflow-hidden"
          >
            <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative z-10">Begin Your Awakening</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterCreator;