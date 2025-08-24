import React from 'react';
import type { Journal } from '../../types/game';

interface JournalPanelProps {
  journal: Journal;
}

const JournalPanel: React.FC<JournalPanelProps> = ({ journal }) => {
  const threads = Object.entries(journal);

  if (threads.length === 0) {
    return (
      <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="text-center p-6 text-slate-400 font-ui italic bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20">
        <p>Your journal is empty. Your story has yet to be written.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-journal" role="tabpanel" aria-labelledby="tab-journal" className="space-y-4 stagger-in">
      {threads.map(([thread, data], index) => (
        <details key={thread} className="journal-details bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20 transition-all duration-300" open={index === threads.length - 1} style={{ animationDelay: `${index * 50}ms` }}>
          <summary className="font-bold text-lg font-heading text-violet-300 p-3 cursor-pointer list-none flex justify-between items-center transition-colors hover:bg-slate-800/20 rounded-t-lg">
            <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 chevron transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span>{thread}</span>
            </div>
            <span className={`text-xs uppercase font-ui font-semibold tracking-wider px-2 py-1 rounded-full 
              ${data.status === 'completed' ? 'bg-violet-900/70 text-violet-200' : 'bg-teal-800/50 text-teal-300'}`}>
              {data.status}
            </span>
          </summary>
          <div className="p-4 border-t border-violet-400/20 space-y-4">
            {data.entries.map((entry, i) => (
              <p key={i} className="text-slate-300 font-body italic text-base leading-relaxed whitespace-pre-wrap">
                &ldquo;{entry}&rdquo;
              </p>
            ))}
          </div>
        </details>
      ))}
      <style>{`
        .stagger-in > * {
            opacity: 0;
            animation: reveal-item 0.6s ease-out forwards;
        }

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
            animation: slide-down 0.3s ease-out;
        }

        @keyframes slide-down {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}</style>
    </div>
  );
};

export default JournalPanel;