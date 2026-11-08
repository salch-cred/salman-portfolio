'use client';

import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitCommitIcon, GitPullRequestIcon } from '@hugeicons/core-free-icons';
import { PERSON } from '@/lib/profile';

const STRAP = 'MAHAMMAD SALMAN  ///  AI/ML ENGINEER  ///  FULL-STACK DEVELOPER  ///  '.repeat(4);

type P = { x: number; y: number; px: number; py: number };

export default function Lanyard({ barcode, commits }: { barcode: number[]; commits: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const left = useRef<SVGPathElement>(null);
  const right = useRef<SVGPathElement>(null);
  const [flipped, setFlipped] = useState(false);
  const flip = useRef(setFlipped);

  useEffect(() => {
    const el = stage.current!;
    const cardEl = card.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, L = 0, CARD = 0, spread = 0;
    const a = { x: 0, y: -40 }, b = { x: 0, y: -40 };
    const C: P = { x: 0, y: 0, px: 0, py: 0 };
    const E: P = { x: 0, y: 0, px: 0, py: 0 };
    let grab: null | { t: number; x: number; y: number } = null;
    let moved = 0, raf = 0, still = 0, running = false, dropped = false;

    const measure = () => {
      W = el.clientWidth;
      H = el.clientHeight;
      CARD = cardEl.offsetHeight;
      spread = Math.min(84, W * 0.13);
      a.x = W / 2 - spread;
      b.x = W / 2 + spread;
      L = Math.hypot(spread, H * 0.29 + 40);
    };

    const place = (y: number) => {
      C.x = C.px = W / 2 + 26;
      C.y = C.py = y;
      E.x = E.px = W / 2 + 6;
      E.y = E.py = y + CARD;
    };

    const clamp = (p: P, o: { x: number; y: number }, len: number) => {
      const dx = p.x - o.x, dy = p.y - o.y, d = Math.hypot(dx, dy);
      if (d > len) {
        const k = len / d;
        p.x = o.x + dx * k;
        p.y = o.y + dy * k;
      }
    };

    const strap = (o: { x: number; y: number }, elp: SVGPathElement | null) => {
      const mx = (o.x + C.x) / 2, my = (o.y + C.y) / 2;
      const slack = Math.max(0, L - Math.hypot(C.x - o.x, C.y - o.y));
      elp?.setAttribute('d', `M${o.x} ${o.y}Q${mx} ${my + slack * 0.6} ${C.x} ${C.y}`);
    };

    const render = (vx: number) => {
      const ang = Math.atan2(E.x - C.x, E.y - C.y);
      cardEl.style.transform = `translate3d(${C.x}px,${C.y}px,0) rotate(${-ang}rad)`;
      if (tilt.current) tilt.current.style.setProperty('--ty', `${Math.max(-26, Math.min(26, vx * 1.5))}deg`);
      strap(a, left.current);
      strap(b, right.current);
    };

    const tick = () => {
      const vx = C.x - C.px;
      for (const p of [C, E]) {
        const nx = p.x + (p.x - p.px) * 0.977;
        const ny = p.y + (p.y - p.py) * 0.977 + 0.62;
        p.px = p.x;
        p.py = p.y;
        p.x = nx;
        p.y = ny;
      }
      for (let i = 0; i < 7; i++) {
        if (grab) {
          const hx = C.x + (E.x - C.x) * grab.t, hy = C.y + (E.y - C.y) * grab.t;
          const dx = grab.x - hx, dy = grab.y - hy;
          C.x += dx * (1 - grab.t) * 0.28;
          C.y += dy * (1 - grab.t) * 0.28;
          E.x += dx * grab.t * 0.28;
          E.y += dy * grab.t * 0.28;
        }
        const reach = L * 1.32;
        clamp(C, a, reach);
        clamp(C, b, reach);
        if (!grab) {
          clamp(C, a, L);
          clamp(C, b, L);
        }
        const dx = E.x - C.x, dy = E.y - C.y, d = Math.hypot(dx, dy) || 1;
        const k = ((d - CARD) / d) * 0.5;
        C.x += dx * k;
        C.y += dy * k;
        E.x -= dx * k;
        E.y -= dy * k;
      }
      render(vx);
      const speed = Math.abs(C.x - C.px) + Math.abs(C.y - C.py) + Math.abs(E.x - E.px) + Math.abs(E.y - E.py);
      still = speed < 0.04 && !grab ? still + 1 : 0;
      if (still > 30) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      still = 0;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const drop = () => {
      if (dropped) return;
      dropped = true;
      el.classList.add('live');
      measure();
      if (reduce) {
        place(Math.sqrt(L * L - spread * spread) - 40);
        render(0);
        return;
      }
      place(-CARD - 140);
      wake();
    };

    const point = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      const p = point(e);
      const t = Math.max(0.05, Math.min(1, Math.hypot(p.x - C.x, p.y - C.y) / CARD));
      grab = { t, ...p };
      moved = 0;
      cardEl.setPointerCapture(e.pointerId);
      cardEl.classList.add('grabbing');
      wake();
    };
    const move = (e: PointerEvent) => {
      if (!grab) return;
      const p = point(e);
      moved += Math.abs(p.x - grab.x) + Math.abs(p.y - grab.y);
      grab.x = p.x;
      grab.y = p.y;
    };
    const up = () => {
      if (!grab) return;
      grab = null;
      cardEl.classList.remove('grabbing');
      if (moved < 6) flip.current((f) => !f);
      wake();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip.current((f) => !f);
      }
    };

    measure();
    const ro = new ResizeObserver(() => {
      const before = W;
      measure();
      if (dropped && before !== W) {
        const shift = (W - before) / 2;
        for (const p of [C, E]) {
          p.x += shift;
          p.px += shift;
        }
        wake();
      }
    });
    ro.observe(el);

    const off = new AbortController();
    const opts = { signal: off.signal };
    cardEl.addEventListener('pointerdown', down, opts);
    cardEl.addEventListener('pointermove', move, opts);
    cardEl.addEventListener('pointerup', up, opts);
    cardEl.addEventListener('pointercancel', up, opts);
    cardEl.addEventListener('keydown', key, opts);
    window.addEventListener('portfolio:open', drop, opts);
    if (document.documentElement.classList.contains('booted')) drop();

    return () => {
      off.abort();
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const peak = Math.max(1, ...barcode);

  return (
    <div className="stage" ref={stage}>
      <svg className="straps" aria-hidden="true">
        <defs>
          <path id="strap-a" ref={left} />
          <path id="strap-b" ref={right} />
        </defs>
        {['a', 'b'].map((s) => (
          <g key={s}>
            <use href={`#strap-${s}`} className="strap-band" />
            <text className="strap-text" dy="3">
              <textPath href={`#strap-${s}`}>{STRAP}</textPath>
            </text>
          </g>
        ))}
      </svg>

      <div
        className="card"
        ref={card}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`ID card for ${PERSON.name}, ${PERSON.role}. Press to flip.`}
      >
        <span className="clip" aria-hidden="true" />
        <div className="card-tilt" ref={tilt}>
          <div className={`card-flip${flipped ? ' flipped' : ''}`}>
            <div className="sleeve front">
              <div className="sleeve-top">
                <i />
                <b />
                <i />
              </div>
              <div className="paper">
                <p className="paper-name">
                  Mahammad
                  <span>Salman</span>
                </p>
                <p className="paper-role">{PERSON.role}</p>
                <p className="paper-org">
                  Developer at <b>@NousResearch</b>
                </p>
                <dl>
                  <dt>Currently</dt>
                  <dd>MCA, AI/ML &amp; Data Science @ Yenepoya University. Studying robotics basics.</dd>
                  <dt>Upstream at</dt>
                  <dd className="chips">
                    <span>
                      <HugeiconsIcon icon={GitPullRequestIcon} size={11} strokeWidth={2} />
                      Hermes Agent
                    </span>
                    <span className="alt">
                      <HugeiconsIcon icon={GitCommitIcon} size={11} strokeWidth={2} />
                      {commits} commits
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="sleeve back">
              <div className="sleeve-top">
                <i />
                <b />
                <i />
              </div>
              <div className="paper paper-back">
                <p className="back-label">Last 72 days, one bar a day</p>
                <div className="bars" aria-hidden="true">
                  {barcode.map((c, i) => (
                    <i key={i} style={{ height: `${Math.max(5, Math.sqrt(c / peak) * 100)}%` }} />
                  ))}
                </div>
                <p className="back-count">{commits} commits on Hermes Agent main</p>
                <ul>
                  <li>{PERSON.location}</li>
                  <li>{PERSON.email}</li>
                </ul>
                <p className="back-foot">If found, hire.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
