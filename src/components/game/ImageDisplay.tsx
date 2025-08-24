import React, { useState, useEffect, useRef } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import logger from '../../utils/logger';

interface ImageDisplayProps {
  imageUrl: string | undefined | null;
  isLoading: boolean;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, className = '' }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [imageHasError, setImageHasError] = useState(false);

  const currentUrlRef = useRef(imageUrl);
  
  useEffect(() => {
    // If the new imageUrl is different from the one we're currently displaying
    if (imageUrl !== currentUrlRef.current) {
        setPreviousImageUrl(currentImageUrl); // Move current to previous
        setCurrentImageUrl(imageUrl ?? null);     // Set the new one as current
        currentUrlRef.current = imageUrl;
        setImageHasError(false); // Reset error state on new image
    }
  }, [imageUrl, currentImageUrl]);

  useEffect(() => {
    // Cleanup for previousImageUrl when it changes
    return () => {
      if (previousImageUrl && previousImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousImageUrl);
      }
    };
  }, [previousImageUrl]);

  useEffect(() => {
    // Cleanup for the very last image when component unmounts
    return () => {
      if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [currentImageUrl]);

  const handleImageError = () => {
    logger.error('Failed to load scene image.', { imageUrl: currentImageUrl });
    setImageHasError(true);
  };


  const renderContent = () => {
    // Initial loading state (no images at all)
    if (isLoading && !currentImageUrl && !previousImageUrl) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-300 font-ui">
          <LoadingIndicator className="h-10 w-10" />
          <p className="mt-4">Conjuring a vision...</p>
        </div>
      );
    }

    if (imageHasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-300 p-4 font-ui">
          <p className="font-heading text-xl text-violet-300">The Vision is Clouded</p>
          <p className="text-sm mt-1 text-slate-400">The aether is turbulent, and the image could not be formed.</p>
        </div>
      );
    }
    
    return (
      <>
        {/* Previous Image (for cross-fade) */}
        {previousImageUrl && (
          <img
            src={previousImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-0"
          />
        )}
        {/* Current Image */}
        {currentImageUrl && (
           <img
            src={currentImageUrl}
            alt="Current scene"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100 animate-ken-burns"
            onError={handleImageError}
          />
        )}
        {/* Loading overlay for when an image is being replaced */}
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white font-ui bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <LoadingIndicator className="h-10 w-10" />
            <p className="mt-4 drop-shadow-md">The world shifts around you...</p>
            </div>
        )}
      </>
    );
  };

  return (
    <div className={`relative bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center aspect-video ring-1 ring-violet-400/30 shadow-2xl shadow-violet-950/20 transition-shadow duration-500 ${className} ${isLoading ? 'animate-pulse-glow' : ''}`}>
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-ui text-center">
            The mists of creation have yet to part.
        </div>
        {renderContent()}
        <style>{`
            .animate-pulse-glow {
                animation: pulse-glow 2s ease-in-out infinite;
            }
            @keyframes ken-burns {
                0% { transform: scale(1) translate(0, 0); }
                100% { transform: scale(1.1) translate(-2%, 2%); }
            }
            .animate-ken-burns {
                animation: ken-burns 25s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default ImageDisplay;