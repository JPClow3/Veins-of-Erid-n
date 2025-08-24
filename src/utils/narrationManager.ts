// A centralized utility for handling Gemini-powered Text-to-Speech.

import { generateSpeechAudio } from '../features/game/gameService';
import { base64ToBlobUrl } from './imageUtils';
import logger from './logger';

class NarrationManager {
  private audio: HTMLAudioElement;
  private currentBlobUrl: string | null = null;
  private isSpeaking = false;

  constructor() {
    this.audio = new Audio();
    this.audio.onplay = () => { this.isSpeaking = true; };
    this.audio.onended = () => { this.isSpeaking = false; this.cleanup(); };
    this.audio.onpause = () => { this.isSpeaking = false; }; // Also reset on manual stop
  }

  private cleanup() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }

  async speak(text: string) {
    if (!text.trim()) return;

    this.stop(); // Stop any currently playing audio and clean up old blob

    try {
      const base64Audio = await generateSpeechAudio(text);
      if (base64Audio) {
        // The output from the API is WAV PCM data.
        this.currentBlobUrl = base64ToBlobUrl(base64Audio, 'audio/wav');
        this.audio.src = this.currentBlobUrl;
        this.audio.play().catch(e => {
          // This can happen if a new request comes in before the previous one finished loading
          if (e instanceof DOMException && e.name === 'AbortError') {
             logger.info('Audio playback was aborted, likely by a new narration request.');
          } else {
             logger.error('Audio playback failed', { error: e });
          }
          this.cleanup();
        });
      }
    } catch (error) {
      logger.error('Failed to generate or play speech audio', { error });
    }
  }

  stop() {
    if (this.isSpeaking || !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0; // Reset for next play
    }
    // Clean up any existing source to prevent it from playing later
    this.audio.src = ''; 
    this.cleanup();
  }
}

export const narrationManager = new NarrationManager();