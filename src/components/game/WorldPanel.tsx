import React from 'react';
import type { World } from '../../types/game';

interface WorldPanelProps {
  world: World;
}

const WorldPanel: React.FC<WorldPanelProps> = ({ world }) => {
  const locations = Object.entries(world);

  if (locations.length === 0) {
    return (
      <div id="tabpanel-world" role="tabpanel" aria-labelledby="tab-world" className="text-center p-6 text-slate-400 font-ui italic bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20">
        <p>You have not yet explored the wider world. A blank map awaits.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-world" role="tabpanel" aria-labelledby="tab-world" className="space-y-3 stagger-in">
      {locations.map(([name, data], index) => (
        <div key={name} className="bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20 p-4" style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-bold text-lg font-heading text-violet-300">{name}</h4>
            <p className="text-slate-300 font-body text-base leading-relaxed">{data.description}</p>
        </div>
      ))}
    </div>
  );
};

export default WorldPanel;