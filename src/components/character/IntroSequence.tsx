import React from 'react';
import Header from '../common/Header';
import StoryPanel from '../game/StoryPanel';
import ActionInput from '../game/ActionInput';
import LoadingIndicator from '../common/LoadingIndicator';
import type { StoryTurn, GameState } from '../../types/game';

interface IntroSequenceProps {
  storyHistory: StoryTurn[];
  isLoading: boolean;
  currentScene: GameState | null;
  onAction: (action: string) => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ storyHistory, isLoading, currentScene, onAction }) => {
  return (
    <div className="min-h-screen text-text-primary flex flex-col items-center justify-center p-4">
      <div className="animate-fade-in-up">
        <Header />
      </div>
      <main className="w-full max-w-4xl flex-grow flex flex-col justify-center mt-6">
        <div className="bg-surface rounded-xl p-6 flex flex-col ring-1 ring-border shadow-2xl shadow-glow-primary h-[70vh]">
          {storyHistory.length > 0 ? (
            <>
              <StoryPanel storyHistory={storyHistory} isLoading={isLoading} />
              <div className="flex-shrink-0 mt-auto pt-4">
                <ActionInput
                  choices={currentScene?.choices ?? []}
                  onSubmit={onAction}
                  disabled={isLoading}
                  isCreatingCharacter={true}
                  // FIX: Added the required 'playerCharacter' prop, which is null during the intro sequence.
                  playerCharacter={null}
                  allowCustomAction={false}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full gap-4">
                <LoadingIndicator className="h-8 w-8" />
                <p className="text-xl text-accent-primary font-heading">Awakening the threads of fate...</p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IntroSequence;