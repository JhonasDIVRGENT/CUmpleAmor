export const STATES = {
  INTRO_DEDICATION: 'INTRO_DEDICATION',
  GIFT_BOX_CLOSED: 'GIFT_BOX_CLOSED',
  BOX_OPENING: 'BOX_OPENING',
  BOX_READY: 'BOX_READY',
  UNBOXING_REVEAL: 'UNBOXING_REVEAL',
  JAR_INTERACTIVE: 'JAR_INTERACTIVE',
  VERSE_EXTRACTION: 'VERSE_EXTRACTION',
  VERSE_READING: 'VERSE_READING',
};

export class ExperienceStore {
  constructor() {
    this.state = STATES.INTRO_DEDICATION;
    this.isAnimating = false;
    this.sceneReady = false;
    this.listeners = new Set();
  }

  setSceneReady(ready = true) {
    this.sceneReady = ready;
    console.info('[experience-scene]', {
      sceneReady: ready,
      state: this.state,
      time: performance.now().toFixed(1),
    });
  }

  setState(state, payload = {}) {
    const previousState = this.state;
    this.state = state;
    this.isAnimating = state === STATES.BOX_OPENING
      || state === STATES.UNBOXING_REVEAL
      || state === STATES.VERSE_EXTRACTION;
    if (state === STATES.BOX_READY
      || state === STATES.JAR_INTERACTIVE
      || state === STATES.VERSE_READING
      || state === STATES.GIFT_BOX_CLOSED) {
      this.isAnimating = false;
    }
    console.info('[experience-state]', {
      previousState,
      state,
      sceneReady: this.sceneReady,
      isAnimating: this.isAnimating,
      payload,
      time: performance.now().toFixed(1),
    });
    this.listeners.forEach(listener => listener(state, payload));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
