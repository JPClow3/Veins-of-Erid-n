import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, StoryTurn, CreationStep, Journal, World, FactionReputation, DramatisPersonae, Choice as ChoiceType, GeminiSceneResponse, Item, CharacterStatsUpdate } from '../types/game';
import type { CharacterProfile, Gender, Background, Affinity, PersonalityLean, VisualMark } from '../types/character';
import type { Toast } from '../types/ui';
import { getNextSceneStreamed, generateImage, getCreationNarrative, getMemorySnippet } from '../features/game/gameService';
import logger from '../utils/logger';
import { LOADING_MESSAGES, MAJOR_FACTIONS, BACKGROUNDS } from '../constants/gameConstants';
import { base64ToBlobUrl } from '../utils/imageUtils';
import { getRandomDormantAffinity } from '../features/character/characterUtils';
import { narrationManager } from '../utils/narrationManager';
import { audioManager } from '../utils/audioManager';
import { PROLOGUE_TEXT } from '../lore/prologue';

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
type GameStatus = 'idle' | 'processing' | 'streamingNarrative' | 'processingUpdates' | 'generatingImage' | 'error';

interface Knowledge {
    affinities: Affinity[];
    nations: string[];
    factions: string[];
}

const getInitialState = () => ({
  gameStage: 'prologue' as GameStage,
  gameStatus: 'idle' as GameStatus,
  currentScene: null,
  storyHistory: [],
  isSpeechLoading: false,
  error: null,
  loadingMessage: LOADING_MESSAGES[0],
  journal: {},
  world: {},
  dramatisPersonae: {},
  reputation: initialReputation(),
  inventory: [],
  knowledge: {
    affinities: [],
    nations: [],
    factions: [],
  } as Knowledge,
  act: 1,
  playerCharacter: null,
  creationStep: 'INITIAL' as CreationStep | 'INITIAL' | 'COMPLETE' | 'PROLOGUE',
  partialCharacter: {},
  prologueIndex: 0,
  lastAction: null,
  isMuted: true,
  theme: 'dark' as 'dark' | 'light',
  language: 'en' as 'en' | 'pt',
  animationsEnabled: true,
  isSpeechEnabled: false,
  toasts: [],
  updatedTabs: [],
  highlightedTab: null,
  magicIsHappening: false,
  loadingMessageIntervalId: null,
  magicEffectTimeoutId: null,
  actionsSinceLastSaveToast: 0,
});


interface GameStoreState {
  gameStage: GameStage;
  gameStatus: GameStatus;
  currentScene: GameState | null;
  storyHistory: StoryTurn[];
  isSpeechLoading: boolean;
  error: string | null;
  loadingMessage: string;
  journal: Journal;
  world: World;
  dramatisPersonae: DramatisPersonae;
  reputation: FactionReputation;
  inventory: Item[];
  knowledge: Knowledge;
  act: number;
  playerCharacter: CharacterProfile | null;
  
  creationStep: CreationStep | 'INITIAL' | 'COMPLETE' | 'PROLOGUE';
  partialCharacter: Partial<Omit<CharacterProfile, 'dormantAffinity' | 'personality' | 'veinStrain' | 'echoLevel'>>;
  prologueIndex: number;
  lastAction: string | null;

  // UI/Accessibility State
  isMuted: boolean;
  theme: 'dark' | 'light';
  language: 'en' | 'pt';
  animationsEnabled: boolean;
  isSpeechEnabled: boolean;
  toasts: Toast[];
  updatedTabs: string[];
  highlightedTab: string | null;
  magicIsHappening: boolean;
  loadingMessageIntervalId: number | null;
  magicEffectTimeoutId: number | null;
  actionsSinceLastSaveToast: number;

  // Actions
  setGameStage: (stage: GameStage) => void;
  startPrologue: () => void;
  startCreation: () => Promise<boolean>;
  handlePlayerAction: (action: string) => Promise<void>;
  retryLastAction: () => void;
  resetGame: () => void;
  toggleMute: () => void;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'pt') => void;
  toggleAnimations: () => void;
  toggleSpeech: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: number) => void;
  addUpdatedTab: (tabName: string) => void;
  clearUpdatedTabs: () => void;
  setHighlightedTab: (tabName: string | null) => void;
  addCustomJournalEntry: (thread: string, entry: string) => void;
  unlockLore: (update: { type: 'faction' | 'nation' | 'affinity', key: string }) => void;
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
      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      toggleAnimations: () => set(state => ({ animationsEnabled: !state.animationsEnabled })),
      toggleSpeech: () => {
        const isEnabled = !get().isSpeechEnabled;
        if (!isEnabled) {
            narrationManager.stop();
            set({ isSpeechEnabled: false, isSpeechLoading: false });
        } else {
            set({ isSpeechEnabled: true });
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
        get().setHighlightedTab(tabName);
      },
      clearUpdatedTabs: () => set({ updatedTabs: [] }),
      setHighlightedTab: (tabName) => set({ highlightedTab: tabName }),
      addCustomJournalEntry: (thread, entry) => {
        set(state => {
          const newJournal = { ...state.journal };
          if (newJournal[thread]) {
            newJournal[thread].entries.push(`[My Note] ${entry}`);
            return { journal: newJournal };
          }
          return {}; // No change if thread doesn't exist
        });
        get().addToast(`Added note to '${thread}' journal thread.`, 'success');
      },

      // Game Logic Actions
      resetGame: () => {
        logger.info('Resetting game state.');
        narrationManager.stop();
        audioManager.stopAll();
        if (get().loadingMessageIntervalId) clearInterval(get().loadingMessageIntervalId!);
        if (get().magicEffectTimeoutId) clearTimeout(get().magicEffectTimeoutId!);
        set(getInitialState());
      },

      startPrologue: () => {
        logger.info('Starting prologue...');
        get().resetGame();
        const firstTurn = PROLOGUE_TEXT[0];
        set({
          gameStage: 'prologue',
          gameStatus: 'idle',
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
        get().resetGame();
        set({ gameStatus: 'processing', error: null, currentScene: null, storyHistory: [] });
        
        set({ creationStep: 'GENDER' });
        try {
          const sceneData = await getCreationNarrative('GENDER', {});
          set({
            gameStage: 'creation',
            currentScene: { ...sceneData, imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', choices: sceneData.choices, act: 1 },
            storyHistory: [{ action: 'An Awakening', description: sceneData.description }],
            gameStatus: 'idle',
          });
          if (get().isSpeechEnabled) {
              set({ isSpeechLoading: true });
              await narrationManager.speak(sceneData.description);
              set({ isSpeechLoading: false });
          }
          return true;
        } catch (err) {
          logger.error('Failed to start creation', { error: err });
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          set({ error: `Failed to start. The world's echoes are silent. ${errorMessage}`, gameStatus: 'error' });
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
      
      unlockLore: (update) => {
        set(state => {
            const { type, key } = update;
            const newKnowledge = { 
                affinities: [...state.knowledge.affinities],
                nations: [...state.knowledge.nations],
                factions: [...state.knowledge.factions],
            };
            const keyMap = {
                affinity: 'affinities',
                nation: 'nations',
                faction: 'factions'
            };
            const category = keyMap[type as keyof typeof keyMap];
            if (category && !newKnowledge[category as keyof Knowledge].includes(key as any)) {
                (newKnowledge[category as keyof Knowledge] as string[]).push(key);
                get().addToast(`New Lore Unlocked: ${key}`, 'success');
                get().addUpdatedTab('Lore');
                return { knowledge: newKnowledge };
            }
            return {}; // No change
        });
      },

      handlePlayerAction: async (action: string) => {
        if (!action.trim() || (get().gameStatus !== 'idle' && get().gameStatus !== 'error')) return;
        narrationManager.stop();

        logger.info('Handling player action...', { action });
        set({ error: null, lastAction: action });

        const { creationStep, playerCharacter } = get();
        
        try {
          if (creationStep === 'PROLOGUE') {
            set({ gameStatus: 'processing' });
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
              if (get().isSpeechEnabled) {
                  set({ isSpeechLoading: true });
                  await narrationManager.speak(nextTurn.description);
                  set({ isSpeechLoading: false });
              }
            } else {
              get().setGameStage('creation');
            }
             set({ gameStatus: 'idle' });
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
            storyHistory: state.storyHistory.slice(0, -1), // Roll back optimistic update
            gameStatus: 'error'
          }));
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
    set({ gameStatus: 'processing' });
    
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
        const finalCharacterData = updatedChar as Omit<CharacterProfile, 'dormantAffinity' | 'personality' | 'veinStrain' | 'echoLevel'> & { initialPersonalityLean: PersonalityLean };
        
        const dormantAffinity = getRandomDormantAffinity(finalCharacterData.awakenedAffinity);
        const personality: Record<PersonalityLean, number> = { Empathy: 5, Cunning: 5, Resolve: 5, Lore: 5 };
        personality[finalCharacterData.initialPersonalityLean] += INITIAL_LEAN_BONUS;
        const fullCharacter: CharacterProfile = { 
            ...finalCharacterData, 
            dormantAffinity, 
            personality, 
            veinStrain: 0, 
            echoLevel: 0 };

        const background = BACKGROUNDS[finalCharacterData.background];
        const homeNationMap = {
            "Veyra's Royal Conservatory": 'Veyra',
            "Ardelane's Flow Brokerage": 'Ardelane',
            'Sanctuary of Edrath': 'Sanctuary of Edrath',
            'The Harmonists': 'Free Marches', // Wanderer's Child lean
        };
        // @ts-ignore
        const homeNation = homeNationMap[background.factionLean] || 'Free Marches';
        
        set({ 
            playerCharacter: fullCharacter, 
            creationStep: 'COMPLETE',
            knowledge: {
                affinities: [fullCharacter.awakenedAffinity],
                nations: [homeNation],
                factions: [background.factionLean],
            }
        });
        
        const finalDesc = "The last piece of my memory returns. I am whole again.";
        const finalCreationTurn = { ...newTurn, description: finalDesc };
        
        const memorySnippet = await getMemorySnippet(fullCharacter);
        const memoryTurn: StoryTurn = { action: 'A memory surfaces...', description: memorySnippet };

        set((state: GameStoreState) => ({ storyHistory: [...state.storyHistory.slice(0, -1), finalCreationTurn, memoryTurn] }));

        if (get().isSpeechEnabled) {
            set({ isSpeechLoading: true });
            await narrationManager.speak(finalDesc);
            await narrationManager.speak(memorySnippet);
            set({ isSpeechLoading: false });
        }
        
        const firstAction = `I awaken fully in a rain-slicked Ardelanese alley, the glowing veins on my ${fullCharacter.visualMark} a beacon in the gloom. I am witnessing a tense, clandestine meeting between a woman with a Harmonist tattoo and a nervous merchant. I need to act before I'm noticed. Describe the scene and my critical first choices. This begins Act 1. Introduce one of these NPCs with an npcUpdate.`;
        
        await handleGameplayAction(firstAction, fullCharacter, set, get);
    } else {
        set({ creationStep: nextStep });
        const sceneData = await getCreationNarrative(nextStep, updatedChar);
        set((state: GameStoreState) => {
            const newHistory = [...state.storyHistory];
            newHistory[newHistory.length - 1].description = sceneData.description;
            return {
                currentScene: { ...sceneData, imageUrl: null, gameOver: false, endingDescription: '', imagePrompt: '', choices: sceneData.choices, act: 1 },
                storyHistory: newHistory,
                gameStatus: 'idle',
            }
        });
        if (get().isSpeechEnabled) {
            set({ isSpeechLoading: true });
            await narrationManager.speak(sceneData.description);
            set({ isSpeechLoading: false });
        }
    }
}

async function handleGameplayAction(action: string, character: CharacterProfile, set: Function, get: Function) {
    // --- 1. Setup and Optimistic Update ---
    const { storyHistory, journal, act, reputation, dramatisPersonae, addToast, addUpdatedTab } = get();

    const intervalId = window.setInterval(() => {
        set({ loadingMessage: LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)] });
    }, 3000);

    set({ 
        gameStatus: 'streamingNarrative', 
        loadingMessageIntervalId: intervalId,
        storyHistory: [...storyHistory, { action, description: '' }],
        currentScene: { ...get().currentScene, choices: [] }
    });

    try {
        // --- 2. Stream Narrative ---
        const historyForPrompt = storyHistory.map((turn: StoryTurn) => `> ${turn.action}\n${turn.description}`).join('\n\n');
        const stream = getNextSceneStreamed(character, historyForPrompt, action, journal, act, reputation, dramatisPersonae);
        let finalDescription = '';
        let sceneData: Omit<GeminiSceneResponse, 'description'>;

        while (true) {
            const result = await stream.next();
            if (result.done) {
                sceneData = result.value;
                break;
            }
            finalDescription = result.value as string;
            set((state: GameStoreState) => {
                const newHistory = [...state.storyHistory];
                if (newHistory.length > 0) {
                  newHistory[newHistory.length - 1] = { ...newHistory[newHistory.length - 1], description: finalDescription };
                }
                return { storyHistory: newHistory };
            });
        }
        
        clearInterval(get().loadingMessageIntervalId);
        set({ gameStatus: 'processingUpdates', loadingMessageIntervalId: null });

        if (get().isSpeechEnabled) {
            set({ isSpeechLoading: true });
            await narrationManager.speak(finalDescription);
            set({ isSpeechLoading: false });
        }
        
        if (!sceneData) throw new Error("Scene data was not received from the model stream.");

        // --- 3. Process Updates and Apply State Transactionally ---
        const stateUpdates: Partial<GameStoreState> = {};
        
        // Handle personality update
        const choiceMade = get().currentScene?.choices.find((c: any) => typeof c !== 'string' && c.text === action) as ChoiceType | undefined;
        if (choiceMade?.lean && choiceMade.lean !== 'Neutral') {
            const updatedCharacter = { ...character };
            updatedCharacter.personality[choiceMade.lean]++;
            stateUpdates.playerCharacter = updatedCharacter;
        }

        if (sceneData.characterStatsUpdate) {
            const { veinStrainChange = 0, echoLevelChange = 0, reason } = sceneData.characterStatsUpdate;
            const currentChar = (stateUpdates.playerCharacter || get().playerCharacter)!;
            const updatedCharacter = {
                ...currentChar,
                veinStrain: Math.max(0, currentChar.veinStrain + veinStrainChange),
                echoLevel: Math.max(0, currentChar.echoLevel + echoLevelChange),
            };
            stateUpdates.playerCharacter = updatedCharacter;
            addToast(reason, 'info');
        }

        // Handle function call updates
        if (sceneData.loreUnlock) get().unlockLore(sceneData.loreUnlock);
        if (sceneData.actTransition) stateUpdates.act = sceneData.actTransition.newAct;
        if (sceneData.journalUpdate) {
            const { thread, entry, status } = sceneData.journalUpdate;
            const newJournal = { ...get().journal };
            const currentThread = newJournal[thread] || { entries: [], status: 'new' };
            currentThread.entries.push(entry);
            currentThread.status = status;
            newJournal[thread] = currentThread;
            stateUpdates.journal = newJournal;
            addUpdatedTab('Journal');
        }
        if (sceneData.locationUpdate) {
            const { name, description, x, y } = sceneData.locationUpdate;
            stateUpdates.world = {...get().world, [name]: { description, x, y }};
            addUpdatedTab('World');
        }
        if (sceneData.reputationUpdate) {
            const { faction, change, reason } = sceneData.reputationUpdate;
            const newRep = { ...get().reputation };
            if (newRep[faction]) {
                newRep[faction].score += change;
                newRep[faction].history.push(reason);
            }
            stateUpdates.reputation = newRep;
            addToast(`${change > 0 ? '+' : ''}${change} ${faction} Reputation`);
            addUpdatedTab('Factions');
        }
        if (sceneData.npcUpdate) {
            const { name, description, faction = 'Unknown', role, disposition, motivation } = sceneData.npcUpdate;
            stateUpdates.dramatisPersonae = {...get().dramatisPersonae, [name]: { description, faction, role, disposition, motivation }};
            addUpdatedTab('People');
        }
        if (sceneData.itemUpdate) {
            const { action: itemAction, itemName, description, category } = sceneData.itemUpdate;
            if (itemAction === 'add') {
                const newItem: Item = { name: itemName, description, category };
                stateUpdates.inventory = [...get().inventory, newItem];
                addToast(`Item Acquired: ${itemName}`);
                addUpdatedTab('Inventory');
            } else if (itemAction === 'remove') {
                stateUpdates.inventory = get().inventory.filter(item => item.name !== itemName);
                addToast(`Item Used: ${itemName}`);
            }
        }
        
        // Handle auto-save toast notification
        const currentCount = get().actionsSinceLastSaveToast ?? 0;
        const newCount = currentCount + 1;
        if (newCount >= 5) { // Trigger every 5 actions
            get().addToast('Progress automatically saved.', 'success');
            stateUpdates.actionsSinceLastSaveToast = 0;
        } else {
            stateUpdates.actionsSinceLastSaveToast = newCount;
        }

        // --- 4. Atomic State Update ---
        set({ 
            ...stateUpdates,
            currentScene: { 
                ...get().currentScene, 
                ...sceneData, 
                description: finalDescription, 
                imageUrl: get().currentScene?.imageUrl ?? '', 
                act: stateUpdates.act ?? get().act 
            }
        });

        // --- 5. Handle Effects ---
        if (sceneData.soundEffect) audioManager.playSoundEffect(sceneData.soundEffect);
        if (sceneData.ambientTrack) audioManager.setAmbientTrack(sceneData.ambientTrack);
        if (sceneData.magicEffect) {
            if (get().magicEffectTimeoutId) clearTimeout(get().magicEffectTimeoutId);
            const timeoutId = window.setTimeout(() => set({ magicIsHappening: false, magicEffectTimeoutId: null }), 2500);
            set({ magicIsHappening: true, magicEffectTimeoutId: timeoutId });
        }

        // --- 6. Generate Image ---
        if (!sceneData.gameOver) {
            set({ gameStatus: 'generatingImage' });
            const imageBase64 = await generateImage(sceneData.imagePrompt);
            const imageUrl = base64ToBlobUrl(imageBase64, 'image/jpeg');
            set((state: GameStoreState) => ({ 
                currentScene: state.currentScene ? { ...state.currentScene, imageUrl } : null 
            }));
        }

        // --- 7. Finalize ---
        set({ gameStatus: 'idle' });

    } catch (err) {
        if (get().loadingMessageIntervalId) clearInterval(get().loadingMessageIntervalId);
        throw err; // Re-throw to be caught by the outer handler
    }
}

export default useGameStore;