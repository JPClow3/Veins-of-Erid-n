// A centralized utility for managing all game audio.
import logger from './logger';

const SOUND_ASSETS = {
  // Sound Effects (one-shot)
  sword_clash: 'https://assets.codepen.io/217233/sword-clash.mp3',
  magic_chime: 'https://assets.codepen.io/217233/magic-chime.mp3',

  // Ambient Tracks (looping)
  rainstorm: 'https://assets.codepen.io/217233/rain-loop.mp3',
  distant_city: 'https://assets.codepen.io/217233/distant-city.mp3',
  forest_ambience: 'https://assets.codepen.io/217233/forest-ambience.mp3',
  tense_drone: 'https://assets.codepen.io/217233/tense-drone.mp3',
  royal_court: 'https://assets.codepen.io/217233/eridun-ambience.mp3', // Reusing for court
};

type SoundName = keyof typeof SOUND_ASSETS;

class AudioManager {
  private ambientPlayer: HTMLAudioElement;
  private sfxPool: HTMLAudioElement[] = [];
  private MAX_SFX_POOL_SIZE = 5;
  private isMuted = true;
  private currentAmbientTrack: SoundName | null = null;
  private fadeInterval: number | null = null;

  constructor() {
    this.ambientPlayer = new Audio();
    this.ambientPlayer.loop = true;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    this.ambientPlayer.muted = muted;
    this.sfxPool.forEach(player => player.muted = muted);
    if (!muted && this.currentAmbientTrack && this.ambientPlayer.paused) {
      this.ambientPlayer.play().catch(e => logger.warn('Audio play interrupted', { error: e }));
    }
  }

  playSoundEffect(name: string) {
    if (this.isMuted || !(name in SOUND_ASSETS)) return;

    let player = this.sfxPool.find(p => p.paused);
    if (!player) {
      if (this.sfxPool.length < this.MAX_SFX_POOL_SIZE) {
        player = new Audio();
        player.muted = this.isMuted;
        this.sfxPool.push(player);
      } else {
        // Reuse the oldest player
        player = this.sfxPool.shift()!;
        this.sfxPool.push(player);
      }
    }
    
    player.src = SOUND_ASSETS[name as SoundName];
    player.volume = 0.4;
    player.play().catch(e => logger.error(`Error playing sound effect: ${name}`, { error: e }));
  }

  setAmbientTrack(name: string) {
    if (!(name in SOUND_ASSETS) || name === this.currentAmbientTrack) return;

    this.currentAmbientTrack = name as SoundName;
    const newSrc = SOUND_ASSETS[name as SoundName];

    if (this.fadeInterval) clearInterval(this.fadeInterval);
    
    const fadeOut = () => {
        if (this.ambientPlayer.volume > 0.1) {
            this.ambientPlayer.volume -= 0.1;
        } else {
            this.ambientPlayer.pause();
            this.ambientPlayer.volume = 0; // Ensure it's silent
            clearInterval(this.fadeInterval!);
            this.ambientPlayer.src = newSrc;
            if (!this.isMuted) {
                this.ambientPlayer.play().catch(e => logger.warn('Audio play interrupted', { error: e }));
                this.fadeInterval = window.setInterval(fadeIn, 100);
            }
        }
    };
    
    const fadeIn = () => {
        if (this.ambientPlayer.volume < 0.5) { // Ambient volume max
            this.ambientPlayer.volume += 0.1;
        } else {
            this.ambientPlayer.volume = 0.5;
            clearInterval(this.fadeInterval!);
        }
    };
    
    if (this.ambientPlayer.src && !this.ambientPlayer.paused) {
        this.fadeInterval = window.setInterval(fadeOut, 100);
    } else {
        this.ambientPlayer.src = newSrc;
        this.ambientPlayer.volume = 0;
        if (!this.isMuted) {
            this.ambientPlayer.play().catch(e => logger.warn('Audio play interrupted', { error: e }));
            this.fadeInterval = window.setInterval(fadeIn, 100);
        }
    }
  }
  
  stopAll() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.ambientPlayer.pause();
    this.sfxPool.forEach(p => p.pause());
    this.currentAmbientTrack = null;
  }
}

export const audioManager = new AudioManager();
