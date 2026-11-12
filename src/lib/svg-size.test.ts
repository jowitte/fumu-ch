import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { svgSize } from './svg-size';

describe('svgSize', () => {
  it('liest Breite und Höhe aus der viewBox und rundet auf ganze Pixel', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1942.9398651123047 194.5" width="1942.9398651123047" height="194.5">';
    expect(svgSize(svg)).toEqual({ width: 1943, height: 195 });
  });

  it('nimmt die viewBox des Wurzelelements, nicht die eines verschachtelten SVG', () => {
    expect(svgSize('<?xml version="1.0"?><svg viewBox="0 0 10 20"><svg viewBox="0 0 99 99"></svg></svg>')).toEqual({
      width: 10,
      height: 20,
    });
  });

  it('wirft, wenn die viewBox fehlt oder unbrauchbar ist', () => {
    expect(() => svgSize('<svg width="10" height="10"></svg>')).toThrow(/viewBox/);
    expect(() => svgSize('<svg viewBox="0 0 0 10"></svg>')).toThrow(/viewBox/);
  });

  it('liefert für jedes Pillar-Diagramm ganze, positive Masse', () => {
    const dir = 'public/images/pillars';
    const files = readdirSync(dir).filter(file => file.endsWith('.svg'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const { width, height } = svgSize(readFileSync(`${dir}/${file}`, 'utf8'));
      expect([width, height].every(n => Number.isInteger(n) && n > 0), file).toBe(true);
    }
  });
});
