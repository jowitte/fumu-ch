import { describe, expect, it } from 'vitest';
import { jsonLd } from './json-ld';

describe('jsonLd', () => {
  const data = { '@type': 'Answer', text: 'Vorher </script><script>alert(1)</script> nachher' };

  it('lässt kein schliessendes Script-Tag im Ausgabestring stehen', () => {
    expect(jsonLd(data)).not.toMatch(/<\/script/i);
    expect(jsonLd(data)).not.toContain('<');
  });

  it('bleibt gültiges JSON mit unverändertem Inhalt', () => {
    expect(JSON.parse(jsonLd(data))).toEqual(data);
  });
});
