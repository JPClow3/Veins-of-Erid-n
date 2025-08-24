import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { StoryTurn } from '../../types/game';

interface StoryPanelProps {
  storyHistory: StoryTurn[];
  isLoading: boolean;
}

const NarrativeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" />
    </svg>
);

const PlayerActionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527 1.907 6.011 6.011 0 01-1.6 2.083 6.01 6.01 0 01-2.706 1.912 6.012 6.012 0 01-1.912 2.706C8.488 14.27 8.026 14 7.5 14A1.5 1.5 0 016 12.5V12a2 2 0 00-4 0 2 2 0 01-1.527-1.907 6.011 6.011 0 011.6-2.083 6.01 6.01 0 012.706-1.912z" clipRule="evenodd" />
    </svg>
);

const ThinkingIndicator = () => (
    <div className="flex gap-1.5 items-center">
        <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0s' }}></span>
        <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0.15s' }}></span>
        <span className="h-1.5 w-1.5 bg-violet-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0.3s' }}></span>
    </div>
);


const StreamedText = React.memo(({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (text === '...') {
      setDisplayedText(''); // Let the ThinkingIndicator handle this state visually
      setIsComplete(true);
      return;
    }

    if (displayedText.length >= text.length) {
      if (displayedText !== text) setDisplayedText(text); // Catch up if props update faster than animation
      setIsComplete(true);
      return;
    }

    setIsComplete(false);

    timerRef.current = window.setInterval(() => {
      // Use a function for setDisplayedText to get the latest state
      setDisplayedText(prev => {
        if (prev.length < text.length) {
          return text.substring(0, prev.length + 1);
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsComplete(true);
          return prev;
        }
      });
    }, 15); // Speed for characters

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]); // Re-run effect when target text changes

  const skipAnimation = () => {
    if (!isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(text);
      setIsComplete(true);
    }
  };
  
  return (
    <p onClick={skipAnimation} className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-body" style={{ cursor: isComplete ? 'default' : 'pointer' }}>
        {displayedText}
        {!isComplete && <span className="inline-block w-2 h-5 bg-slate-300 ml-1 animate-pulse" style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />}
    </p>
  );
});


// Memoized component for a single story turn to prevent re-rendering of the entire list.
const Turn = React.memo(({ turn, index }: { turn: StoryTurn; index: number }) => {
  const isPlayerTurn = index > 0 && !!turn.action;

  if (isPlayerTurn) {
    return (
      <div className="animate-slide-in-right ml-auto max-w-prose">
        <h3 id={`turn-heading-${index}`} className="text-violet-300 text-lg mb-1 font-ui italic flex items-center justify-end gap-2">
          <span>{turn.action}</span>
          <PlayerActionIcon />
        </h3>
      </div>
    );
  }

  // For initial turns or narrative exposition without a preceding player action
  return (
    <section aria-labelledby={`turn-heading-${index}`} className="animate-fade-in-up bg-slate-800/30 p-4 rounded-lg border-l-4 border-violet-400/50">
      {turn.action && (
        <h3 id={`turn-heading-${index}`} className="text-violet-300 font-bold text-lg mb-2 font-heading flex items-center gap-2">
          <NarrativeIcon />
          <span>{turn.action}</span>
        </h3>
      )}
      {turn.description === '...' ? <ThinkingIndicator /> : <StreamedText text={turn.description} />}
    </section>
  );
});


const StoryPanel: React.FC<StoryPanelProps> = ({ storyHistory, isLoading }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);


  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
        const isScrolledToBottom = panel.scrollHeight - panel.clientHeight <= panel.scrollTop + 20; // 20px buffer
        isAtBottomRef.current = isScrolledToBottom;
    }
  }, [storyHistory]);


  useEffect(() => {
    if (panelRef.current && isAtBottomRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [storyHistory, isLoading]);

  return (
    <div ref={panelRef} className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
      <div className="space-y-6" aria-live="polite">
        {storyHistory.map((turn, index) => {
          // Using index as a key is acceptable here because the list is append-only and never re-ordered.
          return <Turn key={index} turn={turn} index={index} />;
        })}
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
        
        @keyframes pulse-fast {
            0%, 100% { opacity: 0.5; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-fast {
            animation: pulse-fast 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8b5cf6; /* violet-500 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7c3aed; /* violet-600 */
        }
      `}</style>
    </div>
  );
};

export default StoryPanel;