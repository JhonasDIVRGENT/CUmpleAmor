import { dedication } from '../config/dedication.js';

export function createDedicationOverlay() {
  const overlay = document.createElement('section');
  overlay.className = 'dedication-overlay';
  overlay.innerHTML = `
    <div class="dedication-card">
      <span class="eyebrow">${dedication.introBadge}</span>
      <h1>${dedication.introTitle}</h1>
      <h2 class="dedication-subtitle">${dedication.introSubtitle}</h2>
      <p>${dedication.introMessage}</p>
      <button class="primary-button" type="button" data-open>${dedication.introButtonText}</button>
      <small>${dedication.signature}</small>
    </div>
  `;
  document.body.appendChild(overlay);
  const card = overlay.querySelector('.dedication-card');
  requestAnimationFrame(() => {
    card.scrollTop = 0;
  });
  return overlay;
}
