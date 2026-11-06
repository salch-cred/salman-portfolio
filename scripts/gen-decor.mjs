// Draws the small isometric objects that sit beside section titles, in the same projection as the computer.
import { writeFileSync } from 'node:fs';

const C = Math.cos(Math.PI / 6), S = 0.5;
const iso = ([x, y, z]) => [(x - y) * C, (x + y) * S - z];
const f = (n) => +n.toFixed(2);

function roundPoly(pts, r) {
  const n = pts.length; let d = '';
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(r, la / 2), rb = Math.min(r, lb / 2);
    const s = [p[0] + ((a[0] - p[0]) / la) * ra, p[1] + ((a[1] - p[1]) / la) * ra];
    const e = [p[0] + ((b[0] - p[0]) / lb) * rb, p[1] + ((b[1] - p[1]) / lb) * rb];
    d += `${i ? 'L' : 'M'}${f(s[0])} ${f(s[1])}Q${f(p[0])} ${f(p[1])} ${f(e[0])} ${f(e[1])}`;
  }
  return d + 'Z';
}

function canvas() {
  const out = [], seen = [];
  let delay = 0;
  const path = (d, cls, pts) => {
    seen.push(...pts);
    out.push(`<path d="${d}" class="${cls}" pathLength="1" style="--d:${delay.toFixed(2)}"/>`);
  };
  const quad = (pts, cls, r = 3) => {
    const flat = pts.map(iso);
    path(roundPoly(flat, r), cls, flat);
  };
  const line = (a, b, cls = 'l2') => {
    const [p, q] = [iso(a), iso(b)];
    path(`M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`, cls, [p, q]);
  };
  const box = (x0, x1, y0, y1, z0, z1, r = 3, top = 'f-top') => {
    quad([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], 'f-front', r);
    quad([[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], 'f-side', r);
    quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], top, r);
  };
  const finish = () => {
    const xs = seen.map((p) => p[0]), ys = seen.map((p) => p[1]);
    const [x, y] = [Math.min(...xs) - 3, Math.min(...ys) - 3];
    return { box: [x, y, Math.max(...xs) - x + 3, Math.max(...ys) - y + 3].map(f).join(' '), svg: out.join('') };
  };
  return { path, quad, line, box, finish, at: (d) => (delay = d), seen };
}

function floppy() {
  const c = canvas();
  c.at(0);
  c.box(0, 150, 0, 156, 0, 7, 4);
  c.at(0.25);
  c.quad([[46, 2, 7], [122, 2, 7], [122, 46, 7], [46, 46, 7]], 'l1 inset', 2);
  c.quad([[92, 8, 7], [110, 8, 7], [110, 40, 7], [92, 40, 7]], 'f-side', 1);
  c.at(0.45);
  c.quad([[24, 72, 7], [130, 72, 7], [130, 154, 7], [24, 154, 7]], 'acc l1', 2);
  c.at(0.6);
  for (let i = 0; i < 4; i++) c.line([34, 88 + i * 15, 7], [120, 88 + i * 15, 7], 'l1');
  return c.finish();
}

function keycap() {
  const c = canvas();
  const [a, b, h, t] = [0, 130, 74, 22];
  c.at(0);
  c.box(a - 8, b + 8, a - 8, b + 8, 0, 12, 4);
  c.at(0.2);
  c.quad([[a, b, 12], [b, b, 12], [b - t, b - t, h], [a + t, b - t, h]], 'f-front', 4);
  c.quad([[b, b, 12], [b, a, 12], [b - t, a + t, h], [b - t, b - t, h]], 'f-side', 4);
  c.at(0.4);
  c.quad([[a + t, a + t, h], [b - t, a + t, h], [b - t, b - t, h], [a + t, b - t, h]], 'acc l1', 8);
  c.at(0.6);
  // A prompt glyph set into the cap.
  c.line([46, 54, h], [65, 65, h], 'l1');
  c.line([65, 65, h], [46, 76, h], 'l1');
  c.line([68, 84, h], [88, 84, h], 'l1');
  return c.finish();
}

function server() {
  const c = canvas();
  const unit = 40;
  for (let u = 0; u < 3; u++) {
    const z = u * (unit + 5);
    c.at(u * 0.18);
    c.box(0, 150, 0, 110, z, z + unit, 4);
    const y = 110, m = (a, b, cls, r = 2) => c.quad([[a, y, z + 28], [b, y, z + 28], [b, y, z + 12], [a, y, z + 12]], cls, r);
    c.at(u * 0.18 + 0.25);
    m(12, 92, 'l1 inset');
    for (let i = 1; i < 7; i++) c.line([12 + i * 11.4, y, z + 28], [12 + i * 11.4, y, z + 12]);
    m(116, 124, 'led', 1);
    m(130, 138, u === 1 ? 'acc l1' : 'l1 inset', 1);
  }
  return c.finish();
}

function mug() {
  const c = canvas();
  const r = 56, h = 104;
  const ring = (z, from, to, n = 48) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = from + ((to - from) * i) / n;
      return iso([r * Math.cos(t), r * Math.sin(t), z]);
    });
  const pathOf = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('');
  const [a, b] = [-Math.PI / 4, (3 * Math.PI) / 4];

  c.at(0.3);
  const hb = [iso([r * 0.72, -r * 0.72, 86]), iso([r * 1.62, -r * 1.62, 84]), iso([r * 1.62, -r * 1.62, 30]), iso([r * 0.72, -r * 0.72, 26])];
  c.path(`M${f(hb[0][0])} ${f(hb[0][1])}C${f(hb[1][0])} ${f(hb[1][1])} ${f(hb[2][0])} ${f(hb[2][1])} ${f(hb[3][0])} ${f(hb[3][1])}`, 'l1 nofill', hb);
  c.at(0);
  const front = [...ring(0, a, b), ...ring(h, b, a)];
  c.path(`${pathOf(front)}Z`, 'f-front', front);
  c.at(0.2);
  const top = ring(h, 0, Math.PI * 2, 72);
  c.path(`${pathOf(top)}Z`, 'f-top', top);
  c.at(0.35);
  const inner = Array.from({ length: 73 }, (_, i) => {
    const t = (i / 72) * Math.PI * 2;
    return iso([(r - 6) * Math.cos(t), (r - 6) * Math.sin(t), h - 2]);
  });
  c.path(`${pathOf(inner)}Z`, 'acc l1', inner);
  c.at(0.5);
  const band = [...ring(30, a, b), ...ring(54, b, a)];
  c.path(`${pathOf(band)}Z`, 'acc l1', band);
  return c.finish();
}

const DECOR = { floppy: floppy(), keycap: keycap(), server: server(), mug: mug() };
writeFileSync('components/decor-art.ts',
`// Generated by scripts/gen-decor.mjs. Do not edit by hand.
export const DECOR = ${JSON.stringify(DECOR)};
`);
for (const [k, v] of Object.entries(DECOR)) console.log(k, v.box, v.svg.length);
