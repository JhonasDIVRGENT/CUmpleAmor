const key = 'karlita-read-verses';

const read = storageKey => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
};

const write = (storageKey, value) => localStorage.setItem(storageKey, JSON.stringify(value));

export const readingHistory = {
  getRead() {
    return read(key);
  },
  remember(id) {
    const values = new Set(read(key));
    values.add(id);
    write(key, [...values]);
  },
};
