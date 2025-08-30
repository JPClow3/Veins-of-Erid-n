import React from 'react';
import type { Sanctum } from '../../types/game';

interface SanctumPanelProps {
  sanctum: Sanctum | null;
}

const SanctumPanel: React.FC<SanctumPanelProps> = ({ sanctum }) => {
  if (!sanctum) {
    return (
      <div id="tabpanel-sanctum" role="tabpanel" aria-labelledby="tab-sanctum" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>You have not yet established a personal sanctum.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-sanctum" role="tabpanel" aria-labelledby="tab-sanctum" className="p-4 bg-surface-muted/30 rounded-lg ring-1 ring-border space-y-4">
      <div>
        <h4 className="font-bold text-lg font-heading text-accent-primary flex justify-between items-center">
          <span>{sanctum.name}</span>
          <span className="text-sm font-ui text-accent-secondary">Level {sanctum.level}</span>
        </h4>
        <p className="text-text-primary font-body text-base mt-1 italic">"{sanctum.description}"</p>
      </div>
      
      {sanctum.upgrades.length > 0 && (
        <div>
          <h5 className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider mb-2">Upgrades</h5>
          <ul className="list-disc list-inside space-y-1 text-sm font-body text-text-primary">
            {sanctum.upgrades.map((upgrade, index) => (
              <li key={index}>{upgrade}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SanctumPanel;
