'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Year } from '@/lib/github-fetch';
import { DEFAULT_PALETTE, PALETTES } from '@/lib/palettes';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function stats(year: Year) {
  let run = 0, best = 0, peak = year.days[0] ?? { d: '', c: 0 };
  for (const d of year.days) {
    run = d.c ? run + 1 : 0;
    best = Math.max(best, run);
    if (d.c > peak.c) peak = d;
  }
  let current = 0;
  const days = [...year.days].reverse();
  // Today can still be empty without breaking the streak.
  for (let i = 0; i < days.length; i++) {
    if (days[i].c) current++;
    else if (i > 0) break;
  }
  const active = year.days.filter((d) => d.c).length;
  return { best, peak, current, active };
}

function levels(days: Year['days']) {
  const vals = days.map((d) => d.c).filter(Boolean).sort((a, b) => a - b);
  const q = (p: number) => vals[Math.floor((vals.length - 1) * p)] ?? 1;
  const [a, b, c] = [q(0.3), q(0.6), q(0.85)];
  return (n: number) => (!n ? 0 : n <= a ? 1 : n <= b ? 2 : n <= c ? 3 : 4);
}

export default function Heatmap({ years, fetchedAt }: { years: Year[]; fetchedAt: string }) {
  const [key, setKey] = useState(years[0].key);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const grid = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const year = years.find((y) => y.key === key) ?? years[0];

  useEffect(() => {
    setPalette(document.documentElement.dataset.palette ?? DEFAULT_PALETTE);
  }, []);

  // On narrow screens the grid scrolls sideways. Start at the recent end, where the work is.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [key]);

  const choose = (id: string) => {
    setPalette(id);
    document.documentElement.dataset.palette = id;
    try {
      localStorage.setItem('palette', id);
    } catch {}
  };

  const { cells, months, offset } = useMemo(() => {
    const level = levels(year.days);
    const offset = year.days.length ? new Date(`${year.days[0].d}T00:00:00Z`).getUTCDay() : 0;
    const months: { label: string; col: number }[] = [];
    let seen = -1;
    year.days.forEach((d, i) => {
      const m = new Date(`${d.d}T00:00:00Z`).getUTCMonth();
      const col = Math.floor((i + offset) / 7);
      if (m !== seen) {
        seen = m;
        if (!months.length || col - months[months.length - 1].col >= 3) months.push({ label: MONTHS[m], col });
      }
    });
    return { cells: year.days.map((d) => ({ ...d, l: level(d.c) })), months, offset };
  }, [year]);

  const s = useMemo(() => stats(year), [year]);

  const hover = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    const box = tip.current!;
    const d = t.dataset?.d;
    if (!d) return box.classList.remove('on');
    const g = grid.current!.getBoundingClientRect();
    const r = t.getBoundingClientRect();
    const n = Number(t.dataset.c);
    box.querySelector('b')!.textContent = n ? `${n} contribution${n > 1 ? 's' : ''}` : 'No contributions';
    box.querySelector('span')!.textContent = fmt(d);
    const half = box.offsetWidth / 2;
    const x = Math.max(half, Math.min(g.width - half, r.left - g.left + r.width / 2));
    box.style.transform = `translate(${x - half}px, ${r.top - g.top - box.offsetHeight - 8}px)`;
    box.classList.add('on');
  };

  return (
    <div className="heat rise">
      <div className="heat-head">
        <h2>
          <strong>{year.total.toLocaleString('en-US')}</strong> contributions
          {key === 'last' ? ' in the last year' : ` in ${year.label}`}
        </h2>
        <div className="heat-years" role="tablist" aria-label="Year">
          {years.map((y) => (
            <button key={y.key} role="tab" aria-selected={y.key === key} onClick={() => setKey(y.key)}>
              {y.label}
            </button>
          ))}
        </div>
      </div>

      <div className="heat-scroll" ref={scroller}>
        <div className="heat-inner">
          <div className="heat-months" aria-hidden="true">
            {months.map((m) => (
              <span key={`${m.label}${m.col}`} style={{ gridColumnStart: m.col + 1 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="heat-body">
            <div className="heat-days" aria-hidden="true">
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>
            <div
              className="heat-grid"
              key={key}
              ref={grid}
              onPointerMove={hover}
              onPointerLeave={() => tip.current?.classList.remove('on')}
            >
              {Array.from({ length: offset }, (_, i) => (
                <i key={`pad${i}`} className="pad" />
              ))}
              {cells.map((c, i) => (
                <i
                  key={c.d}
                  data-d={c.d}
                  data-c={c.c}
                  data-l={c.l}
                  style={{ '--i': Math.floor((i + offset) / 7) } as React.CSSProperties}
                />
              ))}
              <div className="heat-tip" ref={tip} role="status">
                <b />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="heat-foot">
        <p>
          Synced from GitHub {fmt(fetchedAt.slice(0, 10))}. Refreshes on its own.
        </p>
        <div className="heat-legend" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} data-l={l} />
          ))}
          More
        </div>
      </div>

      <dl className="heat-stats">
        <div>
          <dt>Longest streak</dt>
          <dd>{s.best} days</dd>
        </div>
        <div>
          <dt>Current streak</dt>
          <dd>{s.current} days</dd>
        </div>
        <div>
          <dt>Active days</dt>
          <dd>{s.active}</dd>
        </div>
        <div>
          <dt>Busiest day</dt>
          <dd>
            {s.peak.c} on {s.peak.d ? fmt(s.peak.d) : 'n/a'}
          </dd>
        </div>
      </dl>

      <div className="pal">
        <h3>Palette</h3>
        <p>This one repaints the whole site.</p>
        <div className="pal-grid">
          {PALETTES.map((p) => (
            <button key={p.id} aria-pressed={p.id === palette} onClick={() => choose(p.id)}>
              <span className="pal-strip">
                {p.c.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
