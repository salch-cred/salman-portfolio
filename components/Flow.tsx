'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useMotionValueEvent, useScroll, useSpring } from 'motion/react';

type Geo = { w: number; h: number; d: string; nodes: { x: number; y: number }[] };

const STOPS = ['#work .fig', '#record .fig', '#credits .fig', '#bench .fig', '.two .fig', '.foot'];
const REVEALS = '.fig, .sec-title, .deco, .rise';

// Rounds the corners of an open polyline.
function rounded(pts: [number, number][], r: number) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [p, a, b] = [pts[i], pts[i - 1], pts[i + 1]];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(r, la / 2);
    const rb = Math.min(r, lb / 2);
    d += `L${p[0] + ((a[0] - p[0]) / la) * ra} ${p[1] + ((a[1] - p[1]) / la) * ra}`;
    d += `Q${p[0]} ${p[1]} ${p[0] + ((b[0] - p[0]) / lb) * rb} ${p[1] + ((b[1] - p[1]) / lb) * rb}`;
  }
  const end = pts[pts.length - 1];
  return `${d}L${end[0]} ${end[1]}`;
}

/** Smooth scroll, section reveals, and the line that runs from the hero to the footer as you read. */
export default function Flow() {
  const [geo, setGeo] = useState<Geo | null>(null);
  const line = useRef<SVGPathElement>(null);
  const tip = useRef<SVGGElement>(null);
  const samples = useRef<{ l: number; y: number }[]>([]);
  const total = useRef(0);
  const nodeEls = useRef<(SVGCircleElement | null)[]>([]);
  const { scrollY } = useScroll();
  const length = useSpring(0, { stiffness: 70, damping: 22, mass: 0.6 });

  useEffect(() => {
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lenis: Lenis | null = null;
    const open = () => lenis?.start();
    if (!quiet) {
      lenis = new Lenis({ anchors: true, lerp: 0.11 });
      if (!document.documentElement.classList.contains('booted')) lenis.stop();
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      window.addEventListener('portfolio:open', open);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    document.querySelectorAll(REVEALS).forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('portfolio:open', open);
      lenis?.destroy();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer = 0;
    const measure = () => {
      const hero = document.querySelector('.hero');
      const foot = document.querySelector('.foot');
      const ys = STOPS.map((s) => document.querySelector(s)?.getBoundingClientRect().top ?? 0).map((t) => t + window.scrollY);
      if (!hero || !foot || ys.some((y) => !y)) return;
      const w = document.documentElement.clientWidth;
      const h = foot.getBoundingClientRect().bottom + window.scrollY;
      const gutter = Math.max(10, Math.min(32, w * 0.02));
      const start = hero.getBoundingClientRect().bottom + window.scrollY;
      const lifted = ys.map((y, i) => y - (i === ys.length - 1 ? 44 : 34));

      // Runs down one margin, crosses the page above each section, then takes the other margin.
      const pts: [number, number][] = [[w / 2, start], [w / 2, lifted[0]]];
      let side = gutter;
      pts.push([side, lifted[0]]);
      for (const y of lifted.slice(1, -1)) {
        pts.push([side, y]);
        side = side === gutter ? w - gutter : gutter;
        pts.push([side, y]);
      }
      const last = lifted[lifted.length - 1];
      pts.push([side, last], [w / 2, last], [w / 2, last + 34]);
      setGeo({ w, h, d: rounded(pts, 30), nodes: lifted.map((y) => ({ x: w / 2, y })) });
    };
    const soon = () => {
      clearTimeout(timer);
      timer = window.setTimeout(measure, 120);
    };
    measure();
    const ro = new ResizeObserver(soon);
    ro.observe(document.body);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const follow = useCallback(
    (y: number) => {
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0));

      // Last sample above the reading position. The path never moves upward, so this can bisect.
      const list = samples.current;
      const target = y + window.innerHeight * 0.68;
      let lo = 0;
      let hi = list.length - 1;
      if (hi < 0 || target < list[0].y) return length.set(0);
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (list[mid].y <= target) lo = mid;
        else hi = mid - 1;
      }
      length.set(list[lo].l);
    },
    [length],
  );

  useEffect(() => {
    const el = line.current;
    if (!el || !geo) return;
    total.current = el.getTotalLength();
    const list: { l: number; y: number }[] = [];
    for (let l = 0; l <= total.current; l += 14) list.push({ l, y: el.getPointAtLength(l).y });
    samples.current = list;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) length.jump(total.current);
    else follow(window.scrollY);
  }, [geo, follow, length]);

  useMotionValueEvent(scrollY, 'change', follow);
  useMotionValueEvent(length, 'change', (v) => {
    const el = line.current;
    if (!el) return;
    el.style.strokeDasharray = `${v} ${total.current + 1}`;
    const p = el.getPointAtLength(v);
    tip.current?.setAttribute('transform', `translate(${p.x} ${p.y})`);
    tip.current?.setAttribute('opacity', v > 1 ? '1' : '0');
    geo?.nodes.forEach((n, i) => {
      const passed = p.y > n.y + 1 || (Math.abs(p.y - n.y) <= 1 && samples.current.length > 0 && v > 0);
      nodeEls.current[i]?.classList.toggle('on', passed);
    });
  });

  if (!geo) return null;
  return (
    <svg className="trace" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
      <path className="trace-base" d={geo.d} />
      <path className="trace-line" d={geo.d} ref={line} style={{ strokeDasharray: `0 ${geo.h * 4}` }} />
      {geo.nodes.map((n, i) => (
        <circle
          key={i}
          className="trace-node"
          cx={n.x}
          cy={n.y}
          r={5}
          ref={(el) => {
            nodeEls.current[i] = el;
          }}
        />
      ))}
      <g ref={tip} opacity="0">
        <circle className="trace-halo" r={11} />
        <circle className="trace-tip" r={4} />
      </g>
    </svg>
  );
}
