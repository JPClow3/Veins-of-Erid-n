import type { Affinity } from "../types/character";

export const STORY_MODEL = 'gemini-2.5-flash';
export const IMAGE_MODEL = 'imagen-3.0-generate-002';
export const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

export const GENDERS = ['Male', 'Female', 'Nonbinary'] as const;

export const BACKGROUNDS = {
  'Noble Ward': {
    description: 'Raised in the gilded cage of the Veyran court, taught that your Flow is a tool of the state. You know the art of the veiled threat and the price of a misplaced word.',
    skillHint: 'An innate understanding of courtly politics and noble etiquette.',
    factionLean: "Veyra's Royal Conservatory",
  },
  'Merchant Heir': {
    description: "You are a child of Ardelane's Great Houses, where a person's worth is tallied on a ledger. Your Flow is not a gift, but an asset to be leveraged.",
    skillHint: 'A natural talent for negotiation, appraisal, and identifying leverage.',
    factionLean: "Ardelane's Flow Brokerage",
  },
  'Temple Acolyte': {
    description: "You were raised in the Sanctuary of Edrath, where Flow is the divine language. You've seen both its holy miracles and the brutal punishment for blasphemy.",
    skillHint: 'Deep knowledge of religious doctrine and the ability to inspire faith or fear.',
    factionLean: 'Sanctuary of Edrath',
  },
  "Wanderer's Child": {
    description: "Born in the lawless Free Marches, you've seen mages as mercenaries and hunted refugees. To you, Flow is not about politics or faith—it's about survival.",
    skillHint: 'Proficient in survival, tracking, and navigating volatile social landscapes.',
    factionLean: 'The Harmonists',
  },
} as const;

export const AFFINITIES = {
  // Common
  'Emberflow': { name: 'Emberflow (Fire)', description: 'Resonating with thermal energy to create heat and flame.', rarity: 'Common' },
  'Stoneflow': { name: 'Stoneflow (Earth)', description: 'Resonating with telluric currents to manipulate stone and soil.', rarity: 'Common' },
  'Tideflow': { name: 'Tideflow (Water)', description: 'Resonating with hydrostatic pressure to command liquids.', rarity: 'Common' },
  'Zephyrflow': { name: 'Zephyrflow (Air)', description: 'Resonating with atmospheric pressure to shape wind and sound.', rarity: 'Common' },
  // Uncommon
  'Bloomflow': { name: 'Bloomflow (Growth)', description: 'Resonating with the life force of flora and fauna.', rarity: 'Uncommon' },
  'Stormflow': { name: 'Stormflow (Lightning)', description: 'Resonating with electrostatic energy to generate electricity.', rarity: 'Uncommon' },
  'Shadeflow': { name: 'Shadeflow (Shadow)', description: 'Resonating with ambient light to create darkness and illusions.', rarity: 'Uncommon' },
  'Crystalflow': { name: 'Crystalflow (Crystal)', description: 'Resonating with crystalline structures to amplify and focus energy.', rarity: 'Uncommon' },
  // Rare
  'Aetherflow': { name: 'Aetherflow (Void)', description: 'Resonating with the fabric of space itself, a dangerous and unstable power.', rarity: 'Rare' },
  'Chronoflow': { name: 'Chronoflow (Time)', description: 'Resonating with temporal echoes, allowing glimpses of what was and could be.', rarity: 'Rare' },
  'Soulflow': { name: 'Soulflow (Spirit)', description: 'Resonating with the consciousness and life essence of living things.', rarity: 'Rare' },
} as const;


export const PERSONALITY_LEANS = {
  'Empathy': 'You try to understand others and find peaceful solutions. Priests and diplomats may respect this.',
  'Cunning': 'You look for clever angles and exploit weaknesses. Merchants and spies may respect this.',
  'Resolve': 'You stand your ground and meet challenges head-on. Soldiers and guards may respect this.',
  'Lore': 'You observe, recall information, and seek knowledge. Scholars and mages may respect this.',
} as const;

export const VISUAL_MARKS = {
  'Arms': {
    description: 'Lightning-like patterns across your arms.',
    socialConsequence: 'Can be concealed with long sleeves, allowing for discretion in hostile territories.',
  },
  'Chest & Back': {
    description: 'A more hidden mark across your torso.',
    socialConsequence: 'Almost entirely private, revealed only in moments of intimacy, vulnerability, or severe injury.',
  },
  'Face': {
    description: 'A delicate but undeniable pattern across one side of your face.',
    socialConsequence: 'Impossible to hide. You are immediately identified as Awakened, for better or worse, in any social situation.',
  },
} as const;

export const LOADING_MESSAGES = [
    "The threads of fate are weaving...",
    "Whispers echo from the aether...",
    "Flow veins thrum with power...",
    "The world shifts around you...",
    "Veyra's court holds its breath...",
    "A contract is being written in Ardelane...",
    "A Thalrek agent sharpens their blade...",
    "A Kethian storm-barge sets sail...",
];

export const NATIONS = {
  'Veyra': { name: 'Veyra — The Royal Dominion', description: 'Ancient riverine kingdom. Legitimacy is based on ceremony, myth, and a founding bloodline \'touched\' by Flow. Society is a web of patronage, lineage, and honor rituals.'},
  'Ardelane': { name: 'Ardelane — The Guild Compact', description: 'A dense, canal-heavy merchant republic controlled by a dozen Great Houses. Public virtue is tied to accounting and visible transactions.'},
  'Sanctuary of Edrath': { name: 'Sanctuary of Edrath — The Synodal Theocracy', description: 'A compact theocratic polity. The Synod interprets Flow as a divine gift and claims a monopoly over its interpretation and ritual use. Pilgrimage is the economic engine.'},
  'Thalrek Imperium': { name: 'Thalrek Imperium — The Militarist State', description: 'A centralized empire that valorizes strength and survival. It has institutionalized the harnessing of Flow through state-run breeding and augmentation programs.'},
  'Free Marches': { name: 'Free Marches — Confederation of City-States', description: 'Loosely-aligned city-states, caravans, and mercenary towns. They thrive on mobility, trade, and serving as refugee sanctuaries.'},
  'Isles of Keth': { name: 'Isles of Keth — Merchant Republic & Conclave', description: 'A seafaring republic with a secretive Conclave of Sparks controlling Flow-tech. Technologically innovative and the center for reagent harvesting.'},
  'Glass Steppes': { name: 'Glass Steppes — Nomads & Shamanic Confederation', description: 'A network of nomadic clans and shamanic circles who live on the steppe plains. Their social structure is fluid, based on seasonal migration, clan honor, and shamanic rites.'},
} as const;


export const FACTIONS = {
  'The Harmonists': {
    name: 'The Harmonists',
    ideology: 'A clandestine, decentralized movement believing that Flow is an intrinsic part of life and that attempts to control it are a perversion. They advocate for a world where Awakened are not property or weapons.',
    symbol: 'A stylized leaf intertwined with a river current.',
  },
  'The Purists': {
    name: 'The Purist Movement',
    ideology: 'An increasingly powerful and militant ideology asserting that uncontrolled Flow is an existential threat. They believe that magic corrupts individuals and destabilizes society. They advocate for strict control, forced conscription, and, in their most extreme sects, the complete eradication of Awakened individuals ("culling the vein").',
    symbol: 'A broken chain.',
  },
  "Veyra's Royal Conservatory": {
    name: "Veyra's Royal Conservatory",
    ideology: 'Flow is an instrument of the state. Its power must be harnessed and controlled for the good of the Dominion. Independent mages are seen as destabilizing threats.',
    symbol: 'A crown pierced by a single vein of light.',
  },
  "Ardelane's Flow Brokerage": {
    name: "Ardelane's Flow Brokerage",
    ideology: 'Flow is a commodity. Its value can be measured, contracted, and traded through legal instruments like Flow Indentures. All things have a price.',
    symbol: 'A scale balancing a coin and a drop of light.',
  },
  'Sanctuary of Edrath': {
    name: 'Sanctuary of Edrath',
    ideology: 'The Synod interprets Flow as a divine gift and claims a monopoly over its interpretation and ritual use. Pilgrimage is the economic engine.',
    symbol: 'A sunburst with a single drop in the center.',
  },
  'Thalrek Imperium': {
    name: 'Thalrek Imperium',
    ideology: 'A centralized empire that valorizes strength and survival. It has institutionalized the harnessing of Flow through state-run breeding and augmentation programs.',
    symbol: 'A stylized metal wolf\'s head.',
  },
} as const;

export const MAJOR_FACTIONS = [
  'The Harmonists',
  'The Purists',
  "Veyra's Royal Conservatory",
  "Ardelane's Flow Brokerage",
  'Sanctuary of Edrath',
  'Thalrek Imperium',
] as const;