import React, { useState, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import { NATIONS, FACTIONS } from '../../constants/gameConstants';

const Section: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="lore-details bg-surface-muted/30 rounded-lg ring-1 ring-border" open={defaultOpen}>
        <summary className="font-bold text-base font-heading text-accent-primary p-3 cursor-pointer list-none flex justify-between items-center transition-colors hover:bg-surface-muted rounded-t-lg">
            <span>{title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 chevron transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </summary>
        <div className="p-4 border-t border-border">
            {children}
        </div>
    </details>
);

type NationEntry = [string, typeof NATIONS[keyof typeof NATIONS]];
const NationsSection: React.FC<{ nationEntries: NationEntry[] }> = ({ nationEntries }) => {
    if (nationEntries.length === 0) {
        return <p className="text-text-secondary italic">No matching nations found.</p>;
    }

    return (
        <div className="space-y-4">
            {nationEntries.map(([key, data]) => (
                <div key={key}>
                    <h3 className="text-lg font-heading text-accent-secondary">{data.name}</h3>
                    <p>{data.description}</p>
                </div>
            ))}
        </div>
    );
};

type FactionEntry = [string, typeof FACTIONS[keyof typeof FACTIONS]];
const FactionsSection: React.FC<{ factionEntries: FactionEntry[] }> = ({ factionEntries }) => {
    if (factionEntries.length === 0) {
        return <p className="text-text-secondary italic">No matching factions found.</p>;
    }

    return (
        <div className="space-y-4">
            {factionEntries.map(([key, data]) => (
                <div key={key}>
                    <h3 className="text-lg font-heading text-accent-secondary">{data.name}</h3>
                    <p><span className="font-semibold">Symbol:</span> {data.symbol}</p>
                    <p className="italic mt-1">“{data.ideology}”</p>
                </div>
            ))}
        </div>
    );
};


const LorePanel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { nations: knownNations, factions: knownFactions } = useGameStore(state => state.knowledge);

    const filteredNations = useMemo(() => {
        if (!searchTerm) {
            return Object.entries(NATIONS).filter(([key]) => knownNations.includes(key));
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return Object.entries(NATIONS)
            .filter(([key]) => knownNations.includes(key))
            .filter(([, data]) => 
                data.name.toLowerCase().includes(lowerCaseSearch) ||
                data.description.toLowerCase().includes(lowerCaseSearch)
            );
    }, [searchTerm, knownNations]);

    const filteredFactions = useMemo(() => {
        if (!searchTerm) {
             return Object.entries(FACTIONS).filter(([key]) => knownFactions.includes(key));
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
         return Object.entries(FACTIONS)
            .filter(([key]) => knownFactions.includes(key))
            .filter(([, data]) => 
                data.name.toLowerCase().includes(lowerCaseSearch) ||
                data.ideology.toLowerCase().includes(lowerCaseSearch)
            );
    }, [searchTerm, knownFactions]);

    const hasAnyLore = knownNations.length > 0 || knownFactions.length > 0;

    return (
        <div id="tabpanel-lore" role="tabpanel" aria-labelledby="tab-lore" className="space-y-3 font-body text-text-primary leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
            {hasAnyLore && (
                 <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Search lore..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-muted/50 border border-border rounded-lg p-2 pl-8 pr-8 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all font-ui text-sm placeholder:text-text-secondary"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {!hasAnyLore ? (
                <div className="text-center p-6 text-text-secondary font-ui italic bg-surface-muted/30 rounded-lg ring-1 ring-border">
                    <p>You have not yet discovered any specific lore about the world's factions or nations. Knowledge is a treasure waiting to be unearthed.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <style>{`
                        .lore-details .chevron { transition: transform 0.2s ease-in-out; }
                        .lore-details[open] .chevron { transform: rotate(90deg); }
                        .lore-details > summary::-webkit-details-marker { display: none; }
                        .lore-details > div { animation: fade-in 0.3s ease-out; }
                    `}</style>
                    <Section title="Nations" defaultOpen={filteredNations.length > 0}>
                        <NationsSection nationEntries={filteredNations} />
                    </Section>
                    <Section title="Factions" defaultOpen={filteredFactions.length > 0}>
                        <FactionsSection factionEntries={filteredFactions} />
                    </Section>
                </div>
            )}
        </div>
    );
};

export default LorePanel;