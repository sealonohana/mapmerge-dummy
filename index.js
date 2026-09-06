'use strict';

// Keys that resolve to prototype accessors; merging into them would allow
// prototype pollution (CWE-1321), so they are never traversed or assigned.
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively merge `sources` into `target`, mutating `target` in place
 * (last write wins). Nested objects are merged recursively.
 *
 * Only own enumerable keys are processed, and the prototype-accessor keys
 * `__proto__`, `constructor`, and `prototype` are skipped, so untrusted input
 * cannot pollute `Object.prototype`.
 *
 * @param {Object} target object to merge into (mutated and returned)
 * @param {...*} sources objects whose entries are merged into target
 * @returns {Object} the mutated target
 */
function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (!isObject(source)) continue;
    for (const key of Object.keys(source)) {
      if (FORBIDDEN_KEYS.has(key)) continue;
      if (isObject(source[key])) {
        if (!isObject(target[key])) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

module.exports = { deepMerge };
