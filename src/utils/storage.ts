const inMemoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`localStorage.getItem("${key}") failed, using in-memory fallback:`, e);
      return inMemoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`localStorage.setItem("${key}") failed, using in-memory fallback:`, e);
      inMemoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`localStorage.removeItem("${key}") failed, using in-memory fallback:`, e);
      delete inMemoryStorage[key];
    }
  }
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn(`sessionStorage.getItem("${key}") failed, using in-memory fallback:`, e);
      return inMemoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn(`sessionStorage.setItem("${key}") failed, using in-memory fallback:`, e);
      inMemoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`sessionStorage.removeItem("${key}") failed, using in-memory fallback:`, e);
      delete inMemoryStorage[key];
    }
  }
};
