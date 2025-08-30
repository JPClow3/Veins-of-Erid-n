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

const RecapModal: React.FC<{ journal: Journal, onClose: () => void }> = ({ journal, onClose }) => {
    const threads = Object.entries(journal);
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            <div className="relative bg-surface rounded-xl p-6 max-w-2xl w-full ring-1 ring-border-accent shadow-2xl shadow-glow-secondary transform animate-fade-in-up flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-bold text-accent-primary font-heading">Story Recap</h3>
                        <p className="text-text-secondary font-ui text-sm">A summary of your journey so far.</p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                </div>
                <div className="overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-4">
                  {threads.map(([thread, data]) => (
                    <div key={thread} className="border-l-2 border-border-accent pl-4">
                        <h4 className="font-bold text-lg font-heading text-accent-secondary">{thread}</h4>
                        <p className="text-text-primary font-body italic text-base leading-relaxed whitespace-pre-wrap">
                            “{data.entries[0]}”
                        </p>
                    </div>
                  ))}
                </div>
                 <div className="mt-6 text-right flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-ui font-bold rounded-md bg-accent-primary hover:bg-accent-primary-hover text-white">Close</button>
                 </div>
            </div>
        </div>
    )
};


const JournalPanel: React.FC<JournalPanelProps> = ({ journal }) => {
  const threads = Object.entries(journal);
  const [recapVisible, setRecapVisible] = useState(false);

  if (threads.length === 0) {
    return (
      <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>Your journal is empty. Your story has yet to be written.</p>
      </div>
    );
  }

  return (
    <>
      <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="space-y-4">
        <button onClick={() => setRecapVisible(true)} className="w-full text-center p-2 text-text-secondary hover:text-text-primary bg-surface-muted/30 hover:bg-surface-muted/60 border border-border hover:border-accent-primary/80 rounded-lg transition-all duration-200 font-ui text-sm flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Show Story Recap
        </button>

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
      {recapVisible && <RecapModal journal={journal} onClose={() => setRecapVisible(false)} />}
    </>
  );
};

export default JournalPanel;
