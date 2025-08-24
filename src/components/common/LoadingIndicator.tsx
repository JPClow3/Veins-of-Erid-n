import React from 'react';

interface LoadingIndicatorProps {
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ className = 'h-5 w-5' }) => {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={`${className} text-violet-400`}>
        <style>{`
            .rune-path {
                stroke: currentColor;
                stroke-width: 2.5;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                filter: drop-shadow(0 0 4px currentColor);
                animation: thematic-pulse 2s infinite ease-in-out;
                transform-origin: center;
            }
            @keyframes thematic-pulse {
                0%, 100% {
                    opacity: 0.4;
                    transform: scale(0.98);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.02);
                }
            }
        `}</style>
        <g transform="rotate(15, 24, 24)">
            <path className="rune-path" d="M24 4 L24 44" style={{ animationDelay: '0s' }} />
            <path className="rune-path" d="M6.1 16 L41.9 32" style={{ animationDelay: '0.33s' }} />
            <path className="rune-path" d="M6.1 32 L41.9 16" style={{ animationDelay: '0.66s' }} />
        </g>
    </svg>
  );
};

export default LoadingIndicator;