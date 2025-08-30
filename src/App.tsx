import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/common/Header';
import ImageDisplay from './components/game/ImageDisplay';
import StoryPanel from './components/game/StoryPanel';
import ActionInput from './components/game/ActionInput';
import GameOverModal from './components/game/GameOverModal';
import LoadingIndicator from './components/common/LoadingIndicator';
import CharacterSheet from './components/game/CharacterSheet';
import JournalPanel from './components/game/JournalPanel';
import WorldPanel from './components/game/WorldPanel';
import IntroSequence from './components/character/IntroSequence';
import CharacterCreator from './components/character/CharacterCreator';
import PeoplePanel from './components/game/PeoplePanel';
import FactionsPanel from './components/game/FactionsPanel';
import InventoryPanel from './components/game/InventoryPanel';
import useGameStore from './store/gameStore';
import SettingsPanel from './components/common/SettingsPanel';
import ToastNotifications from './components/common/ToastNotifications';
import CodexSidebar from './components/common/CodexSidebar';
import { blobManager } from './utils/blobManager';
import LorePanel from './components/game/LorePanel';
import AethericStateDisplay from './components/game/AethericStateDisplay';
import FeatsPanel from './components/game/FeatsPanel';
import SanctumPanel from './components/game/SanctumPanel';
import PlayerNotesPanel from './components/game/PlayerNotesPanel';

const useHasHydrated = () => {
  const [hydrated, setHydrated] = useState(useGameStore.persist.hasHydrated());

  useEffect(() => {
    const unsubFinishHydration = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};


const App: React.FC = () => {
  const hasHydrated = useHasHydrated();
  const {
    gameStage,
    currentScene, 
    storyHistory, 
    gameStatus,
    isSpeechLoading,
    error,
    loadingMessage,
    journal,
    world,
    worldTimeline,
    dramatisPersonae,
    reputation,
    inventory,
    playerCharacter,
    aethericState,
    feats,
    sanctum,
    playerNotes,
    handlePlayerAction,
    startPrologue,
    startCreation,
    setGameStage,
    retryLastAction,
    animationsEnabled,
    theme,
    magicIsHappening,
    handleNewGame,
    updatePlayerNotes,
  } = useGameStore(state => ({
    gameStage: state.gameStage,
    currentScene: state.currentScene,
    storyHistory: state.storyHistory,
    gameStatus: state.gameStatus,
    isSpeechLoading: state.isSpeechLoading,
    error: state.error,
    loadingMessage: state.loadingMessage,
    journal: state.journal,
    world: state.world,
    worldTimeline: state.worldTimeline,
    dramatisPersonae: state.dramatisPersonae,
    reputation: state.reputation,
    inventory: state.inventory,
    playerCharacter: state.playerCharacter,
    aethericState: state.aethericState,
    feats: state.feats,
    sanctum: state.sanctum,
    playerNotes: state.playerNotes,
    handlePlayerAction: state.handlePlayerAction,
    startPrologue: state.startPrologue,
    startCreation: state.startCreation,
    setGameStage: state.setGameStage,
    retryLastAction: state.retryLastAction,
    animationsEnabled: state.animationsEnabled,
    theme: state.theme,
    magicIsHappening: state.magicIsHappening,
    handleNewGame: state.handleNewGame,
    updatePlayerNotes: state.updatePlayerNotes,
  }));

  const isLoading = gameStatus !== 'idle' && gameStatus !== 'error';
  const isImageLoading = gameStatus === 'generatingImage';


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  
  useEffect(() => {
    if (!hasHydrated) {
      return; // Wait for the store to be ready
    }
    
    // If a character exists in the loaded state, jump to the 'playing' stage.
    if (playerCharacter && gameStage !== 'playing') {
      setGameStage('playing');
    } 
    // Otherwise, if we're in the default 'prologue' stage, start it.
    else if (!playerCharacter && gameStage === 'prologue') {
      startPrologue();
    }
  }, [hasHydrated, gameStage, playerCharacter, startPrologue, setGameStage]);

  useEffect(() => {
    const handleUnload = () => blobManager.cleanupAll();
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const handleBegin = useCallback(() => {
    startCreation().then(success => {
      if (success) {
        setGameStage('playing');
      }
    });
  }, [startCreation, setGameStage]);
  
  const loadingFallback = (
    <div className="min-h-screen text-text-primary flex flex-col items-center justify-center p-4">
      <Header />
      <div className="mt-8 flex items-center gap-4">
        <LoadingIndicator className="h-8 w-8" />
        <p className="text-xl text-accent-primary font-heading">Awakening the threads of fate...</p>
      </div>
    </div>
  );
  
  if (!hasHydrated) {
      return loadingFallback;
  }

  if (gameStage === 'prologue') {
    return (
      <IntroSequence
        storyHistory={storyHistory}
        isLoading={isLoading}
        currentScene={currentScene}
        onAction={handlePlayerAction}
      />
    );
  }
  
  if (gameStage === 'creation' && !playerCharacter) {
    return (
      <CharacterCreator onBegin={handleBegin} isLoading={isLoading} error={error} />
    );
  }

  const isGameOver = currentScene?.gameOver ?? false;

  if (!currentScene && gameStage === 'playing') {
    return loadingFallback;
  }
  
  if (!currentScene) return null; // Should not happen in playing state after loading

  const appClasses = `min-h-screen text-text-primary flex flex-col p-4 sm:p-6 md:p-8 selection:bg-accent-primary/30 selection:text-white ${animationsEnabled ? '' : 'animations-disabled'}`;

  return (
    <div className={appClasses}>
      <Header />
      <SettingsPanel />
      <ToastNotifications />

      <main className="w-full max-w-screen-2xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 mt-6 lg:max-h-[85vh]">
        {/* === Left Column: Image Display === */}
        <ImageDisplay 
          imageUrl={currentScene?.imageUrl} 
          isLoading={isImageLoading}
          magicIsHappening={magicIsHappening}
          veinStrain={playerCharacter?.veinStrain ?? 0}
          echoLevel={playerCharacter?.echoLevel ?? 0}
          className="lg:col-span-4 xl:col-span-3 h-full"
        />

        {/* === Center Column: Story & Actions === */}
        <div className="bg-surface rounded-xl p-4 sm:p-6 flex flex-col ring-1 ring-border max-h-[85vh] lg:max-h-full lg:col-span-4 xl:col-span-5 animate-subtle-glow">
          {error && (
            <div role="alert" className="border border-error/50 bg-error-bg text-error p-3 rounded-lg mb-4 flex flex-col sm:flex-row items-center gap-3 font-ui">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={retryLastAction} className="sm:ml-auto shrink-0 px-3 py-1 text-sm bg-error/20 hover:bg-error/40 rounded-md transition-colors text-error hover:text-white font-semibold">Retry</button>
            </div>
          )}
          
          <AethericStateDisplay state={aethericState} />

          <StoryPanel storyHistory={storyHistory} isLoading={isLoading} />
          
          <div className="flex-shrink-0 mt-auto pt-4">
            {isLoading ? (
              <div className="h-full min-h-[92px] flex items-center justify-center animate-fade-in gap-3 text-text-secondary font-ui italic">
                <LoadingIndicator />
                <span>{loadingMessage}</span>
              </div>
            ) : (
              <ActionInput 
                choices={currentScene.choices} 
                onSubmit={handlePlayerAction} 
                disabled={isLoading}
                isCreatingCharacter={false}
                playerCharacter={playerCharacter}
                allowCustomAction={currentScene.allowCustomAction}
                allowExamineAction={currentScene.allowExamineAction}
              />
            )}
          </div>
        </div>

        {/* === Right Column: Codex === */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-4 max-h-[85vh]">
          <CodexSidebar>
            <CodexSidebar.Section title="Character">
              {playerCharacter && <CharacterSheet character={playerCharacter} />}
            </CodexSidebar.Section>
             <CodexSidebar.Section title="Sanctum">
              <SanctumPanel sanctum={sanctum} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Journal">
               <JournalPanel journal={journal} />
            </CodexSidebar.Section>
             <CodexSidebar.Section title="World">
               <WorldPanel world={world} worldTimeline={worldTimeline} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="People">
               <PeoplePanel dramatisPersonae={dramatisPersonae} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Factions">
               <FactionsPanel reputation={reputation} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Feats">
              <FeatsPanel feats={feats} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Inventory">
              <InventoryPanel inventory={inventory} />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Lore">
              <LorePanel />
            </CodexSidebar.Section>
            <CodexSidebar.Section title="Player Notes">
              <PlayerNotesPanel notes={playerNotes} setNotes={updatePlayerNotes} />
            </CodexSidebar.Section>
          </CodexSidebar>
        </div>
      </main>

      {isGameOver && (
        <GameOverModal
          endingDescription={currentScene.endingDescription}
          onPlayAgain={handleNewGame}
        />
      )}
    </div>
  );
};

export default App;
