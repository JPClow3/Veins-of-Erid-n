import { generateSpeechAudio as generateGeminiSpeech } from '../features/game/gameService';
import { initializeSpeechifyTTS, getSpeechifyTTS, SpeechifyTTSProvider } from './speechifyClient';
import { getTTSConfig, getTTSProviderType } from './config';
import logger from './logger';

export interface TTSService {
  generateSpeechAudio(text: string): Promise<string>;
  isAvailable(): boolean;
  getProviderName(): string;
}

class UnifiedTTSService implements TTSService {
  private speechifyProvider: SpeechifyTTSProvider | null = null;
  private currentProvider: 'speechify' | 'gemini' | 'none' = 'none';
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const config = getTTSConfig();
      const providerType = getTTSProviderType();

      if (providerType === 'speechify' && config.speechifyApiKey) {
        this.speechifyProvider = initializeSpeechifyTTS(config.speechifyApiKey);
        this.currentProvider = 'speechify';
        logger.info('Initialized Speechify TTS provider');
      } else if (providerType === 'gemini') {
        this.currentProvider = 'gemini';
        logger.info('Using Gemini TTS provider');
      } else {
        this.currentProvider = 'none';
        logger.warn('No TTS provider available');
      }

      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize TTS service', { error });
      this.currentProvider = 'none';
      this.initialized = true;
    }
  }

  async generateSpeechAudio(text: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      switch (this.currentProvider) {
        case 'speechify':
          if (!this.speechifyProvider) {
            throw new Error('Speechify provider not initialized');
          }
          return await this.speechifyProvider.generateSpeechAudio(text);

        case 'gemini':
          return await generateGeminiSpeech(text);

        case 'none':
        try {
          switch (this.currentProvider) {
            case 'speechify':
              if (!this.speechifyProvider) {
                logger.error('Speechify provider not initialized');
                throw new Error('Speechify provider not initialized');
              }
              return await this.speechifyProvider.generateSpeechAudio(text);

            case 'gemini':
              return await generateGeminiSpeech(text);

            case 'none':
            default:
              throw new Error('No TTS provider available');
          }
        } catch (error) {
          logger.error('TTS generation failed', {
            provider: this.currentProvider,
            error,
            text: text.substring(0, 100)
          });

          // If Speechify fails and fallback is enabled, try Gemini
          /*...*/

  isAvailable(): boolean {
    return this.initialized && this.currentProvider !== 'none';
  }

  getProviderName(): string {
    return this.currentProvider;
  }

  // Method to switch providers dynamically (useful for testing)
  async switchToProvider(provider: 'speechify' | 'gemini'): Promise<void> {
    const config = getTTSConfig();
    
    if (provider === 'speechify' && config.speechifyApiKey) {
      this.speechifyProvider = initializeSpeechifyTTS(config.speechifyApiKey);
      this.currentProvider = 'speechify';
      logger.info('Switched to Speechify TTS provider');
    } else if (provider === 'gemini') {
      this.currentProvider = 'gemini';
      logger.info('Switched to Gemini TTS provider');
    } else {
      throw new Error(`Cannot switch to provider: ${provider}`);
    }
  }

  // Get available voices (Speechify only)
  async getVoices() {
    if (this.currentProvider === 'speechify' && this.speechifyProvider) {
      return await this.speechifyProvider.getVoices();
    }
    return [];
  }
}

// Create singleton instance
export const ttsService = new UnifiedTTSService();

// Export the class for testing
export { UnifiedTTSService };

// Backward compatibility export
export const generateSpeechAudio = (text: string): Promise<string> => {
  return ttsService.generateSpeechAudio(text);
}; 