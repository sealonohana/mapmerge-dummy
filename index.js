'use strict';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively merge `sources` into `target`, mutating `target` in place
 * (last write wins). Nested objects are merged recursively.
 *
 * @param {Object} target object to merge into (mutated and returned)
 * @param {...*} sources objects whose entries are merged into target
 * @returns {Object} the mutated target
 */
function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (!isObject(source)) continue;
    for (const key in source) {
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
