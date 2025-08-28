import type { PersonalityLean, Affinity } from './character';

export interface GeminiCreationResponse {
  description: string;
  choices: string[];
}

export interface JournalUpdate {
  thread: string;
  entry: string;
  status: 'new' | 'updated' | 'completed';
}

export type Journal = Record<string, {
  entries: string[];
  status: 'new' | 'updated' | 'completed';
}>;

export interface LocationUpdate {
  name: string;
  description: string;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
}

export type World = Record<string, {
  description: string;
  x: number;
  y: number;
}>;

export interface Choice {
  text: string;
  lean?: PersonalityLean | 'Neutral';
}

// Dramatis Personae System
export interface NpcProfile {
  name: string;
  description: string; // From PC's perspective
  faction: string;
  status: 'new' | 'updated';
  role: string; // e.g. "Spymaster"
  disposition: string; // e.g. "Wary", "Intrigued"
  motivation: string; // e.g. "Seeks to preserve Veyran stability"
}
export type DramatisPersonae = Record<string, Omit<NpcProfile, 'name' | 'status'>>;


// Faction Reputation System
export interface ReputationUpdate {
  faction: string;
  change: number; // e.g., +1, -2
  reason: string; // Narrative reason for the change
}
export type FactionReputation = Record<string, {
  score: number;
  history: string[];
}>;

// Inventory System
export type ItemCategory = 'Key Item' | 'Consumable' | 'Document';
export interface Item {
    name: string;
    description: string;
    category: ItemCategory;
}
export interface ItemUpdate {
    action: 'add' | 'remove';
    itemName: string;
    description: string;
    category: ItemCategory;
}

export interface CharacterStatsUpdate {
  veinStrainChange?: number; // Relative change
  echoLevelChange?: number; // Relative change
  reason: string;
}


export interface GeminiSceneResponse {
  description: string;
  choices: Choice[];
  imagePrompt: string;
  gameOver: boolean;
  endingDescription: string;
  journalUpdate?: JournalUpdate;
  allowCustomAction?: boolean;
  allowExamineAction?: boolean;
  locationUpdate?: LocationUpdate;
  actTransition?: {
    newAct: number;
    reason: string;
  };
  reputationUpdate?: ReputationUpdate;
  npcUpdate?: NpcProfile;
  itemUpdate?: ItemUpdate;
  soundEffect?: string;
  ambientTrack?: string;
  magicEffect?: { intensity: 'subtle' | 'powerful' };
  characterStatsUpdate?: CharacterStatsUpdate;
  loreUnlock?: { type: 'faction' | 'nation' | 'affinity', key: string };
}

export interface GameState extends Omit<GeminiSceneResponse, 'choices'> {
  choices: (string | Choice)[]; // Allow string for character creation
  imageUrl: string | null;
  act: number;
}

export interface StoryTurn {
    action: string;
    description:string;
}

export type CreationStep = 'GENDER' | 'BACKGROUND' | 'NAME' | 'AFFINITY' | 'PERSONALITY' | 'MARK';