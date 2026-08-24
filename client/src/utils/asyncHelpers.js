/**
 * Asynchronous JavaScript Helpers & Promisified APIs
 *
 * Demonstrates:
 * 1. JavaScript Promises vs Callbacks (Promisification of callback APIs)
 * 2. Modern async/await consumption with robust error boundaries
 * 3. Parallel asynchronous orchestrations (Promise.all, Promise.race)
 */

/**
 * 1. Promisified Geolocation API
 * Converts legacy callback-based navigator.geolocation.getCurrentPosition into a modern Promise.
 *
 * Callback style (Legacy):
 *   navigator.geolocation.getCurrentPosition(successCb, errorCb, options)
 *
 * Promisified style (Modern):
 *   const coords = await getPromisifiedLocation();
 */
export function getPromisifiedLocation(options = { timeout: 10000, enableHighAccuracy: true }) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let msg = "Unable to retrieve location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Location permission denied. Please allow GPS access.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = "Location request timed out.";
            break;
          default:
            msg = error.message || msg;
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * 2. Promisified File Reader
 * Converts FileReader event-driven callbacks (onload, onerror) into a Promise.
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided."));
    }

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file."));

    reader.readAsDataURL(file);
  });
}

/**
 * 3. Promise Timeout Wrapper (Demonstrates Promise.race)
 * Rejects if the underlying promise does not settle within the given timeout.
 */
export function withTimeout(promise, ms = 8000, timeoutMessage = "Operation timed out") {
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      reject(new Error(timeoutMessage));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * 4. Parallel Data Fetcher helper
 * Executes multiple async operations concurrently and safely handles partial failures.
 */
export async function fetchParallelSafely(promiseArray) {
  const results = await Promise.allSettled(promiseArray);
  return results.map((res) => ({
    success: res.status === "fulfilled",
    data: res.status === "fulfilled" ? res.value : null,
    error: res.status === "rejected" ? res.reason?.message : null,
  }));
}
