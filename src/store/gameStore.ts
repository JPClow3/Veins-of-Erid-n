import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, StoryTurn, CreationStep, Journal, World, FactionReputation, DramatisPersonae, Choice as ChoiceType, GeminiSceneResponse, Item } from '../types/game';
import type { CharacterProfile, Gender, Background, Affinity, PersonalityLean, VisualMark } from '../types/character';
import type { Toast } from '../types/ui';
import { getNextSceneStreamed, generateImage, getCreationNarrative } from '../features/game/gameService';
import logger from '../utils/logger';
import { LOADING_MESSAGES, AFFINITIES, MAJOR_FACTIONS, STORY_MODEL } from '../constants/gameConstants';
import { base64ToBlobUrl } from '../utils/imageUtils';
import { getRandomDormantAffinity } from '../features/character/characterUtils';
import { narrationManager } from '../utils/narrationManager';
import { audioManager } from '../utils/audioManager';
import { ai } from '../utils/geminiClient';
import { systemInstruction } from '../lore/systemInstruction';


const PROLOGUE_TEXT = [
  { action: 'A World on the Brink', description: "Eridûn. A continent balanced on a knife's edge. Ancient kingdoms and powerful guilds vie for control in a shadow war of secrets and coin. But a new age is dawning—one that will be defined not by crowns or contracts, but by power itself." },
  { action: 'The Living Magic', description: "Magic is a raw, living force known as the Flow. For most, it lies dormant. But in a rare few, it awakens, manifesting as glowing, incandescent veins on the skin—a source of immense power, and a mark of destiny." },
  { action: 'The Awakened', description: "You are one of these 'Awakened'. Your very existence is a spark in a growing conflict. You will be feared, hunted, and coveted for the power that surges within you. To be Awakened is to be a fulcrum upon which the world will turn." },
  { action: 'The Flow Schism', description: "Society is irrevocably divided. Some see the Awakened as a divine blessing, or a tool to be harnessed. Others see only a corrupting influence—a heresy to be controlled, contained, or purged entirely. Your story begins now..." }
];

const initialReputation = (): FactionReputation => {
  const reputation: FactionReputation = {};
  for (const faction of MAJOR_FACTIONS) {
    reputation[faction] = { score: 0, history: [] };
  }
  return reputation;
};

const BASE_PERSONALITY_SCORE = 5;
const INITIAL_LEAN_BONUS = 2;

type GameStage = 'prologue' | 'creation' | 'playing';
type TextSize = 'text-size-sm' | 'text-size-md' | 'text-size-lg';

const getInitialState = () => ({
  gameStage: 'prologue' as GameStage,
  currentScene: null,
  storyHistory: [],
  isLoading: false,
  isImageLoading: false,
  error: null,
  loadingMessage: LOADING_MESSAGES[0],
  journal: {},
  world: {},
  dramatisPersonae: {},
  reputation: initialReputation(),
  inventory: [],
  act: 1,
  playerCharacter: null,
  creationStep: 'INITIAL' as CreationStep | 'INITIAL' | 'COMPLETE' | 'PROLOGUE',
  partialCharacter: {},
  prologueIndex: 0,
  lastAction: null,
  isMuted: true,
  textSize: 'text-size-md' as TextSize,
  animationsEnabled: true,
  isSpeechEnabled: false,
  toasts: [],
  updatedTabs: [],
  worldBibleCacheName: null,
});


interface GameStoreState {
  gameStage: GameStage;
  currentScene: GameState | null;
  storyHistory: StoryTurn[];
  isLoading: boolean;
  isImageLoading: boolean;
  error: string | null;
  loadingMessage: string;
  journal: Journal;
  world: World;
  dramatisPersonae: DramatisPersonae;
  reputation: FactionReputation;
  inventory: Item[];
  act: number;
  playerCharacter: CharacterProfile | null;
  
  creationStep: CreationStep | 'INITIAL' | 'COMPLETE' | 'PROLOGUE';
  partialCharacter: Partial<Omit<CharacterProfile, 'dormantAffinity' | 'personality'>>;
  prologueIndex: number;
  lastAction: string | null;

  // Caching
  worldBibleCacheName: string | null;

  // UI/Accessibility State
  isMuted: boolean;
  textSize: TextSize;
  animationsEnabled: boolean;
  isSpeechEnabled: boolean;
  toasts: Toast[];
  updatedTabs: string[];

  // Actions
  setGameStage: (stage: GameStage) => void;
  startPrologue: () => void;
  startCreation: () => Promise<boolean>;
  handlePlayerAction: (action: string) => Promise<void>;
  retryLastAction: () => void;
  resetGame: () => void;
  toggleMute: () => void;
  setTextSize: (size: TextSize) => void;
  toggleAnimations: () => void;
  toggleSpeech: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: number) => void;
  addUpdatedTab: (tabName: string) => void;
  clearUpdatedTabs: () => void;
  initializeCache: () => Promise<void>;
}

let toastId = 0;

const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // UI Actions
      setGameStage: (stage) => set({ gameStage: stage }),
      toggleMute: () => {
        const isMuted = !get().isMuted;
        audioManager.setMuted(isMuted);
        set({ isMuted });
      },
      setTextSize: (size) => set({ textSize: size }),
      toggleAnimations: () => set(state => ({ animationsEnabled: !state.animationsEnabled })),
      toggleSpeech: () => {
        const isEnabled = !get().isSpeechEnabled;
        set({ isSpeechEnabled: isEnabled });
        if (!isEnabled) {
            narrationManager.stop();
        }
      },
      addToast: (message, type = 'info') => {
        const id = toastId++;
        set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 5000); // Auto-remove after 5s
      },
      removeToast: (id) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
      },
      addUpdatedTab: (tabName: string) => {
        set(state => ({ updatedTabs: [...new Set([...state.updatedTabs, tabName])] }));
      },
      clearUpdatedTabs: () => set({ updatedTabs: [] }),

      // Game Logic Actions
      resetGame: () => {
        logger.info('Resetting game state.');
        narrationManager.stop();
        audioManager.stopAll();
        set(getInitialState());
      },

      startPrologue: () => {
        logger.info('Starting prologue...');
        get().resetGame();
        const firstTurn = PROLOGUE_TEXT[0];
        set({
          gameStage: 'prologue',
          creationStep: 'PROLOGUE',
          storyHistory: [firstTurn],
          currentScene: {
            description: firstTurn.description,
            choices: ["Continue..."],
            imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', act: 1
          },
          prologueIndex: 0,
        });
      },

      startCreation: async (): Promise<boolean> => {
        logger.info('Starting character creation...');
        set({ isLoading: true, error: null, currentScene: null, storyHistory: [] });
        get().resetGame();
        
        set({ creationStep: 'GENDER' });
        try {
          const sceneData = await getCreationNarrative('GENDER', {});
          set({
            gameStage: 'creation',
            currentScene: { ...sceneData, imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', choices: sceneData.choices, act: 1 },
            storyHistory: [{ action: 'An Awakening', description: sceneData.description }],
            isLoading: false,
          });
          if (get().isSpeechEnabled) narrationManager.speak(sceneData.description);
          return true;
        } catch (err) {
          logger.error('Failed to start creation', { error: err });
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          set({ error: `Failed to start. The world's echoes are silent. ${errorMessage}`, isLoading: false });
          return false;
        }
      },
      
      retryLastAction: () => {
        const lastAction = get().lastAction;
        if (lastAction) {
            logger.info('Retrying last action...', { action: lastAction });
            get().handlePlayerAction(lastAction);
        } else {
            logger.warn('No last action to retry.');
        }
      },

      initializeCache: async () => {
          if (get().worldBibleCacheName) {
            // A cache name is already stored. We assume it's valid.
            // A more robust implementation might verify it still exists on the server.
            logger.info(`Using existing cached content name: ${get().worldBibleCacheName}`);
            return;
          }
          logger.info('No cached content name found. Creating a new one...');
          try {
              // The logic to find a cache by displayName has been removed,
              // as the current API version doesn't seem to support setting it on creation.
              // We will create a new cache and persist its server-generated name.
              const newCache = await ai.caches.create({
                  model: STORY_MODEL,
                  config: {
                      systemInstruction: systemInstruction,
                      ttl: '86400s', // 24 hours in seconds
                  },
              });

              logger.info(`New cache created: ${newCache.name}`);
              set({ worldBibleCacheName: newCache.name });
          } catch (err) {
              logger.error('Failed to initialize cache. Proceeding without caching.', { error: err });
              // Gracefully fail: worldBibleCacheName remains null, and the app will fall back to non-cached requests.
          }
      },

      handlePlayerAction: async (action: string) => {
        if (!action.trim() || get().isLoading) return;
        narrationManager.stop();

        logger.info('Handling player action...', { action });
        set({ isLoading: true, error: null, lastAction: action });

        const { creationStep, playerCharacter } = get();

        try {
          if (creationStep === 'PROLOGUE') {
            const { prologueIndex } = get();
            const nextIndex = prologueIndex + 1;
            if (nextIndex < PROLOGUE_TEXT.length) {
              const nextTurn = PROLOGUE_TEXT[nextIndex];
              set(state => ({
                prologueIndex: nextIndex,
                storyHistory: [...state.storyHistory, nextTurn],
                currentScene: {
                  description: nextTurn.description,
                  choices: [(nextIndex === PROLOGUE_TEXT.length - 1) ? "Begin" : "Continue..."],
                  imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', act: 1
                }
              }));
              if (get().isSpeechEnabled) narrationManager.speak(nextTurn.description);
            } else {
              get().setGameStage('creation');
            }
          } else if (creationStep !== 'COMPLETE' && creationStep !== 'INITIAL') {
            await handleCreationAction(action, set, get);
          } else if (playerCharacter) {
            await handleGameplayAction(action, playerCharacter, set, get);
          } else {
            throw new Error("Cannot handle action: Invalid game state.");
          }
        } catch (err) {
          logger.error('Error in handlePlayerAction', { error: err });
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          set(state => ({
            error: `An unexpected magical interference occurred. ${errorMessage}`,
            storyHistory: state.storyHistory.slice(0, -1) // Roll back optimistic update
          }));
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'gemini-adventure-save',
    }
  )
);


// --- Helper action logic outside the store definition for clarity ---

async function handleCreationAction(action: string, set: Function, get: Function) {
    const { storyHistory, creationStep, partialCharacter } = get();
    
    const actionText = creationStep === 'NAME' ? `My name is ${action}.` : `I remember being ${action}.`;
    const newTurn: StoryTurn = { action: actionText, description: '...' };
    set({ 
        storyHistory: [...storyHistory, newTurn], 
        currentScene: { ...get().currentScene, choices: [] }
    });

    const updatedChar = { ...partialCharacter };
    let nextStep: CreationStep | 'COMPLETE' = 'COMPLETE';

    switch (creationStep) {
        case 'GENDER': updatedChar.gender = action as Gender; nextStep = 'BACKGROUND'; break;
        case 'BACKGROUND': updatedChar.background = action as Background; nextStep = 'NAME'; break;
        case 'NAME': updatedChar.name = action; nextStep = 'AFFINITY'; break;
        case 'AFFINITY': updatedChar.awakenedAffinity = action as Affinity; nextStep = 'PERSONALITY'; break;
        case 'PERSONALITY': updatedChar.initialPersonalityLean = action as PersonalityLean; nextStep = 'MARK'; break;
        case 'MARK': updatedChar.visualMark = action as VisualMark; nextStep = 'COMPLETE'; break;
    }
    set({ partialCharacter: updatedChar });

    if (nextStep === 'COMPLETE') {
        const finalCharacterData = updatedChar as Omit<CharacterProfile, 'dormantAffinity' | 'personality'> & { initialPersonalityLean: PersonalityLean };
        
        // Character finalization logic
        const dormantAffinity = getRandomDormantAffinity(finalCharacterData.awakenedAffinity);
        const personality: Record<PersonalityLean, number> = { Empathy: 5, Cunning: 5, Resolve: 5, Lore: 5 };
        personality[finalCharacterData.initialPersonalityLean] += INITIAL_LEAN_BONUS;
        const fullCharacter: CharacterProfile = { ...finalCharacterData, dormantAffinity, personality };

        set({ playerCharacter: fullCharacter, creationStep: 'COMPLETE' });
        
        const finalDesc = "The last piece of my memory returns. I am whole again.";
        const finalCreationTurn = { ...newTurn, description: finalDesc };
        set(state => ({ storyHistory: [...state.storyHistory.slice(0, -1), finalCreationTurn] }));
        if (get().isSpeechEnabled) narrationManager.speak(finalDesc);
        
        const firstAction = `I awaken fully in a rain-slicked Ardelanese alley, the glowing veins on my ${fullCharacter.visualMark} a beacon in the gloom. I am witnessing a tense, clandestine meeting between a woman with a Harmonist tattoo and a nervous merchant. I need to act before I'm noticed. Describe the scene and my critical first choices. This begins Act 1. Introduce one of these NPCs with an npcUpdate.`;
        
        // This is a special case of handleGameplayAction to start the game
        await handleGameplayAction(firstAction, fullCharacter, set, get);
    } else {
        set({ creationStep: nextStep });
        const sceneData = await getCreationNarrative(nextStep, updatedChar);
        set(state => {
            const newHistory = [...state.storyHistory];
            newHistory[newHistory.length - 1].description = sceneData.description;
            return {
                currentScene: { ...sceneData, imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', choices: sceneData.choices, act: 1 },
                storyHistory: newHistory,
            }
        });
        if (get().isSpeechEnabled) narrationManager.speak(sceneData.description);
    }
}

async function handleGameplayAction(action: string, character: CharacterProfile, set: Function, get: Function) {
    const { currentScene, storyHistory, journal, act, reputation, dramatisPersonae, addToast, addUpdatedTab, worldBibleCacheName } = get();

    // Update personality based on choice lean
    const updatedCharacter = { ...character };
    if (currentScene?.choices) {
      const choice = currentScene.choices.find((c: any) => typeof c !== 'string' && c.text === action) as ChoiceType | undefined;
      if (choice?.lean && choice.lean !== 'Neutral') {
        updatedCharacter.personality[choice.lean]++;
      }
    }
    set({ playerCharacter: updatedCharacter });

    const optimisticTurn = { action, description: '' };
    set({ 
        storyHistory: [...storyHistory, optimisticTurn],
        currentScene: { ...currentScene, choices: [] }
    });

    const historyForPrompt = storyHistory.map((turn: StoryTurn) => `> ${turn.action}\n${turn.description}`).join('\n\n');

    const stream = getNextSceneStreamed(updatedCharacter, historyForPrompt, action, journal, act, reputation, dramatisPersonae, worldBibleCacheName);
    let finalDescription = '';

    let result: IteratorResult<string, Omit<GeminiSceneResponse, "description">>;
    while (true) {
        result = await stream.next();
        if (result.done) break;

        finalDescription = result.value;
        set((state: GameStoreState) => {
            const newHistory = [...state.storyHistory];
            if (newHistory.length > 0) {
              newHistory[newHistory.length - 1] = { ...newHistory[newHistory.length - 1], description: finalDescription };
            }
            return { storyHistory: newHistory };
        });
        if (get().isSpeechEnabled) {
            narrationManager.speak(finalDescription);
        }
    }
    
    const sceneData = result.value;
    
    if (!sceneData) {
      throw new Error("Scene data was not received from the generative model stream.");
    }
    
    // Play audio
    if (sceneData.soundEffect) {
      audioManager.playSoundEffect(sceneData.soundEffect);
    }
    if (sceneData.ambientTrack) {
      audioManager.setAmbientTrack(sceneData.ambientTrack);
    }

    const finalSceneData = { ...sceneData, description: finalDescription };

    set({ currentScene: { ...finalSceneData, imageUrl: currentScene?.imageUrl ?? '', act } });
    
    // Process all dynamic updates from sceneData
    if (sceneData.actTransition) {
        set(state => ({ act: sceneData.actTransition.newAct, currentScene: { ...state.currentScene, act: sceneData.actTransition.newAct } }));
    }
    if (sceneData.journalUpdate) {
        const { thread, entry, status } = sceneData.journalUpdate;
        set(state => {
            const newJournal = { ...state.journal };
            const currentThread = newJournal[thread] || { entries: [], status: 'new' };
            currentThread.entries.push(entry);
            currentThread.status = status;
            newJournal[thread] = currentThread;
            return { journal: newJournal };
        });
        addUpdatedTab('Journal');
    }
    if (sceneData.locationUpdate) {
        set(state => ({ world: {...state.world, [sceneData.locationUpdate.name]: { description: sceneData.locationUpdate.description }} }));
        addUpdatedTab('World');
    }
    if (sceneData.reputationUpdate) {
        const { faction, change, reason } = sceneData.reputationUpdate;
        set(state => {
            const newRep = { ...state.reputation };
            if (newRep[faction]) {
                newRep[faction].score += change;
                newRep[faction].history.push(reason);
            }
            return { reputation: newRep };
        });
        const sign = change > 0 ? '+' : '';
        addToast(`${sign}${change} ${faction} Reputation`);
        addUpdatedTab('Factions');
    }
    if (sceneData.npcUpdate) {
        const { name, description, faction = 'Unknown' } = sceneData.npcUpdate;
        set(state => ({ dramatisPersonae: {...state.dramatisPersonae, [name]: { description, faction }} }));
        addUpdatedTab('People');
    }
    if (sceneData.itemUpdate) {
      const { action, itemName, description, category } = sceneData.itemUpdate;
      if (action === 'add') {
        const newItem: Item = { name: itemName, description, category };
        set(state => ({ inventory: [...state.inventory, newItem] }));
        addToast(`Item Acquired: ${itemName}`);
        addUpdatedTab('Inventory');
      } else if (action === 'remove') {
        set(state => ({ inventory: state.inventory.filter(item => item.name !== itemName) }));
        addToast(`Item Used: ${itemName}`);
      }
    }


    if (!sceneData.gameOver) {
      set({ isImageLoading: true });
      try {
        const imageBase64 = await generateImage(sceneData.imagePrompt);
        const imageUrl = base64ToBlobUrl(imageBase64, 'image/webp');
        set(state => ({ currentScene: state.currentScene ? { ...state.currentScene, imageUrl } : null }));
      } catch (imgErr) {
        logger.error("Image generation failed", { error: imgErr });
        set(state => ({ currentScene: state.currentScene ? { ...state.currentScene, imageUrl: null } : null }));
      } finally {
        set({ isImageLoading: false });
      }
    }
}


// Periodically update loading message
setInterval(() => {
    if (useGameStore.getState().isLoading) {
        useGameStore.setState({ loadingMessage: LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)] });
    }
}, 3000);


export default useGameStore;