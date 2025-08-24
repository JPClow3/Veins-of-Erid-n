import React from 'react';
import type { FactionReputation } from '../../types/game';
import { MAJOR_FACTIONS } from '../../constants/gameConstants';

interface FactionsPanelProps {
  reputation: FactionReputation;
}

const getReputationTier = (score: number): { label: string; color: string } => {
    if (score <= -10) return { label: 'Hated', color: 'text-red-400' };
    if (score <= -5) return { label: 'Hostile', color: 'text-red-500' };
    if (score < 0) return { label: 'Mistrusted', color: 'text-yellow-400' };
    if (score === 0) return { label: 'Neutral', color: 'text-slate-400' };
    if (score < 5) return { label: 'Noticed', color: 'text-teal-300' };
    if (score < 10) return { label: 'Favored', color: 'text-teal-200' };
    return { label: 'Allied', color: 'text-teal-300' };
};


const FactionsPanel: React.FC<FactionsPanelProps> = ({ reputation }) => {

  if (Object.keys(reputation).length === 0) {
    return (
      <div id="tabpanel-factions" role="tabpanel" aria-labelledby="tab-factions" className="text-center p-6 text-slate-400 font-ui italic bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20">
        <p>Your actions have not yet drawn the attention of the great powers.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-factions" role="tabpanel" aria-labelledby="tab-factions" className="space-y-4 stagger-in max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
      {MAJOR_FACTIONS.map((factionName, index) => {
        const repData = reputation[factionName];
        if (!repData) return null;

        const tier = getReputationTier(repData.score);
        const hasHistory = repData.history.length > 0;
        
        return (
            <details key={factionName} className="faction-details bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20 transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <summary className={`font-bold text-lg font-heading p-3 list-none flex justify-between items-center transition-colors ${hasHistory ? 'cursor-pointer hover:bg-slate-800/20' : ''} rounded-t-lg`}>
                    <div className="flex items-center gap-3">
                        {hasHistory && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 chevron transition-transform duration-200 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                        <span className="text-violet-300">{factionName}</span>
                    </div>
                    <span className={`font-ui font-semibold ${tier.color}`}>{tier.label}</span>
                </summary>
                 {hasHistory && (
                    <div className="p-4 border-t border-violet-400/20 space-y-2">
                        <h5 className="text-xs font-ui uppercase tracking-wider text-slate-400 font-bold">Log:</h5>
                        <ul className="list-disc list-inside space-y-1">
                        {repData.history.map((entry, i) => (
                          <li key={i} className="text-slate-300 font-body text-sm italic">
                            {entry}
                          </li>
                        ))}
                        </ul>
                    </div>
                 )}
            </details>
        );
      })}
        <style>{`
            .stagger-in > * {
                opacity: 0;
                animation: reveal-item 0.6s ease-out forwards;
            }

            .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
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

            .faction-details .chevron {
                transition: transform 0.2s ease-in-out;
            }
            .faction-details[open] .chevron {
                transform: rotate(90deg);
            }
            .faction-details > summary::-webkit-details-marker {
                display: none;
            }
            
            .faction-details > div {
                animation: slide-down 0.3s ease-out;
            }

            @keyframes slide-down {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
      `}</style>
    </div>
  );
};

export default FactionsPanel;