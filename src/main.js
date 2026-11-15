import './styles.css';
import gsap from 'gsap';
import * as THREE from 'three';
import verses from './data/verses.json';
import { dedication } from './config/dedication.js';
import { AudioManager } from './audio/audioManager.js';
import { ExperienceStore, STATES } from './state/experienceStore.js';
import { readingHistory } from './state/readingHistory.js';
import { createDedicationOverlay } from './ui/DedicationOverlay.js';
import { EmotionHUD } from './ui/EmotionHUD.js';
import { VerseModal } from './ui/VerseModal.js';
import { PromiseLabel } from './ui/PromiseLabel.js';
import { SceneManager } from './three/SceneManager.js';
import { GiftBox } from './three/objects/GiftBox.js';

const markDomContentLoaded = () => {
  performance.mark('app:dom-content-loaded');
  performance.mark('dom-ready');
};

const markAnimationEvent = name => {
  performance.mark(name);
  console.info(`[animation] ${name}`, {
    time: performance.now().toFixed(1),
    state: store?.state,
  });
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', markDomContentLoaded, { once: true });
} else {
  markDomContentLoaded();
}

const app = document.querySelector('#app');
performance.mark('scene-init-start');
const sceneManager = new SceneManager(app);
performance.mark('scene-created');
const store = new ExperienceStore();
const audioManager = new AudioManager(dedication.audioPath);
const giftBox = new GiftBox();
performance.mark('giftbox-created');
performance.measure('scene-init-to-giftbox', 'scene-init-start', 'giftbox-created');
performance.measure('scene-init-to-renderer', 'scene-init-start', 'renderer-created');
performance.measure('scene-init-to-scene', 'scene-init-start', 'scene-created');
const overlay = createDedicationOverlay();
const label = new PromiseLabel();
const ribbonHint = document.createElement('div');
ribbonHint.className = 'ribbon-hint';
ribbonHint.textContent = 'Presiona el listón dorado para abrir la caja';
document.body.appendChild(ribbonHint);
performance.mark('app:dom-mounted');
requestAnimationFrame(() => performance.mark('app:first-visible'));

const emotionEffects = {
  feliz: { color: '#F2C14E', glyph: '✦', motion: 'spark' },
  agradecida: { color: '#F2849E', glyph: '✿', motion: 'petal' },
  enfadada: { color: '#E56B6F', glyph: '◌', motion: 'wave' },
  ansiosa: { color: '#6AB08A', glyph: '❧', motion: 'leaf' },
  solitaria: { color: '#9D81BA', glyph: '✧', motion: 'star' },
  triste: { color: '#5FA8D3', glyph: '•', motion: 'drop' },
};

function playEmotionEffect(categoryId) {
  document.querySelectorAll('.emotion-effect').forEach(element => element.remove());
  const effect = emotionEffects[categoryId];
  if (!effect) return;
  const root = document.createElement('div');
  root.className = `emotion-effect emotion-effect-${effect.motion}`;
  root.innerHTML = Array.from({ length: 18 }, (_, index) =>
    `<span style="--i:${index};--color:${effect.color}">${effect.glyph}</span>`).join('');
  document.body.appendChild(root);
  const particles = [...root.children];
  gsap.fromTo(root, { autoAlpha: 1 }, {
    autoAlpha: 0,
    duration: 2.2,
    ease: 'power1.out',
    onComplete: () => root.remove(),
  });
  particles.forEach((particle, index) => {
    gsap.fromTo(particle,
      { x: 0, y: 25, scale: .35, rotation: 0 },
      {
        x: (index - 9) * (categoryId === 'enfadada' ? 13 : 9),
        y: -110 - (index % 5) * 32,
        scale: .8 + (index % 3) * .18,
        rotation: (index % 2 ? 1 : -1) * (25 + index * 6),
        duration: 1.3 + (index % 5) * .1,
        delay: (index % 6) * .025,
        ease: categoryId === 'ansiosa' ? 'sine.inOut' : 'power2.out',
      });
  });
}

const pickVerse = categoryId => {
  console.info('[interaction] emotion-selected', {
    categoryId,
    state: store.state,
    time: performance.now().toFixed(1),
  });
  const options = verses.filter(verse => verse.category === categoryId);
  const readIds = new Set(readingHistory.getRead());
  const unread = options.filter(verse => !readIds.has(verse.id));
  const pool = unread.length ? unread : options;
  const verse = pool[Math.floor(Math.random() * pool.length)];
  if (!verse) return;
  readingHistory.remember(verse.id);
  playEmotionEffect(categoryId);
  console.info('[interaction] verse-selected', {
    categoryId,
    verseId: verse.id,
    state: store.state,
    time: performance.now().toFixed(1),
  });
  store.setState(STATES.VERSE_READING, { categoryId, verse });
  modal.show(verse, categoryId);
};

const modal = new VerseModal({
  onAgain: categoryId => pickVerse(categoryId),
  onClose: () => {
    modal.hide();
    store.setState(STATES.JAR_INTERACTIVE);
  },
});

const hud = new EmotionHUD({
  audioManager,
  onPick: pickVerse,
  onReturn: () => window.location.reload(),
});

sceneManager.scene.add(giftBox.group);
performance.mark('giftbox-added');
performance.mark('giftBoxAdded');
window.dispatchEvent(new CustomEvent('scene:giftbox-added'));
sceneManager.start();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const openButton = overlay.querySelector('[data-open]');
let isOpeningExperience = false;
let isOpeningBox = false;
performance.mark('app:first-interaction-available');

addEventListener('scene:ready', () => store.setSceneReady());

openButton.addEventListener('click', () => {
  if (isOpeningExperience) return;
  isOpeningExperience = true;
  performance.mark('app:interaction');
  performance.mark('first-user-interaction');
  markAnimationEvent('INTRO_CLICK');
  openButton.disabled = true;
  openButton.setAttribute('aria-busy', 'true');
  overlay.style.pointerEvents = 'none';
  store.setState(STATES.GIFT_BOX_CLOSED);
  void audioManager.play()
    .then(() => markAnimationEvent('AUDIO_STARTED'))
    .catch(error => console.error('No se pudo iniciar el audio de la experiencia.', error));
  gsap.to(overlay, {
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete: () => {
      overlay.remove();
      ribbonHint.classList.add('is-visible');
      markAnimationEvent('INTRO_HIDDEN');
    },
  });
});

function startBoxOpening() {
  if (isOpeningBox || (store.state !== STATES.INTRO_DEDICATION && store.state !== STATES.GIFT_BOX_CLOSED)) return;
  isOpeningBox = true;
  store.setState(STATES.BOX_OPENING);
  markAnimationEvent('BOX_OPENING_STARTED');
  const timeline = gsap.timeline({
    onStart: () => markAnimationEvent('LID_ANIMATION_STARTED'),
    onComplete: () => {
      markAnimationEvent('LID_ANIMATION_COMPLETED');
      store.setState(STATES.BOX_READY);
      markAnimationEvent('BOX_STATE_READY');
      label.show({ fromBox: true });
      hud.show();
      markAnimationEvent('EMOTION_HUD_VISIBLE');
      isOpeningBox = false;
    },
    onInterrupt: () => {
      console.error('[animation] Box opening interrupted');
    },
  });
  timeline
    .to(giftBox.ribbon.scale, { x: 1.08, y: 0.08, duration: 0.5, ease: 'power2.out' })
    .to(giftBox.open().position, { y: '+=0.18', duration: 0.25, ease: 'power2.out' })
    .to(giftBox.open().rotation, { x: -Math.PI * 0.58, duration: 1.1, ease: 'power3.inOut' })
    .to(giftBox.group.position, { y: -0.72, duration: 0.75, ease: 'power2.inOut' });
}

sceneManager.renderer.domElement.addEventListener('click', event => {
  if (store.state !== STATES.GIFT_BOX_CLOSED || isOpeningBox) return;
  const canvas = sceneManager.renderer.domElement;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, sceneManager.camera);
  const ribbonHit = raycaster.intersectObject(giftBox.ribbon, true)[0];
  if (!ribbonHit) return;
  ribbonHint.classList.remove('is-visible');
  performance.mark('app:transition-start');
  performance.measure('app:click-to-transition', 'app:interaction', 'app:transition-start');
  startBoxOpening();
});

store.subscribe(state => {
  console.info('[ui-state-sync]', {
    state,
    overlayVisible: document.body.contains(overlay),
    hudVisible: hud.root.classList.contains('is-visible'),
    time: performance.now().toFixed(1),
  });
  if (state === STATES.VERSE_READING) hud.root.classList.add('is-visible');
});
