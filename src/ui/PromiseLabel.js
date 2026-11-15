import { categories } from '../data/categories.js';
import { dedication } from '../config/dedication.js';

export class PromiseLabel {
  constructor() {
    this.root = document.createElement('section');
    this.root.className = 'promise-label';
    this.root.hidden = true;
    this.root.innerHTML = `
      <span class="promise-label-kicker">Un regalo para tu corazón</span>
      <h2>${dedication.jarLabelTitle}</h2>
      <p>${dedication.jarLabelSubtitle}</p>
      <div class="promise-label-legend">
        ${categories.map(category => `
          <span><i style="--emotion:${category.color}"></i>${category.name}</span>
        `).join('')}
      </div>
    `;
    document.body.appendChild(this.root);
  }

  show({ fromBox = false } = {}) {
    this.root.hidden = false;
    this.root.classList.toggle('emerging-from-box', fromBox);
    requestAnimationFrame(() => this.root.classList.add('is-visible'));
  }
}
