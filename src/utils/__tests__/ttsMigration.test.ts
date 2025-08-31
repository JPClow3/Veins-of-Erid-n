import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SpeechifyTTSProvider, initializeSpeechifyTTS } from '../speechifyClient';
import { ttsService, generateSpeechAudio } from '../ttsService';
import { getTTSConfig } from '../config';

// Mock the Speechify API
vi.mock('@speechify/api', () => ({
  SpeechifyClient: vi.fn().mockImplementation(() => ({
    tts: {
      audio: {
        speech: vi.fn().mockResolvedValue({
          audioData: 'mock-base64-audio-data',
          audioFormat: 'wav',
          speechMarks: null,
          billableCharactersCount: 50
        })
      },
      voices: {
        list: vi.fn().mockResolvedValue([
          {
            id: 'scott',
            displayName: 'Scott',
            gender: 'male',
            locale: 'en-US',
            models: [{ languages: [{ locale: 'en-US' }] }]
          },
          {
            id: 'sarah',
            displayName: 'Sarah',
            gender: 'female',
            locale: 'en-US',
            models: [{ languages: [{ locale: 'en-US' }] }]
          }
        ])
      }
    }
  }))
}));

// Mock the Gemini TTS
vi.mock('../../features/game/gameService', () => ({
  generateSpeechAudio: vi.fn().mockResolvedValue('mock-gemini-base64-audio')
}));

// Mock environment variables
const originalEnv = process.env;

describe('TTS Migration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Configuration Tests', () => {
    it('should detect Speechify API key when available', () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      const config = getTTSConfig();
      
      expect(config.speechifyApiKey).toBe('test-key');
      expect(config.useSpeechify).toBe(true);
    });

    it('should fall back to Gemini when Speechify key is not available', () => {
      delete process.env.SPEECHIFY_API_KEY;
      const config = getTTSConfig();
      
      expect(config.speechifyApiKey).toBeUndefined();
      expect(config.useSpeechify).toBe(false);
    });
  });

  describe('Speechify TTS Provider Tests', () => {
    let provider: SpeechifyTTSProvider;

    beforeEach(() => {
      provider = new SpeechifyTTSProvider('test-key');
    });

    it('should synthesize speech with default options', async () => {
      const result = await provider.synthesizeSpeech('Hello world');
      
      expect(result.audioData).toBe('mock-base64-audio-data');
      expect(result.format).toBe('wav');
      expect(result.billableCharactersCount).toBe(50);
    });

    it('should synthesize speech with custom options', async () => {
      const result = await provider.synthesizeSpeech('Hello world', {
        voice: 'sarah',
        format: 'mp3',
        language: 'en'
      });
      
      expect(result.audioData).toBe('mock-base64-audio-data');
      expect(result.format).toBe('mp3');
    });

    it('should determine correct model for English', () => {
      const result = provider['determineModel']('en');
      expect(result).toBe('simba-english');
    });

    it('should determine correct model for non-English', () => {
      const result = provider['determineModel']('es');
      expect(result).toBe('simba-multilingual');
    });

    it('should get available voices', async () => {
      const voices = await provider.getVoices();
      
      expect(voices).toHaveLength(2);
      expect(voices[0]).toEqual({
        id: 'scott',
        name: 'Scott',
        language: 'en-US',
        gender: 'male'
      });
    });

    it('should provide backward compatibility with generateSpeechAudio', async () => {
      const result = await provider.generateSpeechAudio('Test narrative text');
      
      expect(result).toBe('mock-base64-audio-data');
    });
  });

  describe('Unified TTS Service Tests', () => {
    beforeEach(() => {
      // Reset the service
      vi.clearAllMocks();
    });

    it('should initialize with Speechify when API key is available', async () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      
      // Re-initialize the service
      const service = new (await import('../ttsService')).UnifiedTTSService();
      
      expect(service.getProviderName()).toBe('speechify');
      expect(service.isAvailable()).toBe(true);
    });

    it('should fall back to Gemini when Speechify is not available', async () => {
      delete process.env.SPEECHIFY_API_KEY;
      
      // Re-initialize the service
      const service = new (await import('../ttsService')).UnifiedTTSService();
      
      expect(service.getProviderName()).toBe('gemini');
      expect(service.isAvailable()).toBe(true);
    });

    it('should generate speech with Speechify provider', async () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      
      const result = await generateSpeechAudio('Test text');
      
      expect(result).toBe('mock-base64-audio-data');
    });

    it('should fall back to Gemini when Speechify fails', async () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      
      // Mock Speechify to fail
      const mockSpeechifyClient = require('@speechify/api').SpeechifyClient;
      mockSpeechifyClient.mockImplementation(() => ({
        tts: {
          audio: {
            speech: vi.fn().mockRejectedValue(new Error('Speechify API error'))
          }
        }
      }));
      
      const result = await generateSpeechAudio('Test text');
      
      expect(result).toBe('mock-gemini-base64-audio');
    });

    it('should handle empty text gracefully', async () => {
      await expect(generateSpeechAudio('')).rejects.toThrow('Text cannot be empty');
    });
  });

  describe('Integration Tests', () => {
    it('should maintain backward compatibility with existing code', async () => {
      // Test that the existing generateSpeechAudio function still works
      const result = await generateSpeechAudio('Test narrative text');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle provider switching', async () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      
      const service = new (await import('../ttsService')).UnifiedTTSService();
      
      // Start with Speechify
      expect(service.getProviderName()).toBe('speechify');
      
      // Switch to Gemini
      await service.switchToProvider('gemini');
      expect(service.getProviderName()).toBe('gemini');
      
      // Switch back to Speechify
      await service.switchToProvider('speechify');
      expect(service.getProviderName()).toBe('speechify');
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle Speechify API errors gracefully', async () => {
      process.env.SPEECHIFY_API_KEY = 'test-key';
      
      // Mock Speechify to fail
      const mockSpeechifyClient = require('@speechify/api').SpeechifyClient;
      mockSpeechifyClient.mockImplementation(() => ({
        tts: {
          audio: {
            speech: vi.fn().mockRejectedValue(new Error('API rate limit exceeded'))
          }
        }
      }));
      
      // Should fall back to Gemini
      const result = await generateSpeechAudio('Test text');
      expect(result).toBe('mock-gemini-base64-audio');
    });

    it('should throw error when no providers are available', async () => {
      delete process.env.SPEECHIFY_API_KEY;
      
      // Mock Gemini to also fail
      const mockGeminiService = require('../../features/game/gameService');
      mockGeminiService.generateSpeechAudio.mockRejectedValue(new Error('Gemini API error'));
      
      await expect(generateSpeechAudio('Test text')).rejects.toThrow();
    });
  });
});

// E2E Tests (only run if API key is available)
const speechifyApiKey = process.env.SPEECHIFY_API_KEY;

(speechifyApiKey ? describe : describe.skip)('Speechify TTS E2E Tests', () => {
  it('should generate mp3 audio with real API', async () => {
    const { SpeechifyClient } = await import('@speechify/api');
    const client = new SpeechifyClient({ token: speechifyApiKey! });

    const response = await client.tts.audio.speech({
      audioFormat: 'mp3',
      input: 'This is a Speechify E2E test in TypeScript.',
      language: 'en-US',
      model: 'simba-english',
      voiceId: 'scott'
    });

    expect(response.audioFormat).toBe('mp3');
    expect(response.audioData).toBeDefined();
    expect(response.audioData.length).toBeGreaterThan(0);
  }, 30000);

  it('should list voices with real API', async () => {
    const { SpeechifyClient } = await import('@speechify/api');
    const client = new SpeechifyClient({ token: speechifyApiKey! });

    const voices = await client.tts.voices.list();
    
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
    expect(voices[0]).toHaveProperty('id');
    expect(voices[0]).toHaveProperty('displayName');
  }, 30000);

  it('should generate wav audio with real API', async () => {
    const { SpeechifyClient } = await import('@speechify/api');
    const client = new SpeechifyClient({ token: speechifyApiKey! });

    const response = await client.tts.audio.speech({
      audioFormat: 'wav',
      input: 'Testing WAV format output.',
      language: 'en-US',
      model: 'simba-english',
      voiceId: 'scott'
    });

    expect(response.audioFormat).toBe('wav');
    expect(response.audioData).toBeDefined();
    expect(response.audioData.length).toBeGreaterThan(0);
  }, 30000);
}); 