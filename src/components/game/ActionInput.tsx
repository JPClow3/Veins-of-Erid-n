import React, { useState, memo } from 'react';
import type { Choice } from '../../types/game';
import type { CharacterProfile, PersonalityLean } from '../../types/character';
import { PERSONALITY_LEANS } from '../../constants/gameConstants';

interface ActionInputProps {
  choices: (string | Choice)[];
  onSubmit: (action: string) => void;
  disabled: boolean;
  isCreatingCharacter: boolean;
  playerCharacter: CharacterProfile | null;
  allowCustomAction?: boolean;
  allowExamineAction?: boolean;
}

const IconEmpathy = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1-1v-.5a1.5 1.5 0 01-3 0v.5a1 1 0 00-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>;
const IconCunning = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>;
const IconResolve = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-1.097.023l-7 4.5a1 1 0 000 1.794l7 4.5a1 1 0 001.096-.023l7-4.5a1 1 0 000-1.794l-7-4.5z" /><path d="M10.394 6.08a1 1 0 00-1.097.023l-7 4.5a1 1 0 000 1.794l7 4.5a1 1 0 001.096-.023l7-4.5a1 1 0 000-1.794l-7-4.5z" /></svg>;
const IconLore = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804v-10zM14.5 4.804A7.968 7.968 0 0011 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111 15c1.255 0 2.443-.29 3.5-.804v-10z" /></svg>;

const IconMap = {
  Empathy: <IconEmpathy />,
  Cunning: <IconCunning />,
  Resolve: <IconResolve />,
  Lore: <IconLore />,
};

const getSuccessText = (score: number): { text: string; color: string } => {
    if (score > 7) return { text: "High chance of success.", color: "text-green-400" };
    if (score > 4) return { text: "A reasonable chance of success.", color: "text-yellow-400" };
    return { text: "This approach is risky.", color: "text-orange-400" };
};

const ActionInput: React.FC<ActionInputProps> = ({ choices, onSubmit, disabled, isCreatingCharacter, playerCharacter, allowCustomAction, allowExamineAction }) => {
  const [customAction, setCustomAction] = useState('');
  const [name, setName] = useState('');
  const [submittedAction, setSubmittedAction] = useState<string | null>(null);

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim()) {
      setSubmittedAction(customAction);
      onSubmit(customAction);
      setCustomAction('');
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 1) {
      setSubmittedAction(name.trim());
      onSubmit(name.trim());
      setName('');
    }
  };

  const handleChoiceClick = (choice: string) => {
    setSubmittedAction(choice);
    onSubmit(choice);
  };
  
  React.useEffect(() => {
    if (!disabled) {
        setSubmittedAction(null);
    }
  }, [disabled]);
  
  const highestPersonality = React.useMemo(() => {
    if (!playerCharacter) return null;
    return (Object.entries(playerCharacter.personality) as [PersonalityLean, number][])
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, [playerCharacter]);

  const isNamePrompt = choices.length === 1 && typeof choices[0] === 'string' && choices[0] === 'PROMPT_FOR_NAME';

  if (disabled && submittedAction) {
    return (
        <div className="h-full min-h-[92px] flex items-center justify-center animate-fade-in">
            <p className="text-text-secondary font-ui italic text-center p-4">
                You chose to: "{submittedAction}"
            </p>
        </div>
    );
  }

  if (isNamePrompt) {
    return (
      <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What is your name?"
          disabled={disabled}
          autoFocus
          className="flex-grow bg-surface-muted border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all font-body placeholder:font-ui placeholder:text-text-secondary"
          aria-label="Enter your name"
        />
        <button
          type="submit"
          disabled={disabled || name.trim().length < 2}
          className="p-3 bg-accent-primary hover:bg-accent-primary-hover disabled:bg-accent-primary/30 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-primary font-ui font-bold flex items-center gap-2 text-white"
          aria-label="Confirm name"
        >
          <span>Confirm</span>
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice, index) => {
          const choiceText = typeof choice === 'string' ? choice : choice.text;
          const choiceLean = typeof choice === 'string' ? undefined : choice.lean;
          const isSubmitting = submittedAction === choiceText;
          const isAligned = !isCreatingCharacter && choiceLean && choiceLean !== 'Neutral' && choiceLean === highestPersonality;
          
          const leanScore = playerCharacter && choiceLean && choiceLean !== 'Neutral' ? playerCharacter.personality[choiceLean] : null;
          const successInfo = leanScore !== null ? getSuccessText(leanScore) : null;

          return (
            <button
              key={index}
              onClick={() => handleChoiceClick(choiceText)}
              disabled={disabled}
              className={`relative group text-left p-3 text-text-primary bg-surface-muted/50 hover:bg-surface-muted border-l-2 hover:border-l-4 border-border-accent hover:border-accent-secondary disabled:opacity-60 disabled:cursor-not-allowed rounded-r-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-100 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-opacity-75 font-ui flex items-center gap-3 hover:shadow-glow-secondary ${isSubmitting ? 'bg-accent-primary/30 border-accent-primary scale-95 opacity-80' : ''} ${isAligned ? 'animate-strength-glow' : ''}`}
            >
              {choiceLean && choiceLean !== 'Neutral' && (
                <>
                  <div className="shrink-0">
                    <span className="text-accent-secondary opacity-70 group-hover:opacity-100 transition-opacity">{IconMap[choiceLean]}</span>
                  </div>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-surface text-text-primary text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg ring-1 ring-border z-10 text-left">
                    <p className="font-bold text-accent-secondary">{choiceLean}{leanScore !== null ? ` (${leanScore})` : ''}</p>
                    <p className="font-normal whitespace-normal">{PERSONALITY_LEANS[choiceLean]}</p>
                    {successInfo && <p className={`font-semibold mt-1 ${successInfo.color}`}>{successInfo.text}</p>}
                  </div>
                </>
              )}
              <span className="group-hover:text-white transition-colors duration-200">{choiceText}</span>
            </button>
          );
        })}
      </div>
      
      {allowExamineAction && !isCreatingCharacter && choices.length > 0 && (
          <button
              onClick={() => handleChoiceClick("Examine the surroundings.")}
              disabled={disabled}
              className="w-full text-center p-2 text-text-secondary hover:text-text-primary bg-surface-muted/30 hover:bg-surface-muted/60 border border-dashed hover:border-solid border-border hover:border-accent-primary/80 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-ui text-sm flex items-center justify-center gap-2 group"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Examine</span>
          </button>
      )}

      {(allowCustomAction ?? true) && !isCreatingCharacter && choices.length > 0 && (
        <>
          <div className="relative flex pt-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-text-secondary text-xs font-ui">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form onSubmit={handleCustomActionSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Forge your own path..."
              disabled={disabled}
              className="flex-grow bg-surface-muted/50 border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all font-body placeholder:font-ui placeholder:text-text-secondary"
              aria-label="Custom action input"
            />
            <button
              type="submit"
              disabled={disabled || !customAction.trim()}
              className="p-3 bg-accent-primary hover:bg-accent-primary-hover text-white disabled:bg-accent-primary/30 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-primary font-ui font-bold flex items-center gap-2"
              aria-label="Submit custom action"
            >
              <span>Act</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default memo(ActionInput);
