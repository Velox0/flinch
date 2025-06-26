# Flinch HTML Utility

This package provides a utility for working with template literals in TypeScript/JavaScript, allowing you to process, update, and iterate over the static and dynamic parts of a template string.

## Features

- Clean and normalize template strings and values
- Update individual strings or values
- Replace matches in strings (and optionally values) using regular expressions
- Iterate over all parts (strings and values) in order
- Convert the template back to a string

## API

### `html(strings: TemplateStringsArray, ...values: any[]): HtmlResult`

Processes a template literal and returns an object with methods for manipulation and iteration.

#### `HtmlResult` Interface

```ts
export interface HtmlResult {
  strings: string[];
  values: any[];
  updateStringAt(index: number, str: string): void;
  updateValueAt(index: number, value: any): void;
  updateMatches(
    pattern: RegExp,
    replacement: string,
    updateValue?: boolean
  ): void;
  toString(): string;
  [Symbol.iterator](): Generator<string | unknown, void, unknown>;
}
```

## Usage

```ts
import { html } from "./src/html";

const name = " John  ";
const mood = " happy ";
const result = html`Hello ${name}! How are you ${mood}?`;

// Access strings and values
console.log(result.strings); // ["Hello", "! How are you", "?"]
console.log(result.values); // ["John", "happy"]

// Update a string or value
result.updateStringAt(0, "Hi");
result.updateValueAt(1, "excited");

// Replace matches in strings (and optionally values)
result.updateMatches(/Hi/, "Hello");
result.updateMatches(/excited/, "happy", true);

// Convert back to string
console.log(result.toString()); // "Hello! How are you happy?"

// Iterate through all parts (strings and values)
for (const part of result) {
  console.log(part);
}
```

## License

MIT
