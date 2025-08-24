import React, { memo } from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  updatedTabs?: string[];
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, updatedTabs = [] }) => {
  return (
    <div className="flex border-b border-violet-400/20 mb-4" role="tablist" aria-label="Game Information">
      {tabs.map((tab) => {
        const isUpdated = updatedTabs.includes(tab);
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-4 py-2 font-ui text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-t-md -mb-px ${
              activeTab === tab
                ? 'border-b-2 border-violet-400 text-violet-300'
                : 'text-slate-400 hover:text-violet-300'
            } ${isUpdated ? 'animate-tab-pulse' : ''}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab.toLowerCase()}`}
            id={`tab-${tab.toLowerCase()}`}
          >
            {tab}
            {isUpdated && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-400"></span>}
          </button>
        );
      })}
      <style>{`
        .animate-tab-pulse {
          animation: tab-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(Tabs);