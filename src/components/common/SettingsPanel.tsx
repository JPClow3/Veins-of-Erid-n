
import React, { useState, useRef, useEffect } from 'react';
import useGameStore from '../../store/gameStore';

const MuteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
const AnimationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591l3.409 3.409m-6.838 4.292c.251-.023.501-.05.75-.082m-.75.082a24.301 24.301 0 004.5 0m0 0v-5.714c0-.597-.237-1.17-.659-1.591L14.25 10.5M14.25 10.5l-3.409 3.409m6.838 4.292a24.282 24.282 0 00-4.5 0M12 20.25h.008v.008H12v-.008z" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>;
const SpeechIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;

const SettingsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const panelRef = useRef<HTMLDivElement>(null);
    const {
        isMuted,
        toggleMute,
        textSize,
        setTextSize,
        animationsEnabled,
        toggleAnimations,
        isSpeechEnabled,
        toggleSpeech,
    } = useGameStore(state => ({
        isMuted: state.isMuted,
        toggleMute: state.toggleMute,
        textSize: state.textSize,
        setTextSize: state.setTextSize,
        animationsEnabled: state.animationsEnabled,
        toggleAnimations: state.toggleAnimations,
        isSpeechEnabled: state.isSpeechEnabled,
        toggleSpeech: state.toggleSpeech,
    }));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = () => {
        setSaveMessage('Game Saved!');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleLoad = () => {
        if (window.confirm('Load your saved game? This will reload the page.')) {
            window.location.reload();
        }
    };

    const handleNewGame = () => {
        if (window.confirm('Are you sure you want to start a new game? Your current progress will be lost.')) {
            useGameStore.persist.clearStorage();
            window.location.reload();
        }
    };

    const textSizes = [
        { id: 'text-size-sm' as const, label: 'S' },
        { id: 'text-size-md' as const, label: 'M' },
        { id: 'text-size-lg' as const, label: 'L' },
    ];

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open settings panel"
                className="p-2 bg-slate-800/50 hover:bg-slate-800/90 rounded-full text-slate-300 hover:text-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isOpen && (
                <div ref={panelRef} className="absolute top-full right-0 mt-2 w-72 bg-slate-900 rounded-lg p-4 ring-1 ring-violet-400/30 shadow-2xl shadow-violet-950/50 animate-fade-in-fast font-ui">
                    <h3 className="font-bold text-violet-300 mb-4">Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-slate-400 text-sm font-bold mb-2">Game</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-md transition-colors relative">
                                    Save
                                    {saveMessage && <span className="absolute -top-2 -right-2 text-xs bg-violet-500 text-white rounded-full px-1.5 animate-fade-in-fast">✓</span>}
                                </button>
                                <button onClick={handleLoad} className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">Load</button>
                                <button onClick={handleNewGame} className="px-3 py-1.5 text-sm bg-red-800/50 hover:bg-red-800/80 rounded-md transition-colors text-red-200">New Game</button>
                            </div>
                        </div>

                        <hr className="border-slate-700/50"/>
                        
                        <h4 className="text-slate-400 text-sm font-bold -mb-2">Accessibility</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-2"><MuteIcon /> Audio</span>
                            <button onClick={toggleMute} className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 rounded-md w-16">{isMuted ? 'Muted' : 'On'}</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-2"><SpeechIcon /> Narration</span>
                            <button onClick={toggleSpeech} className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 rounded-md w-16">{isSpeechEnabled ? 'On' : 'Off'}</button>
                        </div>
                        <div className="flex items-center justify-between">
                             <span className="text-slate-300 flex items-center gap-2"><AnimationIcon /> Animations</span>
                             <button onClick={toggleAnimations} className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 rounded-md w-16">{animationsEnabled ? 'On' : 'Off'}</button>
                        </div>
                        <div>
                             <span className="text-slate-300 flex items-center gap-2 mb-2"><TextIcon /> Text Size</span>
                             <div className="flex items-center justify-between bg-slate-800 rounded-md p-1">
                                {textSizes.map(({ id, label }) => (
                                    <button 
                                        key={id} 
                                        onClick={() => setTextSize(id)}
                                        className={`w-full text-center py-1 rounded transition-colors ${textSize === id ? 'bg-violet-600 text-white' : 'hover:bg-slate-700'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}
             <audio id="bg-music" loop src="https://assets.codepen.io/217233/eridun-ambience.mp3" preload="auto"></audio>
        </div>
    );
};

export default SettingsPanel;
