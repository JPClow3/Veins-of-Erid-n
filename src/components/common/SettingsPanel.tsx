import React, { useState, useRef, useEffect } from 'react';
import useGameStore from '../../store/gameStore';

const MuteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
const AnimationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591l3.409 3.409m-6.838 4.292c.251-.023.501-.05.75-.082m-.75.082a24.301 24.301 0 004.5 0m0 0v-5.714c0-.597-.237-1.17-.659-1.591L14.25 10.5M14.25 10.5l-3.409 3.409m6.838 4.292a24.282 24.282 0 00-4.5 0M12 20.25h.008v.008H12v-.008z" /></svg>;
const ThemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.59-1.59M3 12H.75m.386-6.364L5.05 7.05M12 12a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 002.25 2.25 2.25 2.25 0 002.25-2.25A2.25 2.25 0 0012 12z" /></svg>;
const SpeechIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
const LanguageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>;


const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void, labelOn: string, labelOff: string, icon: React.ReactNode }> = ({ checked, onChange, labelOn, labelOff, icon }) => {
    return (
        <div className="flex items-center justify-between w-full">
            <span className="text-text-primary flex items-center gap-3 text-sm font-semibold">
                {icon}
                {checked ? labelOn : labelOff}
            </span>
            <button
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-muted ${
                checked ? 'bg-accent-primary' : 'bg-surface-muted'
                }`}
            >
                <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
                />
            </button>
        </div>
    );
}

const SettingsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const {
        isMuted,
        toggleMute,
        theme,
        toggleTheme,
        language,
        setLanguage,
        animationsEnabled,
        toggleAnimations,
        isSpeechEnabled,
        toggleSpeech,
    // Fix: Removed unused and non-existent 'isLoading' property.
    } = useGameStore(state => ({
        isMuted: state.isMuted,
        toggleMute: state.toggleMute,
        theme: state.theme,
        toggleTheme: state.toggleTheme,
        language: state.language,
        setLanguage: state.setLanguage,
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

    const handleNewGame = () => {
        if (window.confirm('Are you sure you want to start a new game? Your current progress will be lost.')) {
            useGameStore.persist.clearStorage();
            window.location.reload();
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open settings panel"
                className="p-2 bg-surface/50 hover:bg-surface backdrop-blur-sm rounded-full text-text-secondary hover:text-accent-primary transition-all focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background focus:ring-accent-primary"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isOpen && (
                <div ref={panelRef} className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-lg p-4 ring-1 ring-border shadow-2xl shadow-glow-primary animate-fade-in font-ui">
                    <h3 className="font-bold text-accent-primary mb-4 font-heading text-lg">Settings</h3>
                    <div className="space-y-4">
                        <div>
                             <button onClick={handleNewGame} className="w-full px-3 py-1.5 text-sm bg-error/20 hover:bg-error/40 rounded-md transition-colors text-error hover:text-white font-semibold">Start New Game</button>
                        </div>

                        <hr className="border-border"/>
                        
                        <ToggleSwitch checked={theme === 'light'} onChange={toggleTheme} labelOn="Light Mode" labelOff="Dark Mode" icon={<ThemeIcon />} />
                        <ToggleSwitch checked={!isMuted} onChange={toggleMute} labelOn="Audio On" labelOff="Audio Muted" icon={<MuteIcon />} />
                        <ToggleSwitch checked={isSpeechEnabled} onChange={toggleSpeech} labelOn="Narration On" labelOff="Narration Off" icon={<SpeechIcon />} />
                        <ToggleSwitch checked={animationsEnabled} onChange={toggleAnimations} labelOn="Animations On" labelOff="Animations Off" icon={<AnimationIcon />} />
                        
                         <hr className="border-border"/>

                        <div className="flex items-center justify-between w-full">
                            <span className="text-text-primary flex items-center gap-3 text-sm font-semibold">
                                <LanguageIcon /> Language
                            </span>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
                                className="bg-surface-muted border border-border text-text-primary text-sm rounded-md focus:ring-accent-primary focus:border-accent-primary p-1.5"
                            >
                                <option value="en">English</option>
                                <option value="pt" disabled>Português</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;