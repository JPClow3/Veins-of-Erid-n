// Character Creation Types
export type Gender = 'Male' | 'Female' | 'Nonbinary';
export type Background = 'Noble Ward' | 'Merchant Heir' | 'Temple Acolyte' | "Wanderer's Child";
export type Affinity = 
  // Common
  'Emberflow' | 'Stoneflow' | 'Tideflow' | 'Zephyrflow' |
  // Uncommon
  'Bloomflow' | 'Stormflow' | 'Shadeflow' | 'Crystalflow' |
  // Rare
  'Aetherflow' | 'Chronoflow' | 'Soulflow';

export type PersonalityLean = 'Empathy' | 'Cunning' | 'Resolve' | 'Lore';
export type VisualMark = 'Arms' | 'Chest & Back' | 'Face';

export interface CharacterProfile {
  name: string;
  gender: Gender;
  background: Background;
  awakenedAffinity: Affinity;
  dormantAffinity: Affinity;
  initialPersonalityLean: PersonalityLean; // The choice made during creation
  personality: Record<PersonalityLean, number>; // Evolving scores
  visualMark: VisualMark;
}