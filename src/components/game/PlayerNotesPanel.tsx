import React, { useState, useEffect, useRef } from 'react';

interface PlayerNotesPanelProps {
  notes: string;
  setNotes: (newNotes: string) => void;
}

const PlayerNotesPanel: React.FC<PlayerNotesPanelProps> = ({ notes, setNotes }) => {
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [isSaved, setIsSaved] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentNotes(notes);
  }, [notes]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNotes(event.target.value);
    setIsSaved(false);
  };
  
  const handleSave = () => {
    if (!isSaved) {
      setNotes(currentNotes);
      setIsSaved(true);
    }
  };

  return (
    <div id="tabpanel-player-notes" role="tabpanel" aria-labelledby="tab-player-notes" className="p-4 bg-surface-muted/30 rounded-lg ring-1 ring-border space-y-3">
      <p className="text-sm text-text-secondary font-ui italic">Inscribe your own memories and observations here. They are for your eyes only.</p>
      <textarea
        value={currentNotes}
        onChange={handleChange}
        onBlur={handleSave}
        placeholder="The Veyran ambassador seemed nervous..."
        className="w-full h-48 bg-surface/80 border border-border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all font-body text-base custom-scrollbar"
        aria-label="Player notes"
      />
      <div className="text-right text-xs font-ui h-4">
        {!isSaved && <span className="text-yellow-400 animate-pulse">Unsaved changes...</span>}
        {isSaved && currentNotes && <span className="text-green-400">Notes saved.</span>}
      </div>
    </div>
  );
};

export default PlayerNotesPanel;
