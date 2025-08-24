import React, { useState, Fragment, useMemo } from 'react';
import type { Item, ItemCategory } from '../../types/game';

interface InventoryPanelProps {
  inventory: Item[];
}

const ItemIcon: React.FC<{ category: ItemCategory }> = ({ category }) => {
  const icons = {
    'Key Item': () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
    'Consumable': () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>,
    'Document': () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  };
  return icons[category] ? icons[category]() : null;
};


const ItemCard: React.FC<{ item: Item, onClick: () => void }> = ({ item, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 flex items-center gap-4 bg-slate-950/50 hover:bg-slate-800/60 rounded-lg ring-1 ring-violet-400/20 hover:ring-violet-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
  >
    <div className="text-teal-300 flex-shrink-0">
      <ItemIcon category={item.category} />
    </div>
    <span className="font-heading text-violet-300 text-lg">{item.name}</span>
  </button>
);

const ItemDetailModal: React.FC<{ item: Item, onClose: () => void }> = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
            <div className="relative bg-slate-900 rounded-xl p-6 max-w-lg w-full ring-1 ring-violet-500/30 shadow-2xl shadow-violet-500/10 transform animate-slide-up-fast">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-violet-300 font-heading">{item.name}</h3>
                        <p className="text-teal-300 font-ui text-sm font-semibold">{item.category}</p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed font-body italic">&ldquo;{item.description}&rdquo;</p>
            </div>
             <style>{`
                @keyframes slide-up-fast {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up-fast {
                    animation: slide-up-fast 0.3s ease-out forwards;
                }
             `}</style>
        </div>
    );
};


const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const categorizedItems = useMemo(() => {
    return inventory.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<ItemCategory, Item[]>);
  }, [inventory]);

  const categoryOrder: ItemCategory[] = ['Key Item', 'Document', 'Consumable'];

  if (inventory.length === 0) {
    return (
      <div id="tabpanel-inventory" role="tabpanel" aria-labelledby="tab-inventory" className="text-center p-6 text-slate-400 font-ui italic bg-slate-950/30 rounded-lg ring-1 ring-violet-400/20">
        <p>Your satchel is empty. The road ahead may hold treasures yet unknown.</p>
      </div>
    );
  }

  return (
    <Fragment>
        <div id="tabpanel-inventory" role="tabpanel" aria-labelledby="tab-inventory" className="space-y-4 stagger-in max-h-[250px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
            {categoryOrder.map(category => {
                if (!categorizedItems[category]) return null;
                return (
                    <div key={category}>
                        <h4 className="font-semibold text-slate-400 font-ui text-xs uppercase tracking-wider mb-2">{category}s</h4>
                        <div className="space-y-2">
                            {categorizedItems[category].map((item, index) => (
                                <ItemCard key={`${item.name}-${index}`} item={item} onClick={() => setSelectedItem(item)} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
        {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        <style>{`
            .stagger-in > * {
                opacity: 0;
                animation: reveal-item 0.6s ease-out forwards;
            }
            .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #8b5cf6; /* violet-500 */
            border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #7c3aed; /* violet-600 */
            }
        `}</style>
    </Fragment>
  );
};

export default InventoryPanel;
