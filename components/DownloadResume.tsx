'use client';

import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

type Stage = 'idle' | 'busy' | 'done';
const FILE = '/Mahammad-Salman-Resume.pdf';
const TILES = Array.from({ length: 14 }, (_, i) => i);

/** The sheet prints into the tray while the browser saves the file, then the tiles scatter. */
export default function DownloadResume() {
  const [stage, setStage] = useState<Stage>('idle');
  const percent = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const timer = useRef(0);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    },
    [],
  );

  const start = () => {
    if (stage !== 'idle') return;
    setStage('busy');
    const t0 = performance.now();
    const length = 950;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / length);
      if (percent.current) percent.current.textContent = `${Math.round(p * 100)}%`;
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      setStage('done');
      timer.current = window.setTimeout(() => setStage('idle'), 2600);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <a className={`dl is-${stage}`} href={FILE} download onClick={start}>
      <svg className="dl-trace" aria-hidden="true">
        <rect x="1" y="1" rx="11" pathLength="100" />
      </svg>

      <span className="dl-tray" aria-hidden="true">
        <span className="dl-sheet">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>

      <span className="dl-copy">
        <b>{stage === 'done' ? 'Resume saved' : stage === 'busy' ? 'Printing' : 'Resume PDF'}</b>
        <small>
          {stage === 'busy' ? <span ref={percent}>0%</span> : stage === 'done' ? 'Check your downloads' : 'One page, ready to send'}
        </small>
        <span className="dl-rule" aria-hidden="true">
          <em />
        </span>
      </span>

      <span className="dl-mark" aria-hidden="true">
        <HugeiconsIcon icon={stage === 'done' ? Tick02Icon : Download01Icon} size={17} strokeWidth={1.8} />
      </span>

      <span className="dl-tiles" aria-hidden="true">
        {TILES.map((i) => (
          <i key={i} data-l={(i % 4) + 1} style={{ '--a': `${(i / TILES.length) * 360}deg`, '--r': `${58 + (i % 3) * 22}px` } as React.CSSProperties} />
        ))}
      </span>
    </a>
  );
}
