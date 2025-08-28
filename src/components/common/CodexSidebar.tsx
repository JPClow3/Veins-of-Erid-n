import React, { Children, isValidElement, cloneElement, useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';

interface CodexSidebarProps {
  children: React.ReactNode;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean; // Injected by parent
  onToggle?: (e: React.SyntheticEvent<HTMLDetailsElement>) => void; // Injected by parent
}

const Section: React.FC<SectionProps> = ({ title, children, isOpen, onToggle }) => {
  const { updatedTabs } = useGameStore(state => ({ updatedTabs: state.updatedTabs }));
  const isUpdated = updatedTabs.includes(title);

  return (
    <details open={isOpen} onToggle={onToggle} className="codex-details border-b border-border transition-all duration-300">
      <summary className="font-bold text-lg font-heading text-text-primary p-4 cursor-pointer list-none flex justify-between items-center transition-colors hover:bg-surface-muted relative">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 chevron text-accent-secondary transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className={isUpdated ? 'animate-codex-pulse' : ''}>{title}</span>
        </div>
      </summary>
      <div className="p-4 bg-black/10">
        {children}
      </div>
      <style>{`
        .codex-details .chevron { transform: rotate(0deg); }
        .codex-details[open] .chevron { transform: rotate(90deg); }
        .codex-details > summary::-webkit-details-marker { display: none; }
        .codex-details[open] > summary {
            background-color: var(--color-surface-muted);
            border-left: 3px solid var(--color-accent-primary);
            padding-left: calc(1rem - 3px);
        }
        .codex-details > div {
            animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </details>
  );
};

const CodexSidebar: React.FC<CodexSidebarProps> & { Section: React.FC<Omit<SectionProps, 'isOpen' | 'onToggle'>> } = ({ children }) => {
  const [openSection, setOpenSection] = useState<string | null>('Character');
  const { highlightedTab, clearUpdatedTabs, setHighlightedTab } = useGameStore(state => ({
    highlightedTab: state.highlightedTab,
    clearUpdatedTabs: state.clearUpdatedTabs,
    setHighlightedTab: state.setHighlightedTab,
  }));
  
  useEffect(() => {
    if (highlightedTab) {
      setOpenSection(highlightedTab);
      const timer = setTimeout(() => {
        setHighlightedTab(null);
        clearUpdatedTabs();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTab, clearUpdatedTabs, setHighlightedTab]);
  
  const handleToggle = (title: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenSection(title);
    } else if (openSection === title) {
      setOpenSection(null);
    }
  };

  return (
    <div className="bg-surface rounded-xl ring-1 ring-border h-full overflow-hidden flex flex-col">
       <div className="custom-scrollbar overflow-y-auto">
        {Children.map(children, child => {
          if (isValidElement(child) && child.type === Section) {
            const { title } = child.props as { title: string };
            return cloneElement(child as React.ReactElement<SectionProps>, {
              isOpen: openSection === title,
              onToggle: (e: React.SyntheticEvent<HTMLDetailsElement>) => handleToggle(title, e.currentTarget.open),
            });
          }
          return child;
        })}
       </div>
    </div>
  );
};

CodexSidebar.Section = (props) => <Section {...props} />;

export default CodexSidebar;