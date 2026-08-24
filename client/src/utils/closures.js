/**
 * JavaScript Closures Utilities & Design Patterns
 *
 * A closure is the combination of a function bundled together (enclosed)
 * with references to its surrounding state (lexical environment).
 */

/**
 * 1. Throttler Closure
 * Encloses `lastRun` and `timer` in lexical scope to rate-limit high-frequency events (e.g. map panning/clicking).
 */
export function createThrottler(fn, limitMs = 300) {
  let lastRan = 0;
  let timerId = null;

  return function throttled(...args) {
    const context = this;
    const now = Date.now();

    if (now - lastRan >= limitMs) {
      fn.apply(context, args);
      lastRan = now;
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        if (Date.now() - lastRan >= limitMs) {
          fn.apply(context, args);
          lastRan = Date.now();
        }
      }, limitMs - (now - lastRan));
    }
  };
}

/**
 * 2. Memoized API / Calculation Factory Closure
 * Encloses a private `cache` Map so cached results survive between subsequent function invocations.
 */
export function createMemoizer(fn) {
  const cache = new Map();

  const memoized = async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return { data: cache.get(key), fromCache: true };
    }
    const result = await fn(...args);
    cache.set(key, result);
    return { data: result, fromCache: false };
  };

  memoized.clearCache = () => cache.clear();
  memoized.getCacheSize = () => cache.size;

  return memoized;
}

/**
 * 3. Stateful Counter / ID Generator Closure
 * Private state variable `count` cannot be modified directly from outside.
 */
export function createReportCounter(initial = 0) {
  let count = initial;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
    reset: () => {
      count = initial;
      return count;
    },
  };
}
