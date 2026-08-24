import { useState, useEffect } from "react";

/**
 * Custom Hook: useDebounce
 *
 * Demonstrates:
 * 1. JavaScript Closures (encloses timeout ID in effect scope)
 * 2. Side effects with useEffect (sets timer and cleans up on value change)
 * 3. State management with useState (debounced value state)
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Closure captures handler timer ID
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Effect cleanup: cancels previous timeout when value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
