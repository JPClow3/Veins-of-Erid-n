import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SpeechifyClient } from '@speechify/api';
import { SpeechifyTTSProvider, initializeSpeechifyTTS, getSpeechifyTTS } from '../speechifyClient';
import { UnifiedTTSService } from '../ttsService';
import { getTTSConfig, validateTTSConfig } from '../config';

const mocks = vi.hoisted(() => ({ speech: vi.fn(), voices: vi.fn(), gemini: vi.fn() }));
vi.mock('@speechify/api', () => ({ SpeechifyClient: vi.fn(function () {
  return { tts: { audio: { speech: mocks.speech }, voices: { list: mocks.voices } } };
}) }));
vi.mock('../../features/game/gameService', () => ({ generateSpeechAudio: mocks.gemini }));

describe('offline TTS provider contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('SPEECHIFY_API_KEY', '');
    mocks.speech.mockImplementation(async (input) => ({ audioData: 'speechify-audio', audioFormat: input.audioFormat, billableCharactersCount: 50 }));
    mocks.voices.mockResolvedValue([{ id: 'scott', displayName: 'Scott', locale: 'en-US', gender: 'male' }]);
    mocks.gemini.mockResolvedValue('gemini-audio');
  });
  afterEach(() => vi.unstubAllEnvs());
  it('uses Gemini without a Speechify key', () => expect(new UnifiedTTSService().getProviderName()).toBe('gemini'));
  it('detects a configured Speechify key', () => {
    vi.stubEnv('SPEECHIFY_API_KEY', 'fixture-key');
    expect(getTTSConfig()).toMatchObject({ useSpeechify: true, speechifyApiKey: 'fixture-key' });
  });
  it('rejects Speechify configuration without a key', () => expect(validateTTSConfig({useSpeechify:true, fallbackToGemini:false}).isValid).toBe(false));
  it('creates the SDK client with its token', () => {
    new SpeechifyTTSProvider('fixture-key');
    expect(SpeechifyClient).toHaveBeenCalledWith({ token: 'fixture-key' });
  });
  it('returns audio and billing metadata', async () => expect(await new SpeechifyTTSProvider('fixture').synthesizeSpeech('hello')).toMatchObject({ audioData:'speechify-audio', format:'wav', billableCharactersCount:50 }));
  it('forwards voice and format options', async () => {
    expect((await new SpeechifyTTSProvider('fixture').synthesizeSpeech('hello', { voice:'sarah', format:'mp3', language:'en' })).format).toBe('mp3');
    expect(mocks.speech).toHaveBeenCalledWith(expect.objectContaining({voiceId:'sarah',audioFormat:'mp3',model:'simba-english'}));
  });
  it.each(['en','en-US'])('selects the English model for %s', async (language) => {
    await new SpeechifyTTSProvider('fixture').synthesizeSpeech('hello',{language});
    expect(mocks.speech.mock.calls[0][0].model).toBe('simba-english');
  });
  it.each(['pt-BR','es',undefined])('selects the multilingual model for %s', async (language) => {
    await new SpeechifyTTSProvider('fixture').synthesizeSpeech('hello',{language});
    expect(mocks.speech.mock.calls[0][0].model).toBe('simba-multilingual');
  });
  it('maps provider voices', async () => expect(await new SpeechifyTTSProvider('fixture').getVoices()).toEqual([{id:'scott',name:'Scott',language:'en-US',gender:'male'}]));
  it('propagates voice-list failures', async () => {
    mocks.voices.mockRejectedValue(new Error('unavailable'));
    await expect(new SpeechifyTTSProvider('fixture').getVoices()).rejects.toThrow('unavailable');
  });
  it('preserves the narrative audio interface', async () => {
    expect(await new SpeechifyTTSProvider('fixture').generateSpeechAudio('Story')).toBe('speechify-audio');
    expect(mocks.speech.mock.calls[0][0].input).toContain('Story');
  });
  it('retains an initialized provider', () => expect(getSpeechifyTTS()).toBe(initializeSpeechifyTTS('fixture')));
  it('rejects empty text before contacting providers', async () => {
    await expect(new UnifiedTTSService().generateSpeechAudio('  ')).rejects.toThrow('Text cannot be empty');
    expect(mocks.gemini).not.toHaveBeenCalled(); expect(mocks.speech).not.toHaveBeenCalled();
  });
  it('uses Gemini and preserves its result', async () => expect(await new UnifiedTTSService().generateSpeechAudio('Story')).toBe('gemini-audio'));
  it('propagates Gemini failures', async () => {
    mocks.gemini.mockRejectedValue(new Error('Gemini unavailable'));
    await expect(new UnifiedTTSService().generateSpeechAudio('Story')).rejects.toThrow('Gemini unavailable');
  });
  it('uses Speechify when configured', async () => {
    vi.stubEnv('SPEECHIFY_API_KEY','fixture');
    expect(await new UnifiedTTSService().generateSpeechAudio('Story')).toBe('speechify-audio');
    expect(mocks.gemini).not.toHaveBeenCalled();
  });
  it('falls back after a Speechify failure', async () => {
    vi.stubEnv('SPEECHIFY_API_KEY','fixture'); mocks.speech.mockRejectedValue(new Error('provider unavailable'));
    expect(await new UnifiedTTSService().generateSpeechAudio('Story')).toBe('gemini-audio');
    expect(mocks.gemini).toHaveBeenCalledWith('Story');
  });
  it('reports fallback failure to the caller', async () => {
    vi.stubEnv('SPEECHIFY_API_KEY','fixture'); mocks.speech.mockRejectedValue(new Error('primary unavailable')); mocks.gemini.mockRejectedValue(new Error('fallback unavailable'));
    await expect(new UnifiedTTSService().generateSpeechAudio('Story')).rejects.toThrow('fallback unavailable');
  });
  it('switches providers explicitly', async () => {
    const service=new UnifiedTTSService(); vi.stubEnv('SPEECHIFY_API_KEY','fixture');
    await service.switchToProvider('speechify'); expect(service.getProviderName()).toBe('speechify');
    await service.switchToProvider('gemini'); expect(service.getProviderName()).toBe('gemini'); expect(service.isAvailable()).toBe(true);
  });
});
