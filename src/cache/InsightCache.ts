interface CacheEntry {
  data: any[];
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};

const DEFAULT_TTL = 5 * 60 * 1000;

export const InsightCache = {
  generateKey: (props: any) => {
    const { type, metric, dimension, timeGrain, timeRange } = props;
    return JSON.stringify({ type, metric, dimension, timeGrain, timeRange });
  },

  get: (key: string, ttl: number = DEFAULT_TTL) => {
    const entry = cache[key];
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      delete cache[key];
      return null;
    }
    return entry.data;
  },

  set: (key: string, data: any) => {
    cache[key] = {
      data,
      timestamp: Date.now(),
    };
  },
};

export default InsightCache;
