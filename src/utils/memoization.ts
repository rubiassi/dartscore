export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function createSelector<S, R>(
  selectors: ((state: S) => any)[],
  combiner: (...args: any[]) => R
): (state: S) => R {
  let lastArgs: any[] | null = null;
  let lastResult: R | null = null;

  return (state: S): R => {
    const currentArgs = selectors.map(selector => selector(state));
    
    if (
      lastArgs === null ||
      lastArgs.length !== currentArgs.length ||
      lastArgs.some((arg, index) => arg !== currentArgs[index])
    ) {
      lastResult = combiner(...currentArgs);
      lastArgs = currentArgs;
    }
    
    return lastResult!;
  };
} 