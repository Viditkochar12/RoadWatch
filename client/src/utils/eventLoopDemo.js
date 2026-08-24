/**
 * JavaScript Event Loop Demonstration & Educational Diagnostics
 *
 * Concepts:
 * 1. Call Stack (Synchronous code executes first)
 * 2. Microtask Queue (Promises, queueMicrotask - higher priority than Macrotasks)
 * 3. Macrotask / Task Queue (setTimeout, setInterval, I/O - executed after microtasks drain)
 */

export async function runEventLoopSimulation(logCallback = console.log) {
  const executionLog = [];

  const log = (step, queueType, description) => {
    const entry = { step: executionLog.length + 1, phase: queueType, message: description };
    executionLog.push(entry);
    if (typeof logCallback === "function") logCallback(entry);
  };

  log(1, "Call Stack (Sync)", "1. Script start: Synchronous block begins");

  // Schedule a Macrotask
  setTimeout(() => {
    log(4, "Macrotask Queue", "4. setTimeout callback executed after microtasks drained");
  }, 0);

  // Schedule a Microtask via Promise
  Promise.resolve().then(() => {
    log(3, "Microtask Queue", "3. Promise.then microtask executed before next macrotask");
  });

  // Schedule another Microtask via queueMicrotask
  if (typeof queueMicrotask === "function") {
    queueMicrotask(() => {
      log(3, "Microtask Queue", "3b. queueMicrotask executed in current microtask turn");
    });
  }

  log(2, "Call Stack (Sync)", "2. Script end: Synchronous block finished");

  // Wait for queues to settle to return the collected sequence
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(executionLog);
    }, 50);
  });
}
