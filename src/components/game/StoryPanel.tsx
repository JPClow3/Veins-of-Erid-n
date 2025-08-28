import React, { useEffect, useRef, useState, Fragment } from 'react';
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
        <span className="h-1.5 w-1.5 bg-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0s' }}></span>
        <span className="h-1.5 w-1.5 bg-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0.15s' }}></span>
        <span className="h-1.5 w-1.5 bg-accent-primary rounded-full animate-pulse-fast" style={{ animationDelay: '0.3s' }}></span>
    </div>
);


const StreamedNarrative = React.memo(({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    if (text === '...') {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    // If text changes to something shorter or different, reset immediately
    if (!text.startsWith(displayedText)) {
      setDisplayedText('');
    }

    if (displayedText.length >= text.length) {
      if (displayedText !== text) setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setIsComplete(false);
    
    const startTime = performance.now();
    const initialLength = displayedText.length;
    const typingSpeed = 50; // characters per second

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const charactersToShow = Math.floor(elapsedTime / 1000 * typingSpeed);
      const newLength = Math.min(text.length, initialLength + charactersToShow);

      setDisplayedText(text.substring(0, newLength));

      if (newLength < text.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [text]);

  const skipAnimation = () => {
    if (!isComplete) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setDisplayedText(text);
      setIsComplete(true);
    }
  };

  const renderText = (textToRender: string) => {
    const parts = textToRender.split(/(".*?")/g).filter(Boolean);
    return parts.map((part, index) => {
        if (part.startsWith('"') && part.endsWith('"')) {
            // Dialogue
            return (
                <em key={index} className="text-accent-secondary not-italic font-normal">
                    {part}
                </em>
            );
        }
        // Narrative
        return <Fragment key={index}>{part}</Fragment>;
    });
  };
  
  return (
    <p onClick={skipAnimation} className="text-text-primary text-lg leading-relaxed whitespace-pre-wrap font-body" style={{ cursor: isComplete ? 'default' : 'pointer' }}>
        {renderText(displayedText)}
        {!isComplete && <span className="inline-block w-2 h-5 bg-text-primary ml-1 animate-pulse" style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />}
    </p>
  );
});

const Turn = React.memo(({ turn, index }: { turn: StoryTurn; index: number }) => {
  const isPlayerTurn = index > 0 && !!turn.action;

  if (isPlayerTurn) {
    return (
      <div className="animate-slide-in-right ml-auto max-w-prose my-2">
        <div id={`turn-heading-${index}`} className="bg-accent-primary/10 border-r-4 border-accent-primary p-3 rounded-l-lg">
            <h3 className="text-accent-primary text-lg font-ui italic flex items-center justify-end gap-2">
            <span>{turn.action}</span>
            <PlayerActionIcon />
            </h3>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby={`turn-heading-${index}`} className="animate-fade-in-up bg-surface-muted/30 p-4 rounded-lg border-l-4 border-accent-primary/50">
      {turn.action && (
        <h3 id={`turn-heading-${index}`} className="text-accent-primary font-bold text-lg mb-2 font-heading flex items-center gap-2">
          <NarrativeIcon />
          <span>{turn.action}</span>
        </h3>
      )}
      {turn.description === '...' ? <ThinkingIndicator /> : <StreamedNarrative text={turn.description} />}
    </section>
  );
});


const StoryPanel: React.FC<StoryPanelProps> = ({ storyHistory, isLoading }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    const panel = panelRef.current;
    if (panel) {
      const isScrolledUp = panel.scrollHeight - panel.clientHeight - panel.scrollTop > 100;
      setShowScrollButton(isScrolledUp);
      isAtBottomRef.current = !isScrolledUp;
    }
  };
  
  const scrollToBottom = () => {
    panelRef.current?.scrollTo({
        top: panelRef.current.scrollHeight,
        behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (panelRef.current && isAtBottomRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [storyHistory, isLoading]);

  return (
    <div className="flex-grow relative">
        <div ref={panelRef} onScroll={handleScroll} className="absolute inset-0 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
            <div className="space-y-6" aria-live="polite">
                {storyHistory.map((turn, index) => {
                return <Turn key={index} turn={turn} index={index} />;
                })}
            </div>
        </div>
        {showScrollButton && (
            <button
                onClick={scrollToBottom}
                aria-label="Scroll to latest message"
                className="absolute bottom-2 right-6 z-10 p-2 bg-surface/70 backdrop-blur-sm rounded-full text-accent-primary hover:bg-accent-primary/80 hover:text-white transition-all duration-200 animate-fade-in focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
            </button>
        )}
       <style>{`
        @keyframes pulse-fast {
            0%, 100% { opacity: 0.5; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-fast {
            animation: pulse-fast 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default StoryPanel;