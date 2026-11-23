#!/usr/bin/env node
// Schreibt die gerissenen Papierkanten (--torn-*) aus src/lib/torn-paper.ts
// nach src/styles/torn-paper.css. BaseLayout importiert die Datei; Astro
// bündelt sie ins gemeinsame CSS. Nach jeder Änderung an torn-paper.ts
// laufen lassen – src/lib/torn-paper.test.ts schlägt sonst fehl.
//
//   node scripts/torn-css.mjs
//
// Node ≥ 22.18 lädt die .ts-Datei direkt (Type Stripping).

import { writeFileSync } from 'node:fs';
import { tornCss } from '../src/lib/torn-paper.ts';

const target = new URL('../src/styles/torn-paper.css', import.meta.url);
writeFileSync(target, tornCss());
console.log(target.pathname);
