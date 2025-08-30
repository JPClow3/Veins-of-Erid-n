import React, { useState, useEffect, useRef } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import logger from '../../utils/logger';
import { blobManager } from '../../utils/blobManager';

interface ImageDisplayProps {
  imageUrl: string | undefined | null;
  isLoading: boolean;
  className?: string;
  magicIsHappening?: boolean;
  veinStrain?: number;
  echoLevel?: number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, className = '', magicIsHappening = false, veinStrain = 0, echoLevel = 0 }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [imageHasError, setImageHasError] = useState(false);

  const currentUrlRef = useRef(imageUrl);
  
  useEffect(() => {
    if (imageUrl !== currentUrlRef.current) {
        setPreviousImageUrl(currentImageUrl);
        setCurrentImageUrl(imageUrl ?? null);
        currentUrlRef.current = imageUrl;
        setImageHasError(false);
    }
  }, [imageUrl, currentImageUrl]);

  useEffect(() => {
    // When previousImageUrl changes, it means it's no longer needed. Revoke it.
    blobManager.revoke(previousImageUrl);
  }, [previousImageUrl]);

  useEffect(() => {
    // On component unmount, revoke the current URL.
    return () => {
      blobManager.revoke(currentImageUrl);
    };
  }, [currentImageUrl]);


  const handleImageError = () => {
    logger.error('Failed to load scene image.', { imageUrl: currentImageUrl });
    setImageHasError(true);
  };


  const renderContent = () => {
    if (isLoading && !currentImageUrl && !previousImageUrl) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-text-secondary font-ui">
          <LoadingIndicator className="h-10 w-10" />
          <p className="mt-4">Conjuring a vision...</p>
        </div>
      );
    }

    if (imageHasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-text-primary p-4 font-ui">
          <p className="font-heading text-xl text-accent-primary">The Vision is Clouded</p>
          <p className="text-sm mt-1 text-text-secondary">The aether is turbulent, and the image could not be formed.</p>
        </div>
      );
    }
    
    return (
      <>
        {previousImageUrl && (
          <img
            src={previousImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-0"
          />
        )}
        {currentImageUrl && (
           <img
            src={currentImageUrl}
            alt="Current scene"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100 animate-ken-burns"
            onError={handleImageError}
          />
        )}
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white font-ui bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <LoadingIndicator className="h-10 w-10" />
            <p className="mt-4 drop-shadow-md">The world shifts around you...</p>
            </div>
        )}
      </>
    );
  };

  const magicGlowClass = magicIsHappening ? 'animate-magic-glow' : '';
  const loadingGlowClass = isLoading && !magicIsHappening ? 'animate-pulse-glow' : '';

  const strainClass = veinStrain > 70 ? 'vignette-strain' : '';
  const echoClass = echoLevel > 70 ? 'overlay-echo' : '';

  return (
    <div className={`relative bg-surface rounded-xl overflow-hidden flex items-center justify-center aspect-[4/3] ring-1 ring-border shadow-2xl shadow-glow-primary transition-shadow duration-500 ${className} ${loadingGlowClass} ${magicGlowClass} ${strainClass} ${echoClass}`}>
        <div className="absolute inset-0 border-t-2 border-accent-secondary opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center text-text-secondary font-ui text-center">
            The mists of creation have yet to part.
        </div>
        {renderContent()}
    </div>
  );
};

export default ImageDisplay;
