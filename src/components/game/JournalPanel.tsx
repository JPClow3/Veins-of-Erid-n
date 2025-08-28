import React, { useState } from 'react';
import type { Journal } from '../../types/game';
import useGameStore from '../../store/gameStore';

interface JournalPanelProps {
  journal: Journal;
}

const CustomEntryForm: React.FC<{ threadTitle: string }> = ({ threadTitle }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [entry, setEntry] = useState('');
    const addCustomJournalEntry = useGameStore(state => state.addCustomJournalEntry);

    const handleSave = () => {
        if (entry.trim()) {
            addCustomJournalEntry(threadTitle, entry.trim());
            setEntry('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <button onClick={() => setIsAdding(true)} className="w-full mt-3 text-center p-1.5 text-text-secondary hover:text-text-primary bg-surface-muted/30 hover:bg-surface-muted/60 border border-dashed hover:border-solid border-border hover:border-accent-primary/80 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-ui text-xs flex items-center justify-center gap-2 group">
                Add Note
            </button>
        )
    }

    return (
        <div className="mt-3 space-y-2 animate-fade-in">
            <textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Scribe your thoughts..." className="w-full bg-surface/80 border border-border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all font-body text-sm" rows={3}></textarea>
            <div className="flex justify-end gap-2">
                <button onClick={() => setIsAdding(false)} className="px-2 py-1 text-xs font-ui rounded-md bg-surface-muted hover:bg-border text-text-secondary">Cancel</button>
                <button onClick={handleSave} disabled={!entry.trim()} className="px-3 py-1 text-xs font-ui font-bold rounded-md bg-accent-primary hover:bg-accent-primary-hover text-white disabled:opacity-50">Save</button>
            </div>
        </div>
    )
}

const JournalPanel: React.FC<JournalPanelProps> = ({ journal }) => {
  const threads = Object.entries(journal);

  if (threads.length === 0) {
    return (
      <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>Your journal is empty. Your story has yet to be written.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="space-y-4">
      {threads.map(([thread, data], index) => (
        <details key={thread} className="journal-details bg-surface-muted/30 rounded-lg ring-1 ring-border transition-all duration-300" open={index === threads.length - 1}>
          <summary className="font-bold text-base font-heading text-accent-primary p-3 cursor-pointer list-none flex justify-between items-center transition-colors hover:bg-surface-muted rounded-t-lg">
            <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 chevron transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span>{thread}</span>
            </div>
            <span className={`text-xs uppercase font-ui font-semibold tracking-wider px-2 py-1 rounded-full 
              ${data.status === 'completed' ? 'bg-accent-primary/30 text-accent-primary' : 'bg-green-500/20 text-green-300'}`}>
              {data.status}
            </span>
          </summary>
          <div className="p-4 border-t border-border space-y-4">
            {data.entries.map((entry, i) => (
              <p key={i} className="text-text-primary font-body italic text-base leading-relaxed whitespace-pre-wrap">
                {entry.startsWith('[My Note]') ? 
                  <><span className="font-bold not-italic text-accent-secondary">[My Note]</span> {entry.substring(9)}</>
                  : `“${entry}”`
                }
              </p>
            ))}
            <CustomEntryForm threadTitle={thread} />
          </div>
        </details>
      ))}
      <style>{`
        .journal-details .chevron {
            transition: transform 0.2s ease-in-out;
        }
        .journal-details[open] .chevron {
            transform: rotate(90deg);
        }
        .journal-details > summary::-webkit-details-marker {
            display: none;
        }
        
        .journal-details > div {
            animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JournalPanel;