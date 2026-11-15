import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versesPath = path.resolve(__dirname, '../src/data/verses.json');

console.log('------------------------------------------------------------');
console.log('  VALIDADOR DE INTEGRIDAD BÍBLICA: FRASCO DE PROMESAS RVR1909');
console.log('------------------------------------------------------------\n');

if (!fs.existsSync(versesPath)) {
  console.error(`❌ Error crítico: No se encontró el archivo de versículos en: ${versesPath}`);
  process.exit(1);
}

let rawData = '';
try {
  rawData = fs.readFileSync(versesPath, 'utf8');
} catch (err) {
  console.error(`❌ Error al leer ${versesPath}:`, err.message);
  process.exit(1);
}

let verses = [];
try {
  verses = JSON.parse(rawData);
} catch (err) {
  console.error(`❌ Error de sintaxis JSON en ${versesPath}:`, err.message);
  process.exit(1);
}

if (!Array.isArray(verses)) {
  console.error(`❌ Error: El archivo verses.json debe contener un array en su raíz.`);
  process.exit(1);
}

const REQUIRED_CATEGORIES = ['feliz', 'agradecida', 'enfadada', 'ansiosa', 'solitaria', 'triste'];
const EXPECTED_PER_CATEGORY = 45;
const EXPECTED_TOTAL = REQUIRED_CATEGORIES.length * EXPECTED_PER_CATEGORY; // 270
const REQUIRED_FIELDS = ['id', 'category', 'book', 'chapter', 'verse', 'reference', 'text', 'version'];

const categoryCounts = {};
REQUIRED_CATEGORIES.forEach(cat => (categoryCounts[cat] = 0));

const seenIds = new Set();
const seenCitations = new Set();
const seenTexts = new Set();
const errors = [];

verses.forEach((item, index) => {
  const lineRef = `Ítem #${index + 1} (ID: ${item?.id || 'sin-id'})`;

  // 1. Campos obligatorios y esquema exacto
  const actualFields = Object.keys(item ?? {}).sort();
  const expectedFields = [...REQUIRED_FIELDS].sort();
  if (actualFields.join('|') !== expectedFields.join('|')) {
    errors.push(`${lineRef}: El esquema debe contener exactamente: ${REQUIRED_FIELDS.join(', ')}.`);
  }

  if (!item.id || typeof item.id !== 'string') {
    errors.push(`${lineRef}: Falta el campo 'id' válido.`);
  } else {
    if (seenIds.has(item.id)) {
      errors.push(`${lineRef}: ID duplicado '${item.id}'.`);
    }
    seenIds.add(item.id);
  }

  if (!item.category || !REQUIRED_CATEGORIES.includes(item.category)) {
    errors.push(`${lineRef}: Categoría inválida o ausente ('${item.category}'). Debe ser una de: ${REQUIRED_CATEGORIES.join(', ')}.`);
  } else {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  if (!item.book || typeof item.book !== 'string' || item.book.trim().length === 0) {
    errors.push(`${lineRef}: Campo 'book' vacío o inválido.`);
  }

  if (item.chapter === undefined || item.chapter === null || isNaN(Number(item.chapter))) {
    errors.push(`${lineRef}: Campo 'chapter' debe ser un número válido.`);
  }

  if (!item.verse || String(item.verse).trim().length === 0) {
    errors.push(`${lineRef}: Campo 'verse' vacío.`);
  }

  if (!item.reference || typeof item.reference !== 'string' || item.reference.trim().length === 0) {
    errors.push(`${lineRef}: Campo 'reference' vacío o inválido.`);
  }

  if (!item.text || typeof item.text !== 'string' || item.text.trim().length < 10) {
    errors.push(`${lineRef}: Campo 'text' demasiado corto o vacío (posible placeholder).`);
  } else if (item.text.includes('...')) {
    errors.push(`${lineRef}: Campo 'text' truncado; no se permiten puntos suspensivos.`);
  }

  if (item.version !== 'RVR1909') {
    errors.push(`${lineRef}: Versión bíblica inválida ('${item.version}'). Debe ser estrictamente 'RVR1909'.`);
  }

  // Comprobar citas duplicadas exactas
  const citationKey = `${item.book} ${item.chapter}:${item.verse}`.toLowerCase();
  if (seenCitations.has(citationKey)) {
    errors.push(`${lineRef}: Cita bíblica duplicada (${citationKey}).`);
  }
  seenCitations.add(citationKey);

  const textKey = item.text?.trim().toLowerCase();
  if (textKey && seenTexts.has(textKey)) {
    errors.push(`${lineRef}: Texto bíblico duplicado.`);
  }
  if (textKey) seenTexts.add(textKey);
});

// Resumen de distribución
console.log('📊 Distribución por categorías encontradas:');
REQUIRED_CATEGORIES.forEach(cat => {
  const count = categoryCounts[cat] || 0;
  const status = count >= EXPECTED_PER_CATEGORY ? '✅' : '⚠️ ';
  console.log(`   ${status} ${cat.padEnd(12)}: ${count} / ${EXPECTED_PER_CATEGORY}`);
});

console.log(`\n📌 Total de versículos cargados: ${verses.length} / ${EXPECTED_TOTAL} requeridos.\n`);

// Validaciones globales de cantidad
if (verses.length < EXPECTED_TOTAL) {
  errors.push(`Cantidad total insuficiente: se tienen ${verses.length} versículos, se requieren al menos ${EXPECTED_TOTAL}.`);
}

REQUIRED_CATEGORIES.forEach(cat => {
  if ((categoryCounts[cat] || 0) < EXPECTED_PER_CATEGORY) {
    errors.push(`Categoría '${cat}' incompleta: tiene ${categoryCounts[cat] || 0}, requiere ${EXPECTED_PER_CATEGORY}.`);
  }
});

if (errors.length > 0) {
  console.error(`❌ Se encontraron ${errors.length} problemas de validación:`);
  errors.slice(0, 20).forEach(err => console.error(`   - ${err}`));
  if (errors.length > 20) {
    console.error(`   ... y ${errors.length - 20} errores más.`);
  }
  console.log('\n❌ EL HARNESS DE VERSÍCULOS HA DETECTADO INCONSISTENCIAS.');
  process.exit(1);
}

console.log('✨ ¡ÉXITO! Todos los versículos cumplen las reglas estrictas de RVR1909 y arquitectura.');
process.exit(0);
