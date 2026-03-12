import { createSeedData } from '../data/seed';

const STORAGE_KEY = 'wl-tracker-fc26-v2';

export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedData();
      saveAppData(seed);
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    const seed = createSeedData();
    saveAppData(seed);
    return seed;
  }
}

export function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'wl-tracker-backup.json';
  anchor.click();
  URL.revokeObjectURL(url);
}
