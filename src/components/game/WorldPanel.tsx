import React, { useState } from 'react';
import type { World, WorldEvent } from '../../types/game';

interface WorldPanelProps {
  world: World;
  worldTimeline: WorldEvent[];
}

const MapBackground = () => (
    <svg className="absolute inset-0 w-full h-full text-border/50" preserveAspectRatio="none">
        {/* Abstract landmasses and features */}
        <path d="M 10 20 C 30 10, 60 10, 80 30 S 100 80, 80 90 C 60 100, 30 100, 10 80 Z" fill="rgba(138, 66, 245, 0.03)" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 30 70 C 40 60, 60 65, 70 75 S 60 95, 40 90 C 20 85, 20 80, 30 70 Z" fill="rgba(138, 66, 245, 0.05)" stroke="currentColor" strokeWidth="0.5" />
        <path d="M 60 20 C 70 15, 85 20, 90 30 S 80 50, 65 45 C 50 40, 50 25, 60 20 Z" fill="rgba(138, 66, 245, 0.04)" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.5"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" opacity="0.3"/>
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.2" opacity="0.3"/>
    </svg>
);


const WorldPanel: React.FC<WorldPanelProps> = ({ world, worldTimeline }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const locations = Object.entries(world);
  
  const currentSelection = selectedLocation ? world[selectedLocation] : null;

  if (locations.length === 0 && worldTimeline.length === 0) {
    return (
      <div id="tabpanel-world" role="tabpanel" aria-labelledby="tab-world" className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
        <p>You have not yet explored the wider world. A blank map awaits.</p>
      </div>
    );
  }

  return (
    <div id="tabpanel-world" role="tabpanel" aria-labelledby="tab-world" className="space-y-4">
      {locations.length > 0 && (
         <div className="relative aspect-video bg-surface rounded-lg overflow-hidden ring-1 ring-border shadow-inner-glow">
            <MapBackground />
            <div className="absolute inset-0">
            {locations.map(([name, data]) => (
                <div
                key={name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${data.x}%`, top: `${data.y}%` }}
                >
                <button
                    onClick={() => setSelectedLocation(name)}
                    aria-label={`Select location: ${name}`}
                    className={`relative group w-4 h-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent-primary
                    ${selectedLocation === name ? 'bg-accent-secondary ring-2 ring-accent-secondary/50 scale-125' : 'bg-accent-primary/70 hover:bg-accent-primary'}`}
                >
                    <div className="absolute inset-0 rounded-full animate-ping-slow bg-accent-primary opacity-50"></div>
                    <div className="absolute inset-0 rounded-full bg-accent-primary opacity-80"></div>

                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-surface text-text-primary text-xs font-bold font-heading rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10">
                        {name}
                    </div>
                </button>
                </div>
            ))}
            </div>
        </div>
      )}
      
      {locations.length > 0 && (
        <div className="p-4 bg-surface-muted/30 rounded-lg ring-1 ring-border min-h-[100px] animate-fade-in">
            {currentSelection ? (
                <div>
                    <h4 className="font-bold text-lg font-heading text-accent-primary">{selectedLocation}</h4>
                    <p className="text-text-primary font-body text-base leading-relaxed">{currentSelection.description}</p>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-text-secondary font-ui italic">Select a location on the map to view details.</p>
                </div>
            )}
        </div>
      )}

      {worldTimeline.length > 0 && (
         <div className="p-4 bg-surface-muted/30 rounded-lg ring-1 ring-border animate-fade-in">
             <h4 className="font-bold text-lg font-heading text-accent-primary mb-2">World Timeline</h4>
                <ul className="space-y-2 text-text-primary font-body text-sm">
                    {worldTimeline.map((event, index) => (
                        <li key={index} className="border-l-2 border-border-accent pl-3">
                            <strong className="text-accent-secondary">Act {event.act}:</strong>
                            <p className="text-text-secondary italic">{event.summary}</p>
                        </li>
                    ))}
                </ul>
        </div>
      )}


       <style>{`
        @keyframes ping-slow {
            75%, 100% {
                transform: scale(2.5);
                opacity: 0;
            }
        }
        .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WorldPanel;