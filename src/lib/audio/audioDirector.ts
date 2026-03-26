type Note = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

export class AudioDirector {
  private context: AudioContext | null = null;
  private loopHandle: number | null = null;
  private muted = false;
  private noteIndex = 0;

  setMuted(value: boolean): void {
    this.muted = value;
  }

  async ensureReady(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.context) {
      this.context = new window.AudioContext();
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  async playFlap(): Promise<void> {
    await this.play({ frequency: 420, duration: 0.06, type: "triangle", gain: 0.035 });
  }

  async playScore(): Promise<void> {
    await this.play({ frequency: 640, duration: 0.08, type: "square", gain: 0.04 });
  }

  async playCrash(): Promise<void> {
    await this.play({ frequency: 160, duration: 0.18, type: "sawtooth", gain: 0.05 });
  }

  async startLoop(): Promise<void> {
    await this.ensureReady();
    if (!this.context || this.loopHandle !== null) {
      return;
    }

    const pattern: Note[] = [
      { frequency: 220, duration: 0.18, type: "triangle", gain: 0.02 },
      { frequency: 262, duration: 0.18, type: "triangle", gain: 0.02 },
      { frequency: 294, duration: 0.18, type: "triangle", gain: 0.02 },
      { frequency: 262, duration: 0.18, type: "triangle", gain: 0.02 },
    ];

    this.loopHandle = window.setInterval(() => {
      const note = pattern[this.noteIndex % pattern.length];
      this.noteIndex += 1;
      void this.play(note);
    }, 520);
  }

  stopLoop(): void {
    if (this.loopHandle !== null) {
      window.clearInterval(this.loopHandle);
      this.loopHandle = null;
    }
  }

  private async play(note: Note): Promise<void> {
    if (this.muted) {
      return;
    }

    await this.ensureReady();
    if (!this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    oscillator.type = note.type ?? "triangle";
    oscillator.frequency.value = note.frequency;
    gainNode.gain.value = note.gain ?? 0.025;
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    const now = this.context.currentTime;
    oscillator.start(now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + note.duration);
    oscillator.stop(now + note.duration);
  }
}
