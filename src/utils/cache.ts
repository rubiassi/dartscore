type CacheKey = string | number;
type CacheValue = any;

interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

class Cache {
  private cache: Map<CacheKey, { value: CacheValue; timestamp: number }>;
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 5 * 60 * 1000; // Default 5 minutes
  }

  set(key: CacheKey, value: CacheValue): void {
    // Hvis cachen er fuld, fjern den ældste entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = Array.from(this.cache.keys())[0];
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: CacheKey): CacheValue | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;

    // Tjek om værdien er udløbet
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: CacheKey): boolean {
    return this.cache.has(key);
  }

  delete(key: CacheKey): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Fjern alle udløbne entries
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance med default options
const defaultCache = new Cache();

// Factory funktion til at oprette nye cache instances med custom options
export const createCache = (options?: CacheOptions) => new Cache(options);

export default defaultCache; 