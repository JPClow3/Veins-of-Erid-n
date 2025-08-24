import React, { memo } from 'react';
import type { CharacterProfile, PersonalityLean } from '../../types/character';
import { AFFINITIES, PERSONALITY_LEANS } from '../../constants/gameConstants';

interface CharacterSheetProps {
  character: CharacterProfile;
}

const IconGender = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const IconOrigin = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" /></svg>;
const IconAffinity = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconMark = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;

const Attribute: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; style?: React.CSSProperties }> = ({ icon, label, value, style }) => (
  <div className="flex items-start gap-3" style={style}>
    <div className="text-teal-400 mt-1 shrink-0">{icon}</div>
    <div>
      <div className="font-semibold text-slate-400 font-ui text-xs uppercase tracking-wider">{label}</div>
      <div className="font-body text-slate-300 text-base">{value}</div>
    </div>
  </div>
);

const RarityBadge: React.FC<{ rarity: 'Common' | 'Uncommon' | 'Rare' }> = ({ rarity }) => {
    const rarityClasses = {
        Common: 'bg-slate-700 text-slate-300',
        Uncommon: 'bg-teal-800/80 text-teal-200',
        Rare: 'bg-violet-900/80 text-violet-200 ring-1 ring-violet-300/30',
    };
    return <span className={`ml-2 text-xs font-ui font-bold px-2 py-0.5 rounded-full ${rarityClasses[rarity]}`}>{rarity}</span>
}

const PersonalityBar: React.FC<{ label: PersonalityLean; score: number; maxScore: number }> = ({ label, score, maxScore }) => {
    const percentage = Math.max(5, (score / maxScore) * 100);
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-400 font-ui text-xs uppercase tracking-wider">{label}</span>
                <span className="font-ui text-xs text-teal-300">{score}</span>
            </div>
            <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                    className="h-2 bg-teal-400 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${percentage}%` }}
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

  const personalityScores = Object.entries(character.personality) as [PersonalityLean, number][];
  const maxScore = Math.max(10, ...personalityScores.map(([, score]) => score));

  return (
    <div className="bg-slate-950/30 rounded-lg p-4 ring-1 ring-violet-400/20 flex-shrink-0">
      <h3 className="font-bold text-xl font-heading text-violet-300 border-b border-violet-400/20 pb-2 mb-4">
        {character.name}
      </h3>
      <div className="space-y-5 stagger-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Attribute icon={<IconGender />} label="Identity" value={character.gender} />
            <Attribute icon={<IconOrigin />} label="Origin" value={character.background} />
            <Attribute icon={<IconAffinity />} label="Awakened Affinity" value={<>{affinityName}<RarityBadge rarity={affinityRarity} /></>} />
            <Attribute icon={<IconMark />} label="Flow Vein Mark" value={`On ${character.visualMark}`} />
        </div>
        <div>
            <h4 className="font-semibold text-slate-400 font-ui text-xs uppercase tracking-wider mb-2">Personality</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {personalityScores.map(([lean, score]) => (
                <PersonalityBar key={lean} label={lean} score={score} maxScore={maxScore} />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterSheet);