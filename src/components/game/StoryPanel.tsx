import React, { useEffect, useRef, useState, Fragment } from 'react';
import type { StoryTurn, GameUpdateEvent } from '../../types/game';

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

// FIX: Added 'feat' and 'sanctum' icons to satisfy the GameUpdateEvent['type'].
const EventIcons: Record<GameUpdateEvent['type'], React.ReactNode> = {
    reputation: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
    journal: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-4V3a1 1 0 00-1-1H9z" /><path d="M12 9a1 1 0 10-2 0v1a1 1 0 102 0v-1z" /></svg>,
    item: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" /><path d="M5 12a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z" /><path d="M5 20a2 2 0 012-2h6a2 2 0 012 2v.5a.5.5 0 01-1 0V20a1 1 0 00-1-1H7a1 1 0 00-1 1v.5a.5.5 0 01-1 0V20z" /></svg>,
    lore: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" /></svg>,
    stats: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    world: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
    people: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V12a1 1 0 00-1 1v1a1 1 0 001 1h.09a3.001 3.001 0 005.82 0H11a1 1 0 001-1v-1a1 1 0 00-1-1v-.5a3 3 0 00-3 0z" /><path d="M16.5 9.5a3 3 0 11-6 0 3 3 0 016 0zM15 11.5a3 3 0 00-3 0V12a1 1 0 00-1 1v1a1 1 0 001 1h.09a3.001 3.001 0 005.82 0H17a1 1 0 001-1v-1a1 1 0 00-1-1v-.5a3 3 0 00-3 0z" /></svg>,
    act: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>,
    aether: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1-1v-.5a1.5 1.5 0 01-3 0v.5a1 1 0 00-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>,
    feat: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    sanctum: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
};


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
    
    let currentLength = displayedText.length;
    // If the new text doesn't start with the current text, it's a correction, so reset.
    if (!text.startsWith(displayedText)) {
      setDisplayedText('');
      currentLength = 0;
    }

    if (currentLength >= text.length) {
      if (displayedText !== text) setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setIsComplete(false);
    
    const startTime = performance.now();
    const initialLength = currentLength;
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
      <div className="animate-slide-in-right self-end w-full flex justify-end">
        <div id={`turn-heading-${index}`} className="max-w-prose bg-surface-muted/50 p-4 rounded-lg border-r-4 border-accent-secondary shadow-md">
            <h3 className="text-text-primary text-lg font-body italic flex items-center justify-end gap-3 text-right">
                <span>{turn.action}</span>
                <div className="text-accent-secondary flex-shrink-0"><PlayerActionIcon /></div>
            </h3>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby={`turn-heading-${index}`} className="animate-fade-in-up">
      <div className="bg-surface-muted/30 p-4 rounded-lg border-l-4 border-accent-primary/50">
        {turn.action && (
          <h3 id={`turn-heading-${index}`} className="text-accent-primary font-bold text-lg mb-2 font-heading flex items-center gap-2">
            <NarrativeIcon />
            <span>{turn.action}</span>
          </h3>
        )}
        {turn.description === '...' ? <ThinkingIndicator /> : <StreamedNarrative key={`narrative-${index}`} text={turn.description} />}
      </div>
      {turn.events && turn.events.length > 0 && (
          <div className="mt-2 pl-2 space-y-1">
              {turn.events.map((event, eventIndex) => (
                  <div key={eventIndex} role="status" className="animate-fade-in-up text-xs text-text-secondary italic font-ui flex items-center gap-2" style={{ animationDelay: `${eventIndex * 100}ms` }}>
                      <span className="text-accent-secondary">{EventIcons[event.type]}</span>
                      <span>{event.message}</span>
                  </div>
              ))}
          </div>
      )}
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
            <div className="space-y-6 flex flex-col" aria-live="polite">
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