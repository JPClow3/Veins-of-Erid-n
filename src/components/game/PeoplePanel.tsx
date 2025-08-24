import React from 'react';
import type { DramatisPersonae } from '../../types/game';
import { FACTIONS } from '../../constants/gameConstants';

interface PeoplePanelProps {
  dramatisPersonae: DramatisPersonae;
}

const FactionIcon: React.FC<{ factionName: string }> = ({ factionName }) => {
    const factionKey = (Object.keys(FACTIONS) as Array<keyof typeof FACTIONS>).find(k => FACTIONS[k].name === factionName);
    const symbol = factionKey ? FACTIONS[factionKey].symbol : 'An unknown sigil.';

    return (
        <div className="tooltip-container relative group flex items-center justify-center">
            <div className="h-8 w-8 flex items-center justify-center bg-slate-800/50 rounded-full ring-1 ring-slate-700 text-violet-300 text-sm font-heading" title={factionName}>
                {symbol.includes(' ') ? symbol.split(' ').map(word => word[0]).join('') : symbol[0]}
            </div>
            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-slate-950 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-violet-400/20 z-10">
                <p className="font-bold text-violet-300">{factionName}</p>

                <p className="text-slate-300">{symbol}</p>
            </div>
        </div>
    );
};

const PeoplePanel: React.FC<PeoplePanelProps> = ({ dramatisPersonae }) => {
  const characters = Object.entries(dramatisPersonae);

  if (characters.length === 0) {
    return (
      <div id="tabpanel-people" role="tabpanel" aria-labelledby="tab-people" className="text-center p-6 text-slate-400 font-ui italic bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20">
        <p>You have not met anyone of consequence yet. The path ahead is solitary for now.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-people" role="tabpanel" aria-labelledby="tab-people" className="space-y-3 stagger-in max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
      {characters.map(([name, data], index) => (
        <div key={name} className="bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20 p-4 flex items-start gap-4" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex-shrink-0 mt-1">
                <FactionIcon factionName={data.faction} />
            </div>
            <div>
                <h4 className="font-bold text-lg font-heading text-violet-300">{name}</h4>
                <p className="text-slate-300 font-body text-base leading-relaxed italic">&ldquo;{data.description}&rdquo;</p>
            </div>
        </div>
      ))}
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
      `}</style>
    </div>
  );
};

export default PeoplePanel;