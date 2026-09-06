# mapmerge

A tiny, zero-dependency utility for deeply merging plain JavaScript objects.

`deepMerge` recursively combines objects left to right — later sources win on
conflicts, and nested objects are merged instead of overwritten.

## Installation

```bash
npm install mapmerge-dummy
```

## Usage

```js
const { deepMerge } = require('mapmerge-dummy');

const defaults = {
  host: 'localhost',
  options: { retries: 3, timeout: 1000 },
};

const overrides = {
  options: { timeout: 5000 },
};

const config = deepMerge(defaults, overrides);
// {
//   host: 'localhost',
//   options: { retries: 3, timeout: 5000 },
// }
```

## API

### `deepMerge(target, ...sources)`

Merges each of `sources` into `target` and returns `target`.

- Merges left to right — when the same key appears more than once, the **last
  source wins**.
- When a key holds a plain object on both sides, the two are **merged
  recursively**; any other value type (primitives, arrays, `null`) is replaced
  wholesale.
- `target` is merged into and returned. Non-object sources are ignored.

| Parameter   | Type       | Description                                  |
| ----------- | ---------- | -------------------------------------------- |
| `target`    | `Object`   | The object to merge into (returned).         |
| `...sources`| `Object[]` | One or more objects whose entries are merged.|

**Returns:** `Object` — the merged `target`.

## Testing

```bash
npm test
```

The suite uses the built-in Node.js test runner (`node --test`) and covers
shallow and deep merges, type replacement, arrays, mutation semantics,
variadic sources, and edge cases.

## License

[MIT](./LICENSE)
