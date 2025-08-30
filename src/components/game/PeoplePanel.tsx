import React, { useState, Fragment } from 'react';
import type { DramatisPersonae } from '../../types/game';
import { FACTIONS } from '../../constants/gameConstants';
import useGameStore from '../../store/gameStore';

interface PeoplePanelProps {
  dramatisPersonae: DramatisPersonae;
}

type NpcWithDetails = { name: string } & DramatisPersonae[string];

const FactionIcon: React.FC<{ factionName: string }> = ({ factionName }) => {
    const factionKey = (Object.keys(FACTIONS) as Array<keyof typeof FACTIONS>).find(k => FACTIONS[k].name === factionName);
    const symbol = factionKey ? FACTIONS[factionKey].symbol : 'An unknown sigil.';
    const ideology = factionKey ? FACTIONS[factionKey].ideology : 'Their motives are unknown.';
    const initial = symbol.includes(' ') ? symbol.split(' ').map(word => word[0]).join('') : symbol[0];


    return (
        <div className="tooltip-container relative group flex items-center justify-center">
            <div className="h-8 w-8 flex items-center justify-center bg-surface-muted rounded-full ring-1 ring-border text-accent-primary text-sm font-heading" title={factionName}>
                {initial}
            </div>
            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-surface text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10 text-left">
                <p className="font-bold text-accent-primary">{factionName}</p>
                <p className="text-text-primary font-body italic whitespace-normal mt-1">“{ideology}”</p>
                <p className="text-text-secondary mt-2 text-right text-[10px] uppercase tracking-wider">Symbol: {symbol}</p>
            </div>
        </div>
    );
};

const NpcDetailModal: React.FC<{ npc: NpcWithDetails, onClose: () => void }> = ({ npc, onClose }) => {
    const { setHighlightedTab } = useGameStore(state => ({ setHighlightedTab: state.setHighlightedTab }));

    const handleFactionClick = () => {
        setHighlightedTab('Factions');
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            <div className="relative bg-surface rounded-xl p-6 max-w-lg w-full ring-1 ring-border-accent shadow-2xl shadow-glow-secondary transform animate-fade-in-up">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-accent-primary font-heading">{npc.name}</h3>
                        <p className="text-accent-secondary font-ui text-sm font-semibold">
                            {npc.role} - <button onClick={handleFactionClick} className="underline decoration-dotted hover:decoration-solid hover:text-accent-primary-hover transition">{npc.faction}</button>
                        </p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                </div>
                <div className="space-y-4 font-body text-lg">
                  <p className="text-text-primary leading-relaxed italic">&ldquo;{npc.description}&rdquo;</p>
                  <div className="border-t border-border pt-4 space-y-2 text-base">
                      <p><strong className="font-semibold text-text-secondary font-ui">Disposition:</strong> <span className="text-text-primary">{npc.disposition}</span></p>
                      <p><strong className="font-semibold text-text-secondary font-ui">Motivation:</strong> <span className="text-text-primary italic">{npc.motivation}</span></p>
                  </div>
                </div>
            </div>
        </div>
    );
};

const PeoplePanel: React.FC<PeoplePanelProps> = ({ dramatisPersonae }) => {
  const [selectedNpc, setSelectedNpc] = useState<NpcWithDetails | null>(null);
  const characters = Object.entries(dramatisPersonae);

  if (characters.length === 0) {
    return (
      <div id="tabpanel-people" role="tabpanel" aria-labelledby="tab-people" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>You have not met anyone of consequence yet. The path ahead is solitary for now.</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div id="tabpanel-people" role="tabpanel" aria-labelledby="tab-people" className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {characters.map(([name, data]) => (
          <button key={name} onClick={() => setSelectedNpc({ name, ...data })} className="w-full text-left bg-surface-muted/30 hover:bg-surface-muted rounded-lg ring-1 ring-border hover:ring-accent-primary/50 p-4 flex items-start gap-4 transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <div className="flex-shrink-0 mt-1">
                  <FactionIcon factionName={data.faction} />
              </div>
              <div>
                  <h4 className="font-bold text-lg font-heading text-accent-primary">{name}</h4>
                  <p className="text-text-primary font-body text-base leading-relaxed italic">&ldquo;{data.description}&rdquo;</p>
              </div>
          </button>
        ))}
      </div>
      {selectedNpc && <NpcDetailModal npc={selectedNpc} onClose={() => setSelectedNpc(null)} />}
    </Fragment>
  );
};

export default PeoplePanel;
