import gsap from 'gsap';

export class AudioManager {
  constructor(path) {
    this.audio = new Audio(path);
    this.audio.loop = true;
    this.audio.preload = 'none';
    this.audio.volume = 0;
    this.available = true;
    this.missingFile = false;
    this.onStateChange = null;
    this.context = null;
    this.fallbackGain = null;
    this.playing = false;
    this.audio.addEventListener('error', () => {
      this.available = false;
      this.missingFile = true;
      this.onStateChange?.({ playing: false, unavailable: true });
    });
  }

  async play() {
    if (!this.available) {
      this.startAmbientFallback();
      this.playing = true;
      this.onStateChange?.({ playing: true, unavailable: true });
      return true;
    }
    try {
      await this.audio.play();
      gsap.to(this.audio, { volume: 0.45, duration: 2.5, ease: 'power2.out' });
      this.playing = true;
      this.onStateChange?.({ playing: true, unavailable: false });
      return true;
    } catch {
      this.available = false;
      this.missingFile = true;
      this.startAmbientFallback();
      this.playing = true;
      this.onStateChange?.({ playing: true, unavailable: true });
      return true;
    }
  }

  pause() {
    if (this.fallbackGain) {
      this.fallbackGain.gain.exponentialRampToValueAtTime(0.0001, (this.context?.currentTime || 0) + 0.5);
      this.fallbackGain = null;
    }
    this.audio.pause();
    this.playing = false;
    this.onStateChange?.({ playing: false, unavailable: false });
  }

  async toggle() {
    if (!this.playing) return this.play();
    this.pause();
    return false;
  }

  startAmbientFallback() {
    this.context ??= new AudioContext();
    const now = this.context.currentTime;
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 2.5);
    gain.connect(this.context.destination);
    [261.63, 329.63, 392].forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 3;
      oscillator.connect(gain);
      oscillator.start();
      oscillator.stop(now + 3600);
    });
    this.fallbackGain = gain;
  }
}
