import { Readable } from 'node:stream';

export function renderToStream(component: () => any): Readable {
  const iterable = component()[Symbol.iterator]();
  return Readable.from((function* () {
    for (const chunk of iterable) {
      yield chunk?.toString?.() ?? chunk;
    }
  })());
}
