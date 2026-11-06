export type Palette = { id: string; name: string; c: [string, string, string, string] };

// Ramps run light to dark for a light page: c1 is the faintest cell, c4 is the accent used for text.
export const PALETTES: Palette[] = [
  { id: 'github', name: 'GitHub', c: ['#aceebb', '#4ac26b', '#2da44e', '#116329'] },
  { id: 'halloween', name: 'Halloween', c: ['#ffe08a', '#ffb02e', '#e8590c', '#8f2f00'] },
  { id: 'celadon', name: 'Celadon', c: ['#c4e8da', '#7cc4ab', '#3a8f78', '#1c5c4d'] },
  { id: 'wisteria', name: 'Wisteria', c: ['#dcd2f7', '#b09be8', '#7a5fd0', '#47309a'] },
  { id: 'ember', name: 'Ember', c: ['#ffd3bf', '#ff9a6b', '#ec4f16', '#b02e06'] },
  { id: 'glacier', name: 'Glacier', c: ['#c5e3fb', '#7bbcf2', '#2a80d4', '#0f4f94'] },
  { id: 'sakura', name: 'Sakura', c: ['#fbd3e4', '#f29cc2', '#d6508f', '#962358'] },
  { id: 'matcha', name: 'Matcha', c: ['#dbe8a6', '#aac45a', '#6f8a24', '#455a12'] },
  { id: 'saffron', name: 'Saffron', c: ['#ffe7a3', '#fbc53f', '#c98a0a', '#7f5300'] },
  { id: 'nocturne', name: 'Nocturne', c: ['#d3d8e6', '#9aa5c0', '#5a6688', '#2a3350'] },
  { id: 'coral', name: 'Coral Reef', c: ['#ffd3cc', '#ff9c92', '#e8545a', '#a82832'] },
  { id: 'aurora', name: 'Aurora', c: ['#c6f2dc', '#6fdcae', '#18a67d', '#0b6a5c'] },
];

export const DEFAULT_PALETTE = 'ember';

export const paletteCss = PALETTES.map(
  (p) => `[data-palette="${p.id}"]{--c1:${p.c[0]};--c2:${p.c[1]};--c3:${p.c[2]};--c4:${p.c[3]}}`,
).join('');
