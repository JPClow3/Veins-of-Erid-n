import React from 'react';
import type { AethericState } from '../../types/game';

interface AethericStateDisplayProps {
  state: AethericState | null;
}

const Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1-1v-.5a1.5 1.5 0 01-3 0v.5a1 1 0 00-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
    </svg>
)

const AethericStateDisplay: React.FC<AethericStateDisplayProps> = ({ state }) => {
  if (!state) return null;

  return (
    <div role="status" className="p-3 mb-4 border-l-4 border-accent-secondary bg-surface-muted/50 rounded-r-lg animate-fade-in text-sm font-ui flex items-start gap-3">
        <div className="text-accent-secondary mt-0.5"><Icon /></div>
        <div>
            <p className="font-bold text-accent-secondary">{state.condition}</p>
            <p className="text-text-secondary italic mt-1">{state.description}</p>
        </div>
    </div>
  );
};

export default AethericStateDisplay;
