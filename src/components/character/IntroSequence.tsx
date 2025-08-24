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
    <div className="min-h-screen text-slate-200 flex flex-col items-center justify-center p-4">
      <Header />
      <main className="w-full max-w-4xl flex-grow flex flex-col justify-center mt-6">
        <div className="bg-slate-900 rounded-xl p-6 flex flex-col ring-1 ring-violet-400/30 shadow-2xl shadow-violet-950/20 h-[70vh]">
          {storyHistory.length > 0 ? (
            <>
              <StoryPanel storyHistory={storyHistory} isLoading={isLoading} />
              <div className="flex-shrink-0 mt-auto pt-4">
                <ActionInput
                  choices={currentScene?.choices ?? []}
                  onSubmit={onAction}
                  disabled={isLoading}
                  isCreatingCharacter={true}
                  allowCustomAction={false}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full gap-4">
                <LoadingIndicator className="h-8 w-8" />
                <p className="text-xl text-violet-300 font-heading">Awakening the threads of fate...</p>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IntroSequence;
