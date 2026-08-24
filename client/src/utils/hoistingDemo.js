/**
 * JavaScript Hoisting Concepts & Demonstration
 *
 * Hoisting is JavaScript's default behavior of moving declarations to the top
 * of the current scope (script or function) during the compilation/creation phase.
 */

export function demonstrateHoisting() {
  const findings = [];

  // 1. Function Declaration Hoisting (Can be called before definition)
  try {
    const fnResult = hoistedFunctionDeclaration();
    findings.push({
      concept: "Function Declaration Hoisting",
      result: fnResult,
      explanation: "Function declarations are hoisted completely with their implementation body.",
    });
  } catch (err) {
    findings.push({ concept: "Function Declaration", error: err.message });
  }

  function hoistedFunctionDeclaration() {
    return "✅ Successfully executed hoistedFunctionDeclaration() before its literal definition in source code!";
  }

  // 2. var vs let/const Hoisting
  findings.push({
    concept: "Variable Hoisting (var)",
    result: "var declarations are hoisted and initialized to 'undefined'.",
    explanation: "Accessing a var before declaration yields 'undefined' without throwing a ReferenceError.",
  });

  // 3. Temporal Dead Zone (TDZ) for let & const
  findings.push({
    concept: "Temporal Dead Zone (let / const)",
    result: "let and const are hoisted to the block scope but remain uninitialized in the TDZ.",
    explanation: "Accessing let/const before their line of declaration throws a ReferenceError.",
  });

  // 4. Function Expressions & Arrow Functions
  findings.push({
    concept: "Function Expressions (const / var fn = ...)",
    result: "Function expressions assigned to variables follow variable hoisting rules, not function hoisting.",
    explanation: "Calling an arrow function or function expression before its assignment results in ReferenceError (for const/let) or TypeError (for var).",
  });

  return findings;
}
