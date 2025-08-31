import { SpeechifyClient } from '@speechify/api';
import logger from './logger';

export interface SpeechifyTTSOptions {
  voice?: string;
  language?: string;
  format?: 'mp3' | 'wav' | 'ogg' | 'aac';
  model?: 'simba-english' | 'simba-multilingual';
}

export interface SpeechifyTTSResponse {
  audioData: string; // base64 encoded audio
  format: string;
  speechMarks?: any;
  billableCharactersCount?: number;
}

class SpeechifyTTSProvider {
  private client: SpeechifyClient;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new SpeechifyClient({ token: apiKey });
  }

  async synthesizeSpeech(text: string, options: SpeechifyTTSOptions = {}): Promise<SpeechifyTTSResponse> {
    try {
      logger.info('Calling Speechify TTS', { 
        textLength: text.length, 
        voice: options.voice || 'scott',
        format: options.format || 'wav',
        model: options.model || this.determineModel(options.language)
      });

      const response = await this.client.tts.audio.speech({
        audioFormat: options.format || 'wav',
        input: text,
        language: options.language,
        model: options.model || this.determineModel(options.language),
        voiceId: options.voice || 'scott',
        options: {
          loudnessNormalization: true,
          textNormalization: true
        }
      });

      return {
        audioData: response.audioData,
        format: response.audioFormat,
        speechMarks: response.speechMarks,
        billableCharactersCount: response.billableCharactersCount
      };
    } catch (error) {
      logger.error('Speechify TTS error', { error, text: text.substring(0, 100) });
      throw new Error(`Speechify TTS error: ${error}`);
    }
  }

  private determineModel(language?: string): 'simba-english' | 'simba-multilingual' {
    if (language && (language.startsWith('en') || language === 'en')) {
      return 'simba-english';
    }
    return 'simba-multilingual';
  }

  async getVoices() {
    try {
      const voices = await this.client.tts.voices.list();
      return voices.map(voice => ({
        id: voice.id,
        name: voice.displayName,
        language: voice.locale || voice.models?.[0]?.languages?.[0]?.locale || 'unknown',
        gender: this.mapGender(voice.gender)
      }));
    } catch (error) {
      logger.error('Speechify voices error', { error });
      throw new Error(`Speechify voices error: ${error}`);
    }
  }

  private mapGender(gender: any): 'male' | 'female' | 'other' {
    switch (gender) {
      case 'male': return 'male';
      case 'female': return 'female';
      default: return 'other';
    }
  }

  // Backward compatibility method that matches the current Gemini TTS interface
  async generateSpeechAudio(text: string): Promise<string> {
    // Add the same narrative tone prompt as the original implementation
    const prompt = `Read the following text in a clear, narrative tone: "${text}"`;
    
    const response = await this.synthesizeSpeech(prompt, {
      voice: 'scott', // Default voice for narrative
      format: 'wav', // Match current WAV output
      language: 'en' // English for narrative
    });

    return response.audioData;
  }
}

// Create a singleton instance
let speechifyProvider: SpeechifyTTSProvider | null = null;

export function initializeSpeechifyTTS(apiKey: string): SpeechifyTTSProvider {
  if (!speechifyProvider) {
    speechifyProvider = new SpeechifyTTSProvider(apiKey);
  }
  return speechifyProvider;
}

export function getSpeechifyTTS(): SpeechifyTTSProvider {
  if (!speechifyProvider) {
    throw new Error('Speechify TTS not initialized. Call initializeSpeechifyTTS() first.');
  }
  return speechifyProvider;
}

export { SpeechifyTTSProvider }; 