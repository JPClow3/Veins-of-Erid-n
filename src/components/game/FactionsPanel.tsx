import React from 'react';
import type { FactionReputation } from '../../types/game';
import { MAJOR_FACTIONS } from '../../constants/gameConstants';

interface FactionsPanelProps {
  reputation: FactionReputation;
}

const IconHated = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
const IconHostile = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M14.707 13.293a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>;
const IconNeutral = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const IconNoticed = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 6.707a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>;
const IconAllied = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

const getReputationTier = (score: number): { label: string; color: string; classes: string; icon: React.ReactNode } => {
    if (score <= -10) return { label: 'Hated', color: 'text-error', classes: 'bg-error/20 ring-error/30', icon: <IconHated /> };
    if (score <= -5) return { label: 'Hostile', color: 'text-orange-400', classes: 'bg-orange-400/20 ring-orange-400/30', icon: <IconHostile /> };
    if (score < 0) return { label: 'Mistrusted', color: 'text-yellow-400', classes: 'bg-yellow-400/20 ring-yellow-400/30', icon: <IconHostile /> };
    if (score === 0) return { label: 'Neutral', color: 'text-text-secondary', classes: 'bg-surface-muted/30 ring-border', icon: <IconNeutral /> };
    if (score < 5) return { label: 'Noticed', color: 'text-cyan-300', classes: 'bg-cyan-400/20 ring-cyan-400/30', icon: <IconNoticed /> };
    if (score < 10) return { label: 'Favored', color: 'text-cyan-200', classes: 'bg-cyan-300/20 ring-cyan-300/30', icon: <IconAllied /> };
    return { label: 'Allied', color: 'text-green-300', classes: 'bg-green-400/20 ring-green-400/30', icon: <IconAllied /> };
};


const FactionsPanel: React.FC<FactionsPanelProps> = ({ reputation }) => {

  if (Object.keys(reputation).length === 0) {
    return (
      <div id="tabpanel-factions" role="tabpanel" aria-labelledby="tab-factions" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>Your actions have not yet drawn the attention of the great powers.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-factions" role="tabpanel" aria-labelledby="tab-factions" className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
      {MAJOR_FACTIONS.map((factionName) => {
        const repData = reputation[factionName];
        if (!repData) return null;

        const tier = getReputationTier(repData.score);
        const hasHistory = repData.history.length > 0;
        
        return (
            <div key={factionName} className={`rounded-lg ring-1 p-3 transition-all ${tier.classes}`}>
                <div className="flex justify-between items-center">
                    <span className="font-heading text-accent-primary text-base">{factionName}</span>
                    <div className={`font-ui font-semibold text-sm flex items-center gap-1.5 ${tier.color}`}>
                        {tier.icon}
                        <span>{tier.label} ({repData.score})</span>
                    </div>
                </div>
                 {hasHistory && (
                    <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-text-secondary hover:text-text-primary font-ui text-xs">Show Log</summary>
                        <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
                        {repData.history.map((entry, i) => (
                          <li key={i} className="text-text-secondary font-body italic">
                            {entry}
                          </li>
                        ))}
                        </ul>
                    </details>
                 )}
            </div>
        );
      })}
    </div>
  );
};

export default FactionsPanel;