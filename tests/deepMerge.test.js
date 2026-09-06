'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { deepMerge } = require('..');

describe('shallow merge', () => {
  it('later source overrides earlier keys (last write wins)', () => {
    assert.deepEqual(deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 }), { a: 1, b: 3, c: 4 });
  });

  it('keys unique to each side are preserved', () => {
    assert.deepEqual(deepMerge({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
  });

  it('the last of several sources wins for the same key', () => {
    assert.deepEqual(deepMerge({ a: 1 }, { a: 2 }, { a: 3 }), { a: 3 });
  });

  it('an empty source leaves the target unchanged', () => {
    assert.deepEqual(deepMerge({ a: 1 }, {}), { a: 1 });
  });
});

describe('deep / nested merge', () => {
  it('nested plain objects are merged recursively', () => {
    const result = deepMerge(
      { user: { name: 'Ada', roles: { admin: true } } },
      { user: { age: 36, roles: { editor: true } } },
    );
    assert.deepEqual(result, {
      user: { name: 'Ada', age: 36, roles: { admin: true, editor: true } },
    });
  });

  it('merges three levels deep while preserving siblings', () => {
    assert.deepEqual(
      deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } }),
      { a: { b: { c: 1, d: 2 } } },
    );
  });

  it('nested objects in the result are fresh copies, not aliases of the source', () => {
    const source = { nested: { a: 1 } };
    const result = deepMerge({}, source);
    assert.notEqual(result.nested, source.nested);
    assert.equal(result.nested.a, 1);
  });
});

describe('type replacement', () => {
  it('an object value replaces a primitive at the same key', () => {
    assert.deepEqual(deepMerge({ a: 5 }, { a: { x: 1 } }), { a: { x: 1 } });
  });

  it('a primitive value replaces an object at the same key', () => {
    assert.deepEqual(deepMerge({ a: { x: 1 } }, { a: 5 }), { a: 5 });
  });

  it('null overwrites an existing value', () => {
    assert.deepEqual(deepMerge({ a: 1 }, { a: null }), { a: null });
  });

  it('undefined is written to the key like any other leaf value', () => {
    const result = deepMerge({ a: 1 }, { a: undefined });
    assert.ok('a' in result);
    assert.equal(result.a, undefined);
  });
});

describe('arrays', () => {
  it('an array replaces an array wholesale (no concat, no element merge)', () => {
    assert.deepEqual(deepMerge({ tags: [1, 2, 3] }, { tags: [9] }), { tags: [9] });
  });

  it('an array replaces an object at the same key', () => {
    assert.deepEqual(deepMerge({ a: { x: 1 } }, { a: [1, 2] }), { a: [1, 2] });
  });

  it('an object replaces an array at the same key', () => {
    assert.deepEqual(deepMerge({ a: [1, 2] }, { a: { x: 1 } }), { a: { x: 1 } });
  });
});

describe('mutation & return semantics', () => {
  it('returns the same reference as the target', () => {
    const target = { a: 1 };
    assert.equal(deepMerge(target, { b: 2 }), target);
  });

  it('mutates the target in place', () => {
    const target = { a: 1 };
    deepMerge(target, { b: 2 });
    assert.deepEqual(target, { a: 1, b: 2 });
  });

  it('does not mutate the source objects', () => {
    const source = { nested: { a: 1 } };
    deepMerge({}, source);
    assert.deepEqual(source, { nested: { a: 1 } });
  });
});

describe('multiple sources (variadic)', () => {
  it('merges many sources left to right', () => {
    assert.deepEqual(deepMerge({}, { a: 1 }, { b: 2 }, { c: 3 }), { a: 1, b: 2, c: 3 });
  });

  it('with no sources returns the target unchanged', () => {
    assert.deepEqual(deepMerge({ a: 1 }), { a: 1 });
  });
});

describe('edge cases', () => {
  it('skips non-object sources (null, undefined, numbers, strings, booleans)', () => {
    assert.deepEqual(
      deepMerge({ a: 1 }, null, undefined, 42, 'str', true, { b: 2 }),
      { a: 1, b: 2 },
    );
  });

  it('skips a top-level array passed as a source', () => {
    assert.deepEqual(deepMerge({ a: 1 }, [1, 2, 3]), { a: 1 });
  });

  it('merges a single source into an empty target', () => {
    assert.deepEqual(deepMerge({}, { a: 1 }), { a: 1 });
  });

  it('throws when the target is not an object', () => {
    assert.throws(() => deepMerge(null, { a: 1 }));
  });
});
