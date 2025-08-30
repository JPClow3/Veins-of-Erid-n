import React from 'react';
import type { Feat } from '../../types/game';

interface FeatsPanelProps {
  feats: Feat[];
}

const FeatsPanel: React.FC<FeatsPanelProps> = ({ feats }) => {
  if (feats.length === 0) {
    return (
      <div id="tabpanel-feats" role="tabpanel" aria-labelledby="tab-feats" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>No great feats have been accomplished yet. Your legend is still waiting to be written.</p>
      </div>
    );
  }

  const sortedFeats = [...feats].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div id="tabpanel-feats" role="tabpanel" aria-labelledby="tab-feats" className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
      {sortedFeats.map((feat) => (
        <div key={feat.name} className="bg-surface-muted/30 rounded-lg ring-1 ring-border-accent p-3 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h4 className="font-heading text-accent-secondary text-base font-bold">{feat.name}</h4>
          </div>
          <p className="text-text-primary font-body text-sm mt-1 pl-8">{feat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatsPanel;
