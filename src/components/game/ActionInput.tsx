import React, { useState, memo } from 'react';
import type { Choice } from '../../types/game';
import type { PersonalityLean } from '../../types/character';

interface ActionInputProps {
  choices: (string | Choice)[];
  onSubmit: (action: string) => void;
  disabled: boolean;
  isCreatingCharacter: boolean;
  allowCustomAction?: boolean;
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

const ActionInput: React.FC<ActionInputProps> = ({ choices, onSubmit, disabled, isCreatingCharacter, allowCustomAction }) => {
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
  
  // Reset submitted action when choices reappear
  React.useEffect(() => {
    if (!disabled) {
        setSubmittedAction(null);
    }
  }, [disabled]);


  // Special state for name prompt during character creation
  const isNamePrompt = choices.length === 1 && typeof choices[0] === 'string' && choices[0] === 'PROMPT_FOR_NAME';

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
          className="flex-grow bg-slate-900/50 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-body placeholder:font-ui placeholder:text-slate-500"
          aria-label="Enter your name"
        />
        <button
          type="submit"
          disabled={disabled || name.trim().length < 2}
          className="p-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 font-ui font-bold flex items-center gap-2"
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

          return (
            <button
              key={index}
              onClick={() => handleChoiceClick(choiceText)}
              disabled={disabled}
              className={`text-left p-3 text-slate-300 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-violet-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:border-slate-700 rounded-lg transition-all duration-200 transform hover:-translate-y-px active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 font-ui flex items-center gap-3 group hover:shadow-violet-400/30 hover:shadow-[0_0_15px_var(--tw-shadow-color)] ${isSubmitting ? 'bg-violet-600/30 border-violet-500 scale-95 opacity-80 animate-flash-confirm' : ''}`}
            >
              {choiceLean && choiceLean !== 'Neutral' && (
                <span className="text-teal-300 opacity-70 shrink-0 group-hover:opacity-100 transition-opacity">{IconMap[choiceLean]}</span>
              )}
              <span>{choiceText}</span>
            </button>
          );
        })}
      </div>
      
      {(allowCustomAction ?? true) && !isCreatingCharacter && choices.length > 0 && (
        <>
          <div className="relative flex pt-2 items-center">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-ui">OR</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>

          <form onSubmit={handleCustomActionSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Forge your own path..."
              disabled={disabled}
              className="flex-grow bg-slate-900/50 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-body placeholder:font-ui placeholder:text-slate-500"
              aria-label="Custom action input"
            />
            <button
              type="submit"
              disabled={disabled || !customAction.trim()}
              className="p-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/30 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 font-ui font-bold flex items-center gap-2"
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
      <style>{`
        .animate-flash-confirm {
          animation: flash-confirm 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default memo(ActionInput);