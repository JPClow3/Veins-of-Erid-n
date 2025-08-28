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


const App: React.FC = () => {
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
    dramatisPersonae,
    reputation,
    inventory,
    playerCharacter,
    handlePlayerAction,
    startPrologue,
    startCreation,
    setGameStage,
    retryLastAction,
    animationsEnabled,
    theme,
    magicIsHappening,
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
    dramatisPersonae: state.dramatisPersonae,
    reputation: state.reputation,
    inventory: state.inventory,
    playerCharacter: state.playerCharacter,
    handlePlayerAction: state.handlePlayerAction,
    startPrologue: state.startPrologue,
    startCreation: state.startCreation,
    setGameStage: state.setGameStage,
    retryLastAction: state.retryLastAction,
    animationsEnabled: state.animationsEnabled,
    theme: state.theme,
    magicIsHappening: state.magicIsHappening,
  }));

  const isLoading = gameStatus !== 'idle' && gameStatus !== 'error';
  const isImageLoading = gameStatus === 'generatingImage';


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  
  useEffect(() => {
    // This effect ensures that if a saved game exists, we skip prologues/creation
    // @ts-ignore
    const hasSave = useGameStore.persist.getOptions().storage?.getItem(useGameStore.persist.getOptions().name);
    if (hasSave && gameStage !== 'playing') {
       if (playerCharacter) { // Check if player character is loaded
         setGameStage('playing');
       }
    } else if (gameStage === 'prologue') {
      startPrologue();
    }
  }, [gameStage, startPrologue, setGameStage, playerCharacter]);

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

  const handlePlayAgain = useCallback(() => {
    if (window.confirm('Are you sure you want to start a new game? All progress will be lost.')) {
      useGameStore.persist.clearStorage();
      window.location.reload();
    }
  }, []);
  
  const loadingFallback = (
    <div className="min-h-screen text-text-primary flex flex-col items-center justify-center p-4">
      <Header />
      <div className="mt-8 flex items-center gap-4">
        <LoadingIndicator className="h-8 w-8" />
        <p className="text-xl text-accent-primary font-heading">Awakening the threads of fate...</p>
      </div>
    </div>
  );

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
              <button
                onClick={retryLastAction}
                className="ml-auto mt-2 sm:mt-0 px-3 py-1 bg-error/40 hover:bg-error/60 text-white font-bold rounded-md transition-colors duration-200 text-sm"
              >
                Retry
              </button>
            </div>
          )}
          
          <StoryPanel storyHistory={storyHistory} isLoading={isLoading && !isImageLoading} />
          
          <div className="flex-shrink-0">
            {isLoading && !isImageLoading && (
              <div className="my-4 flex justify-center items-center gap-3">
                <LoadingIndicator />
                <p className="text-accent-primary animate-pulse font-heading">{isSpeechLoading ? 'Narrating the story...' : loadingMessage}</p>
              </div>
            )}
             {(storyHistory.length > 0 && !(isLoading && !isImageLoading) && storyHistory[storyHistory.length - 1]?.description !== '...') && (
               <hr className="my-4 border-t border-dashed border-border" />
             )}
          </div>

          <div className="mt-auto pt-4">
            <ActionInput
              choices={currentScene?.choices ?? []}
              onSubmit={handlePlayerAction}
              disabled={isLoading || isGameOver}
              isCreatingCharacter={!playerCharacter}
              allowCustomAction={currentScene?.allowCustomAction}
              allowExamineAction={currentScene?.allowExamineAction}
            />
          </div>
        </div>

        {/* === Right Column: The Codex === */}
        <div className="lg:col-span-4 xl:col-span-4 lg:max-h-full">
            {playerCharacter && (
               <CodexSidebar>
                  <CodexSidebar.Section title="Character">
                     <CharacterSheet character={playerCharacter} />
                  </CodexSidebar.Section>
                  <CodexSidebar.Section title="Journal">
                      <JournalPanel journal={journal} />
                  </CodexSidebar.Section>
                   <CodexSidebar.Section title="Lore">
                      <LorePanel />
                  </CodexSidebar.Section>
                  <CodexSidebar.Section title="Inventory">
                      <InventoryPanel inventory={inventory} />
                  </CodexSidebar.Section>
                   <CodexSidebar.Section title="World">
                      <WorldPanel world={world} />
                  </CodexSidebar.Section>
                  <CodexSidebar.Section title="People">
                      <PeoplePanel dramatisPersonae={dramatisPersonae} />
                  </CodexSidebar.Section>
                   <CodexSidebar.Section title="Factions">
                      <FactionsPanel reputation={reputation} />
                  </CodexSidebar.Section>
              </CodexSidebar>
            )}
        </div>
      </main>
      
      {isGameOver && currentScene && (
        <GameOverModal
          endingDescription={currentScene.endingDescription}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default App;