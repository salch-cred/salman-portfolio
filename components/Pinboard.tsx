'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { PERSON, SCRAPS } from '@/lib/profile';

export default function Pinboard() {
  const [top, setTop] = useState(-1);
  const drag = useRef<{ el: HTMLElement; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const down = (e: React.PointerEvent<HTMLElement>, i: number) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    drag.current = {
      el,
      sx: e.clientX,
      sy: e.clientY,
      ox: Number(el.dataset.ox ?? 0),
      oy: Number(el.dataset.oy ?? 0),
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
    setTop(i);
  };
  const move = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = d.ox + e.clientX - d.sx, y = d.oy + e.clientY - d.sy;
    if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 4) d.moved = true;
    d.el.dataset.ox = String(x);
    d.el.dataset.oy = String(y);
    d.el.style.setProperty('--dx', `${x}px`);
    d.el.style.setProperty('--dy', `${y}px`);
  };
  const up = (e: React.PointerEvent<HTMLElement>, href: string) => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved && e.pointerType !== 'touch') window.open(href, '_blank', 'noopener');
  };

  return (
    <div className="board rise">
      {SCRAPS.map((s, i) => {
        const href = `${PERSON.github}/${s.r}`;
        return (
          <a
            key={s.r}
            href={href}
            className={`scrap${top === i ? ' top' : ''}`}
            draggable={false}
            style={{ '--x': `${s.x}%`, '--y': `${s.y}%`, '--a': `${s.a}deg` } as React.CSSProperties}
            onClick={(e) => {
              // Mouse clicks are resolved on pointer up so a drag never opens the link.
              if (e.detail > 0 && matchMedia('(pointer: fine)').matches) e.preventDefault();
            }}
            onPointerDown={(e) => down(e, i)}
            onPointerMove={move}
            onPointerUp={(e) => up(e, href)}
          >
            <i className="pin" aria-hidden="true" />
            <h3>
              {s.t}
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} />
            </h3>
            <p>{s.d}</p>
          </a>
        );
      })}
    </div>
  );
}
