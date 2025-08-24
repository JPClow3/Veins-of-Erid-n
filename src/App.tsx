

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/common/Header';
import ImageDisplay from './components/game/ImageDisplay';
import StoryPanel from './components/game/StoryPanel';
import ActionInput from './components/game/ActionInput';
import GameOverModal from './components/game/GameOverModal';
import LoadingIndicator from './components/common/LoadingIndicator';
import CharacterSheet from './components/game/CharacterSheet';
import Tabs from './components/common/Tabs';
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


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Character');
  
  const {
    gameStage,
    currentScene, 
    storyHistory, 
    isLoading, 
    isImageLoading, 
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
    textSize,
    animationsEnabled,
    updatedTabs,
    clearUpdatedTabs,
    initializeCache,
  } = useGameStore(state => ({
    gameStage: state.gameStage,
    currentScene: state.currentScene,
    storyHistory: state.storyHistory,
    isLoading: state.isLoading,
    isImageLoading: state.isImageLoading,
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
    textSize: state.textSize,
    animationsEnabled: state.animationsEnabled,
    updatedTabs: state.updatedTabs,
    clearUpdatedTabs: state.clearUpdatedTabs,
    initializeCache: state.initializeCache,
  }));

  useEffect(() => {
    initializeCache();
  }, [initializeCache]);
  
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
    if (updatedTabs.length > 0) {
      const timer = setTimeout(() => {
        clearUpdatedTabs();
      }, 5000); // Glow for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [updatedTabs, clearUpdatedTabs]);


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
    <div className="min-h-screen text-slate-300 flex flex-col items-center justify-center p-4">
      <Header />
      <div className="mt-8 flex items-center gap-4">
        <LoadingIndicator className="h-8 w-8" />
        <p className="text-xl text-violet-300 font-heading">Awakening the threads of fate...</p>
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

  const appClasses = `min-h-screen text-slate-300 flex flex-col items-center p-4 sm:p-6 md:p-8 selection:bg-violet-500/30 selection:text-white ${textSize} ${animationsEnabled ? '' : 'animations-disabled'}`;

  return (
    <div className={appClasses}>
      <Header />
      <SettingsPanel />
      <ToastNotifications />

      <main className="w-full max-w-screen-xl flex-grow grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
        <ImageDisplay 
          imageUrl={currentScene?.imageUrl} 
          isLoading={isImageLoading}
          className="lg:col-span-3"
        />

        <div className="bg-slate-900 rounded-xl p-6 flex flex-col ring-1 ring-violet-400/30 shadow-2xl shadow-violet-950/20 max-h-[85vh] lg:max-h-full lg:col-span-2 animate-subtle-glow">
          {error && (
            <div role="alert" className="border border-red-500/50 bg-red-900/30 text-red-300 p-3 rounded-lg mb-4 flex flex-col sm:flex-row items-center gap-3 font-ui">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={retryLastAction}
                className="ml-auto mt-2 sm:mt-0 px-3 py-1 bg-red-500/40 hover:bg-red-500/60 text-white font-bold rounded-md transition-colors duration-200 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {playerCharacter && (
            <>
              <Tabs
                tabs={['Character', 'Journal', 'Inventory', 'World', 'People', 'Factions']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                updatedTabs={updatedTabs}
              />
              <div className="mb-4 flex-shrink-0" key={activeTab}>
                <div className="animate-fade-in-fast">
                  {activeTab === 'Character' && (
                    <div id="tabpanel-character" role="tabpanel" aria-labelledby="tab-character">
                      <CharacterSheet character={playerCharacter} />
                    </div>
                  )}
                  {activeTab === 'Journal' && (
                     <JournalPanel journal={journal} />
                  )}
                   {activeTab === 'Inventory' && (
                     <InventoryPanel inventory={inventory} />
                  )}
                  {activeTab === 'World' && (
                     <WorldPanel world={world} />
                  )}
                  {activeTab === 'People' && (
                     <PeoplePanel dramatisPersonae={dramatisPersonae} />
                  )}
                   {activeTab === 'Factions' && (
                     <FactionsPanel reputation={reputation} />
                  )}
                </div>
              </div>
            </>
          )}
          
          <StoryPanel storyHistory={storyHistory} isLoading={isLoading && !isImageLoading} />
          
          <div className="flex-shrink-0">
            {isLoading && !isImageLoading && (
              <div className="my-4 flex justify-center items-center gap-3">
                <LoadingIndicator />
                <p className="text-violet-400 animate-pulse font-heading">{loadingMessage}</p>
              </div>
            )}
             {(storyHistory.length > 0 && !(isLoading && !isImageLoading) && storyHistory[storyHistory.length - 1]?.description !== '...') && (
               <hr className="my-4 border-t-2 border-dashed border-slate-700/40" />
             )}
          </div>


          <div className="mt-auto pt-4">
            <ActionInput
              choices={currentScene?.choices ?? []}
              onSubmit={handlePlayerAction}
              disabled={isLoading || isGameOver}
              isCreatingCharacter={!playerCharacter}
              allowCustomAction={currentScene?.allowCustomAction}
            />
          </div>
        </div>
      </main>
      
      {isGameOver && currentScene && (
        <GameOverModal
          endingDescription={currentScene.endingDescription}
          onPlayAgain={handlePlayAgain}
        />
      )}
      <style>{`
        .animate-subtle-glow {
          animation: subtle-glow 8s ease-in-out infinite;
        }

        @keyframes fade-in-fast {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
