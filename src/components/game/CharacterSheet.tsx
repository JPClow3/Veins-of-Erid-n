import React, { memo } from 'react';
import type { CharacterProfile, PersonalityLean } from '../../types/character';
import { AFFINITIES, VISUAL_MARKS } from '../../constants/gameConstants';

interface CharacterSheetProps {
  character: CharacterProfile;
}

// --- Icons ---
const IconGender = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const IconOrigin = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" /></svg>;
const IconAffinity = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconMark = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;

const IconEmpathy = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1-1v-.5a1.5 1.5 0 01-3 0v.5a1 1 0 00-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>;
const IconCunning = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>;
const IconResolve = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-1.097.023l-7 4.5a1 1 0 000 1.794l7 4.5a1 1 0 001.096-.023l7-4.5a1 1 0 000-1.794l-7-4.5z" /><path d="M10.394 6.08a1 1 0 00-1.097.023l-7 4.5a1 1 0 000 1.794l7 4.5a1 1 0 001.096-.023l7-4.5a1 1 0 000-1.794l-7-4.5z" /></svg>;
const IconLore = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" /></svg>;

const personalityStyles: Record<PersonalityLean, { icon: React.ReactNode; colors: { text: string; bg: string; shadow: string }}> = {
    Empathy: { icon: <IconEmpathy/>, colors: { text: 'text-cyan-400', bg: 'bg-cyan-400', shadow: '#22d3ee' } },
    Cunning: { icon: <IconCunning/>, colors: { text: 'text-purple-400', bg: 'bg-purple-400', shadow: '#c084fc' } },
    Resolve: { icon: <IconResolve/>, colors: { text: 'text-red-400', bg: 'bg-red-400', shadow: '#f87171' } },
    Lore: { icon: <IconLore/>, colors: { text: 'text-blue-400', bg: 'bg-blue-400', shadow: '#60a5fa' } },
};

// --- Components ---

const Attribute: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-accent-secondary mt-1 shrink-0">{icon}</div>
    <div>
      <div className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider">{label}</div>
      <div className="font-body text-text-primary text-base">{value}</div>
    </div>
  </div>
);

const RarityBadge: React.FC<{ rarity: 'Common' | 'Uncommon' | 'Rare' }> = ({ rarity }) => {
    const rarityClasses = {
        Common: 'bg-surface-muted text-text-secondary',
        Uncommon: 'bg-teal-800/80 text-teal-200',
        Rare: 'bg-accent-primary/30 text-accent-primary ring-1 ring-accent-primary/30',
    };
    return <span className={`ml-2 text-xs font-ui font-bold px-2 py-0.5 rounded-full ${rarityClasses[rarity]}`}>{rarity}</span>
}

const StatBar: React.FC<{ label: string; value: number; max: number; tooltip: string; colorClasses: { bg: string; shadow: string; } }> = ({ label, value, max, tooltip, colorClasses }) => {
    const percentage = Math.max(0, (value / max) * 100);
    return (
        <div className="w-full group relative">
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider">{label}</span>
                <span className={`font-ui text-sm font-bold ${colorClasses.bg.replace('bg-', 'text-')}`}>{value} / {max}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses.bg}`}
                    style={{ width: `${percentage}%`, boxShadow: `0 0 8px var(${colorClasses.shadow})` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={`${label} level`}
                ></div>
            </div>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-surface text-text-primary text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10">
                {tooltip}
            </div>
        </div>
    );
};

const getStrainColor = (value: number, max: number): { bg: string, shadow: string } => {
    const percentage = value / max;
    if (percentage > 0.75) return { bg: 'bg-error', shadow: '--color-feedback-error' };
    if (percentage > 0.4) return { bg: 'bg-yellow-500', shadow: '--color-accent-secondary' };
    return { bg: 'bg-green-500', shadow: '--color-accent-secondary' };
};


const PersonalityBar: React.FC<{ 
    label: PersonalityLean; 
    score: number; 
    maxScore: number;
    icon: React.ReactNode;
    colorClasses: { text: string; bg: string; shadow: string };
}> = ({ label, score, maxScore, icon, colorClasses }) => {
    const percentage = Math.max(5, (score / maxScore) * 100);
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold font-ui text-xs uppercase tracking-wider flex items-center gap-1.5 ${colorClasses.text}`}>
                    {icon}
                    {label}
                </span>
                <span className={`font-ui text-sm font-bold ${colorClasses.text}`}>{score}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses.bg}`} 
                    style={{ width: `${percentage}%`, boxShadow: `0 0 6px ${colorClasses.shadow}` }}
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={maxScore}
                    aria-label={`${label} score`}
                ></div>
            </div>
        </div>
    );
};

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  const affinityDetails = AFFINITIES[character.awakenedAffinity];
  const affinityName = affinityDetails.name;
  const affinityRarity = affinityDetails.rarity;
  
  const rarityClasses = {
    Common: 'border-transparent',
    Uncommon: 'border-teal-500/50 shadow-lg shadow-teal-500/10',
    Rare: 'border-accent-primary/50 animate-pulse-glow-rare',
  };

  const personalityScores = Object.entries(character.personality) as [PersonalityLean, number][];
  const maxScore = Math.max(10, ...personalityScores.map(([, score]) => score));
  const MAX_STRAIN = 100;
  const MAX_ECHO = 100;

  const affinityValue = (
    <div className="relative group">
        <span>{affinityName}<RarityBadge rarity={affinityRarity} /></span>
        <div className="absolute bottom-full mb-2 left-0 w-max max-w-xs bg-surface text-text-primary text-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10 font-body">
            <p className="font-bold text-accent-secondary">{affinityDetails.name}</p>
            <p className="font-normal whitespace-normal italic">“{affinityDetails.description}”</p>
        </div>
    </div>
  );

  return (
    <div className="bg-surface-muted/30 rounded-lg p-4 ring-1 ring-border flex-shrink-0">
      <h3 className="font-bold text-xl font-heading text-accent-primary border-b border-border pb-2 mb-4">
        {character.name}
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Attribute icon={<IconGender />} label="Identity" value={character.gender} />
            <Attribute icon={<IconOrigin />} label="Origin" value={character.background} />
            <div className="relative group flex items-start gap-3">
                <div className="text-accent-secondary mt-1 shrink-0"><IconMark /></div>
                <div>
                  <div className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider">Flow Vein Mark</div>
                  <div className="font-body text-text-primary text-base cursor-pointer underline decoration-dotted decoration-text-secondary/50 hover:decoration-accent-secondary">On {character.visualMark}</div>
                </div>
                <div className="absolute bottom-full mb-2 left-0 w-max max-w-xs bg-surface text-text-primary text-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10 font-body">
                    <p className="font-bold text-accent-secondary">Mark on {character.visualMark}</p>
                    <p className="font-normal whitespace-normal italic mt-1">“{VISUAL_MARKS[character.visualMark].description}”</p>
                    <p className="font-normal whitespace-normal mt-2"><span className="font-semibold">Social Consequence:</span> {VISUAL_MARKS[character.visualMark].socialConsequence}</p>
                </div>
            </div>
             <div className={`p-2 -m-2 rounded-lg border transition-all duration-300 ${rarityClasses[affinityRarity]}`}>
                <Attribute icon={<IconAffinity />} label="Awakened Affinity" value={affinityValue} />
             </div>
        </div>
        
        <div>
            <h4 className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider mb-3">Personality</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {personalityScores.map(([lean, score]) => {
                const styles = personalityStyles[lean];
                return (
                    <PersonalityBar 
                        key={lean} 
                        label={lean} 
                        score={score} 
                        maxScore={maxScore}
                        icon={styles.icon}
                        colorClasses={styles.colors}
                    />
                );
              })}
            </div>
        </div>
        
         <div>
            <h4 className="font-semibold text-text-secondary font-ui text-xs uppercase tracking-wider mb-3">Resonance State</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <StatBar 
                    label="Vein-Strain"
                    value={character.veinStrain}
                    max={MAX_STRAIN}
                    tooltip="The physical toll of channeling Flow. High strain can have dangerous consequences."
                    colorClasses={getStrainColor(character.veinStrain, MAX_STRAIN)}
                />
                 <StatBar 
                    label="Echo Level"
                    value={character.echoLevel}
                    max={MAX_ECHO}
                    tooltip="Your magical signature in the world. A high echo can be tracked and may attract unwanted attention."
                    colorClasses={{ bg: 'bg-accent-primary', shadow: '--color-shadow-primary' }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterSheet);