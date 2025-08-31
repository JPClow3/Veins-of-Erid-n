// Simple TTS Migration Test Suite
// This file provides basic validation without requiring external testing frameworks

import { SpeechifyTTSProvider } from '../speechifyClient';
import { ttsService, generateSpeechAudio } from '../ttsService';
import { getTTSConfig } from '../config';

// Simple test runner
class SimpleTestRunner {
  private tests: Array<{ name: string; fn: () => Promise<void> }> = [];
  private passed = 0;
  private failed = 0;

  test(name: string, fn: () => Promise<void>) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running TTS Migration Tests...\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }
}

// Mock implementations for testing
const mockSpeechifyResponse = {
  audioData: 'mock-base64-audio-data',
  audioFormat: 'wav',
  speechMarks: null,
  billableCharactersCount: 50
};

const mockVoices = [
  {
    id: 'scott',
    displayName: 'Scott',
    gender: 'male',
    locale: 'en-US',
    models: [{ languages: [{ locale: 'en-US' }] }]
  }
];

// Mock the Speechify client
class MockSpeechifyClient {
  tts = {
    audio: {
      speech: async () => mockSpeechifyResponse
    },
    voices: {
      list: async () => mockVoices
    }
  };
}

// Override the SpeechifyClient for testing
const originalSpeechifyClient = require('@speechify/api').SpeechifyClient;
require('@speechify/api').SpeechifyClient = MockSpeechifyClient;

// Test suite
const runner = new SimpleTestRunner();

// Configuration Tests
runner.test('Configuration detects Speechify API key', async () => {
  const originalEnv = process.env.SPEECHIFY_API_KEY;
  process.env.SPEECHIFY_API_KEY = 'test-key';
  
  const config = getTTSConfig();
  
  if (config.speechifyApiKey !== 'test-key') {
    throw new Error('API key not detected correctly');
  }
  
  if (!config.useSpeechify) {
    throw new Error('useSpeechify should be true when key is available');
  }
  
  process.env.SPEECHIFY_API_KEY = originalEnv;
});

runner.test('Configuration falls back when no API key', async () => {
  const originalEnv = process.env.SPEECHIFY_API_KEY;
  delete process.env.SPEECHIFY_API_KEY;
  
  const config = getTTSConfig();
  
  if (config.speechifyApiKey !== undefined) {
    throw new Error('API key should be undefined');
  }
  
  if (config.useSpeechify) {
    throw new Error('useSpeechify should be false when no key');
  }
  
  process.env.SPEECHIFY_API_KEY = originalEnv;
});

// Speechify Provider Tests
runner.test('Speechify provider synthesizes speech', async () => {
  const provider = new SpeechifyTTSProvider('test-key');
  const result = await provider.synthesizeSpeech('Hello world');
  
  if (result.audioData !== mockSpeechifyResponse.audioData) {
    throw new Error('Audio data mismatch');
  }
  
  if (result.format !== mockSpeechifyResponse.audioFormat) {
    throw new Error('Format mismatch');
  }
});

runner.test('Speechify provider gets voices', async () => {
  const provider = new SpeechifyTTSProvider('test-key');
  const voices = await provider.getVoices();
  
  if (voices.length !== mockVoices.length) {
    throw new Error('Voice count mismatch');
  }
  
  if (voices[0].id !== mockVoices[0].id) {
    throw new Error('Voice ID mismatch');
  }
});

runner.test('Speechify provider backward compatibility', async () => {
  const provider = new SpeechifyTTSProvider('test-key');
  const result = await provider.generateSpeechAudio('Test narrative text');
  
  if (result !== mockSpeechifyResponse.audioData) {
    throw new Error('Backward compatibility failed');
  }
});

// Unified Service Tests
runner.test('TTS service is available', async () => {
  if (!ttsService.isAvailable()) {
    throw new Error('TTS service should be available');
  }
});

runner.test('TTS service generates speech', async () => {
  const result = await generateSpeechAudio('Test text');
  
  if (typeof result !== 'string') {
    throw new Error('Result should be a string');
  }
  
  if (result.length === 0) {
    throw new Error('Result should not be empty');
  }
});

runner.test('TTS service handles empty text', async () => {
  try {
    await generateSpeechAudio('');
    throw new Error('Should have thrown error for empty text');
  } catch (error) {
    if (!error.message.includes('empty')) {
      throw new Error('Wrong error message for empty text');
    }
  }
});

// Integration Tests
runner.test('Backward compatibility with existing code', async () => {
  const result = await generateSpeechAudio('Test narrative text');
  
  if (typeof result !== 'string') {
    throw new Error('Result should be a string');
  }
  
  if (result.length === 0) {
    throw new Error('Result should not be empty');
  }
});

// Run the tests
if (typeof window === 'undefined') {
  // Only run in Node.js environment
  runner.run().then(success => {
    if (success) {
      console.log('\n🎉 All tests passed! TTS migration is ready.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues.');
    }
    process.exit(success ? 0 : 1);
  });
}

// Export for manual testing
export { runner }; 