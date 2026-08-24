/**
 * Async Handler Higher-Order Function (Closure Pattern)
 * Wraps asynchronous Express route handlers to automatically catch rejected promises
 * and pass them to the next() error handling middleware, eliminating try-catch boilerplate.
 *
 * @param {Function} fn - Asynchronous Express middleware/controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
