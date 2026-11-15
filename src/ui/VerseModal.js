import { categories } from '../data/categories.js';

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, character => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[character]));
}

function wrapText(text, maxLength = 54) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach(word => {
    if ((line + ' ' + word).trim().length > maxLength) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  });
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export class VerseModal {
  constructor({ onAgain, onClose }) {
    this.onAgain = onAgain;
    this.onClose = onClose;
    this.root = document.createElement('div');
    this.root.className = 'verse-modal-shell';
    this.root.hidden = true;
    document.body.appendChild(this.root);
  }

  show(verse, categoryId) {
    const category = categories.find(item => item.id === categoryId);
    this.root.innerHTML = `
      <article class="verse-modal" style="--accent:${category.color}">
        <button class="icon-button close-verse" aria-label="Cerrar tarjeta">×</button>
        <div class="verse-seal"><span>${category.name}</span></div>
        <p class="verse-kicker">Para cuando te sientas ${category.name.toLowerCase()}</p>
        <div class="ornament-divider">✦</div>
        <p class="verse-text">“${verse.text}”</p>
        <p class="verse-reference">${verse.reference}</p>
        <div class="modal-actions">
          <button class="secondary-button again-verse">Sacar otro de este color</button>
          <button class="secondary-button copy-verse">Copiar cita</button>
          <button class="secondary-button download-verse">Descargar imagen</button>
        </div>
      </article>
    `;
    this.root.hidden = false;
    document.body.style.setProperty('--reading-glow', category.color);
    document.body.classList.add('is-reading');
    this.root.querySelector('.close-verse').onclick = () => this.onClose();
    this.root.querySelector('.again-verse').onclick = () => {
      this.root.hidden = true;
      this.onAgain(categoryId);
    };
    this.root.querySelector('.download-verse').onclick = () => this.downloadImage(verse, category);
    this.root.querySelector('.copy-verse').onclick = async event => {
      await navigator.clipboard?.writeText(`${verse.text} — ${verse.reference}`);
      event.currentTarget.textContent = '✓ Copiada';
    };
  }

  downloadImage(verse, category) {
    const lines = wrapText(verse.text, 68);
    const fontSize = lines.length > 14 ? 28 : lines.length > 10 ? 32 : 38;
    const lineHeight = fontSize + 12;
    const verseLines = lines.map((line, index) =>
      `<text x="800" y="${390 + index * lineHeight}" class="verse">${escapeXml(line)}</text>`).join('');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
        <defs>
          <pattern id="paper" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#FFFDF9"/>
            <circle cx="3" cy="5" r="0.8" fill="#D9C7A8" opacity=".18"/>
            <circle cx="11" cy="10" r="0.6" fill="#C9A24B" opacity=".12"/>
          </pattern>
        </defs>
        <rect width="1600" height="1000" fill="#F2E4D3"/>
        <rect x="110" y="70" width="1380" height="860" rx="8" fill="url(#paper)" stroke="#C9A24B" stroke-width="3"/>
        <rect x="132" y="92" width="1336" height="816" rx="5" fill="none" stroke="#C9A24B" stroke-opacity=".48"/>
        <circle cx="800" cy="210" r="54" fill="none" stroke="${category.color}" stroke-width="4"/>
        <text x="800" y="218" text-anchor="middle" class="category">${escapeXml(category.name)}</text>
        <text x="800" y="305" text-anchor="middle" class="kicker">PARA CUANDO TE SIENTAS ${escapeXml(category.name.toUpperCase())}</text>
        ${verseLines}
        <text x="800" y="${440 + lines.length * lineHeight}" text-anchor="middle" class="reference">${escapeXml(verse.reference)}</text>
        <text x="800" y="830" text-anchor="middle" class="footer">Un momento de calma para tu fe</text>
        <style>
          .category { font: 600 22px Georgia, serif; fill: ${category.color}; }
          .kicker { font: 600 18px Arial, sans-serif; letter-spacing: 4px; fill: #A27A3A; }
          .verse { font: 500 ${fontSize}px Georgia, serif; text-anchor: middle; fill: #574631; }
          .reference { font: 600 24px Arial, sans-serif; letter-spacing: 2px; fill: #8C6A23; }
          .footer { font: italic 24px Georgia, serif; fill: #A08357; }
        </style>
      </svg>`;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const link = document.createElement('a');
      link.download = `tarjeta-${category.id}-${verse.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  hide() {
    this.root.hidden = true;
    document.body.classList.remove('is-reading');
  }
}
