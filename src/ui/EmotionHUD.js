import { categories } from '../data/categories.js';

export class EmotionHUD {
  constructor({ onPick, audioManager, onReturn }) {
    this.audioManager = audioManager;
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <div class="hud-top">
        <button class="glass-button audio-button" title="Activar música">♫ Música</button>
        <button class="glass-button return-button">↶ Volver al inicio</button>
      </div>
      <div class="emotion-dock">
        <div class="emotion-heading">
          <strong>LÉEME CUANDO SIENTAS...</strong>
          <span>Un pequeño recordatorio de amor para cada momento.</span>
        </div>
        ${categories.map(category => `
          <button class="emotion-button" data-category="${category.id}" style="--emotion:${category.color}">
            <span class="emotion-dot"></span><span>${category.name}</span>
          </button>`).join('')}

      </div>
    `;
    document.body.appendChild(this.root);
    this.root.querySelectorAll('[data-category]').forEach(button => {
      button.onclick = () => onPick(button.dataset.category);
    });
    this.audioButton = this.root.querySelector('.audio-button');
    this.root.querySelector('.return-button').onclick = () => onReturn();
    this.audioButton.onclick = async () => {
      const playing = await this.audioManager.toggle();
      this.audioButton.textContent = playing ? 'Ⅱ Música' : '♫ Música';
      if (this.audioManager.missingFile) this.audioButton.title = 'Añade public/audio/music.mp3 para escuchar la música.';
    };
  }

  show() {
    this.root.classList.add('is-visible');
  }
}
