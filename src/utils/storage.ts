/**
 * Safe storage utility with in-memory fallback for environments where
 * localStorage or sessionStorage is restricted, blocked, or throws SecurityError.
 */

class MemoryStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryStore = new MemoryStorage();
const memorySessionStore = new MemoryStorage();

function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const storage = window[type];
    if (!storage) return false;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const localAvailable = isStorageAvailable('localStorage');
const sessionAvailable = isStorageAvailable('sessionStorage');

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (localAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryStore.getItem(key);
      }
    }
    return memoryStore.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (localAvailable) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memoryStore.setItem(key, value);
  },

  removeItem(key: string): void {
    if (localAvailable) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memoryStore.removeItem(key);
  },
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (sessionAvailable) {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        return memorySessionStore.getItem(key);
      }
    }
    return memorySessionStore.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (sessionAvailable) {
      try {
        window.sessionStorage.setItem(key, value);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memorySessionStore.setItem(key, value);
  },

  removeItem(key: string): void {
    if (sessionAvailable) {
      try {
        window.sessionStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memorySessionStore.removeItem(key);
  },
};
