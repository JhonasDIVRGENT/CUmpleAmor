import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'src', 'data', 'verses.json');
const sourceUrl = 'https://raw.githubusercontent.com/Amosamevor/Bible-json/main/versions/es/REINA%20VALERA%201909.json';

const profiles = [
  {
    id: 'feliz',
    books: ['Salmos', 'Proverbios', 'Filipenses', 'Nehemías', 'Isaías', 'Juan'],
    terms: ['alegr', 'gozo', 'goz[aá]os', 'regocij', 'cantar', 'alab', 'bienaventur', 'júbilo', 'fiesta', 'content'],
  },
  {
    id: 'agradecida',
    books: ['Salmos', 'Colosenses', 'Efesios', 'Filipenses', '1 Tesalonicenses', '2 Corintios', 'Deuteronomio'],
    terms: ['graci', 'agradec', 'bendec', 'alab', 'misericord', 'bondad', 'beneficio', 'content', 'dádiva', 'don'],
  },
  {
    id: 'enfadada',
    books: ['Proverbios', 'Santiago', 'Efesios', 'Romanos', 'Mateo', 'Colosenses', '1 Pedro'],
    terms: ['ira', 'enojo', 'furor', 'mansedumbr', 'pacien', 'perdon', 'perdón', 'benign', 'contiend', 'lengua'],
  },
  {
    id: 'ansiosa',
    books: ['Salmos', 'Mateo', 'Filipenses', '1 Pedro', 'Isaías', 'Juan', 'Hebreos'],
    terms: ['afán', 'afan', 'ansios', 'temor', 'paz', 'confia', 'descans', 'cuidado', 'socorro', 'no temas'],
  },
  {
    id: 'solitaria',
    books: ['Salmos', 'Isaías', 'Deuteronomio', 'Josué', 'Mateo', 'Romanos', 'Hebreos', 'Juan'],
    terms: ['contigo', 'nunca', 'solo', 'huérfan', 'presencia', 'amparo', 'refugio', 'ayuda', 'cerca', 'compañ'],
  },
  {
    id: 'triste',
    books: ['Salmos', 'Isaías', 'Mateo', '2 Corintios', 'Juan', 'Apocalipsis', 'Jeremías'],
    terms: ['trist', 'llor', 'consuel', 'quebrant', 'aflig', 'esperan', 'gozo', 'sanar', 'enjugar', 'restaur'],
  },
];

const clean = value => String(value).replace(/\s+/g, ' ').trim();

function flattenBible(bible) {
  return Object.entries(bible).flatMap(([book, chapters]) =>
    Object.entries(chapters).flatMap(([chapter, verses]) =>
      Object.entries(verses).map(([verse, text]) => ({
        book,
        chapter: Number(chapter),
        verse,
        text: clean(text),
        reference: `${book} ${chapter}:${verse}`,
      })),
    ),
  );
}

function scoreVerse(verse, profile) {
  if (!profile.books.includes(verse.book)) return -1;
  const lowerText = verse.text.toLocaleLowerCase('es');
  const termScore = profile.terms.reduce(
    (score, term) => score + (new RegExp(term, 'iu').test(lowerText) ? 10 : 0),
    0,
  );
  return termScore;
}

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`No se pudo descargar la fuente RVR1909 (${response.status} ${response.statusText}).`);
}

const bible = await response.json();
const allVerses = flattenBible(bible);
const usedReferences = new Set();
const usedTexts = new Set();
const selected = [];

for (const profile of profiles) {
  const candidates = allVerses
    .map(verse => ({ verse, score: scoreVerse(verse, profile) }))
    .filter(({ score, verse }) =>
      score > 0 &&
      !usedReferences.has(verse.reference) &&
      !usedTexts.has(verse.text.toLocaleLowerCase('es')),
    )
    .sort((a, b) => b.score - a.score || a.verse.reference.localeCompare(b.verse.reference, 'es'));

  if (candidates.length < 45) {
    throw new Error(`La selección temática para '${profile.id}' solo encontró ${candidates.length} citas.`);
  }

  const categoryVerses = [];
  for (const { verse } of candidates) {
    const textKey = verse.text.toLocaleLowerCase('es');
    if (usedTexts.has(textKey)) continue;
    categoryVerses.push(verse);
    usedReferences.add(verse.reference);
    usedTexts.add(textKey);
    if (categoryVerses.length === 45) break;
  }

  if (categoryVerses.length < 45) {
    throw new Error(`La selección temática para '${profile.id}' no tiene 45 textos únicos.`);
  }

  categoryVerses.forEach((verse, index) => {
    selected.push({
      id: `${profile.id}_${String(index + 1).padStart(3, '0')}`,
      category: profile.id,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      reference: verse.reference,
      text: verse.text,
      version: 'RVR1909',
    });
  });
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(selected, null, 2)}\n`, 'utf8');
console.log(`Se guardaron ${selected.length} versículos RVR1909 en ${outputPath}.`);
for (const profile of profiles) {
  console.log(`  ${profile.id}: ${selected.filter(item => item.category === profile.id).length}/45`);
}
