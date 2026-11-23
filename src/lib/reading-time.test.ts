import { describe, expect, it } from 'vitest';
import { readingMinutes } from './reading-time';

const words = (n: number) => Array.from({ length: n }, () => 'wort').join(' ');

describe('readingMinutes', () => {
  it('rechnet 200 Wörter pro Minute', () => {
    expect(readingMinutes(words(1000))).toBe(5);
  });

  it('gibt für leeren oder fehlenden Body eine Minute', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes(undefined)).toBe(1);
  });

  it('zählt Code-Blöcke, Bilder und HTML-Tags nicht mit', () => {
    const body = [
      words(400),
      '```js\n' + words(600) + '\n```',
      '![ein langer Alt-Text mit vielen Wörtern](/images/x.png)',
      '<video src="/a.mp4" class="loop-illustration" muted autoplay></video>',
    ].join('\n\n');
    expect(readingMinutes(body)).toBe(2);
  });
});
