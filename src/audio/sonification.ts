import type { MonthlyObservation } from '../data/gistemp';

export const MIN_ANOMALY = -1;
export const MAX_ANOMALY = 1.5;
export const MIN_FREQUENCY = 220;
export const MAX_FREQUENCY = 660;

export function anomalyToFrequency(anomaly: number) {
  const clamped = Math.min(MAX_ANOMALY, Math.max(MIN_ANOMALY, anomaly));
  return MIN_FREQUENCY + ((clamped - MIN_ANOMALY) / (MAX_ANOMALY - MIN_ANOMALY)) * (MAX_FREQUENCY - MIN_FREQUENCY);
}

export class SonificationEngine {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  async start(observation: MonthlyObservation, volume: number) {
    this.context ??= new AudioContext();
    await this.context.resume();
    this.stopNodes();
    const now = this.context.currentTime;
    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(anomalyToFrequency(observation.anomaly), now);
    this.gain.gain.setValueAtTime(0.0001, now);
    this.gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.08), now + 0.04);
    this.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
    this.oscillator.connect(this.gain).connect(this.context.destination);
    this.oscillator.start(now);
    this.oscillator.stop(now + 0.86);
  }

  setVolume(volume: number) {
    if (!this.gain || !this.context) return;
    this.gain.gain.setTargetAtTime(Math.max(0.0001, volume * 0.08), this.context.currentTime, 0.03);
  }

  stop() {
    this.stopNodes();
  }

  dispose() {
    this.stopNodes();
    void this.context?.close();
    this.context = null;
  }

  private stopNodes() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch {
        // An already-ended oscillator is safe to discard.
      }
      this.oscillator.disconnect();
    }
    this.gain?.disconnect();
    this.oscillator = null;
    this.gain = null;
  }
}

