'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ART, SCREEN, VIEWBOX } from './computer-art';

type Phase = 'draw' | 'dive' | 'term' | 'off' | 'wipe' | 'lift' | 'done';
type Line = { text: string; kind?: 'cmd' | 'dim' | 'ok' };

const HELP = ['open            enter the portfolio', 'open resume     read the resume', 'open work       jump to the case files', 'whoami          who built this', 'ls              what is in here'];

const STEPS = ['plotting chassis', 'cutting keycaps', 'routing cable', 'powering screen'];
const DRAW = 2400;

export default function Boot({ total, commits, rank, tiles }: { total: number; commits: number; rank: number | null; tiles: number[] }) {
  const [phase, setPhase] = useState<Phase>('draw');
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [ready, setReady] = useState(false);
  const touched = useRef(false);
  const leaving = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const step = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  const reveal = useCallback(() => {
    try {
      sessionStorage.setItem('booted', '1');
    } catch {}
    document.documentElement.classList.add('opened');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('portfolio:open'));
  }, []);

  // The screen collapses, the contribution tiles cover the page, then lift off it.
  const leave = useCallback(
    (after?: () => void) => {
      if (leaving.current) return;
      leaving.current = true;
      setPhase('off');
      window.setTimeout(() => setPhase('wipe'), 500);
      window.setTimeout(() => {
        setPhase('lift');
        reveal();
        after?.();
      }, 1140);
      window.setTimeout(() => {
        document.documentElement.classList.add('booted');
        setPhase('done');
      }, 1940);
    },
    [reveal],
  );

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      setLines((l) => [...l, { text: `$ ${raw}`, kind: 'cmd' }]);
      if (cmd === '') return;
      if (cmd === 'open' || cmd === 'open portfolio') return leave();
      if (cmd === 'open resume') return leave(() => (window.location.href = '/resume'));
      if (cmd === 'open work') return leave(() => document.getElementById('work')?.scrollIntoView());
      if (cmd === 'whoami') return setLines((l) => [...l, { text: 'mahammad salman. ai/ml engineer, full-stack developer. studying robotics basics. mangaluru, india.' }]);
      if (cmd === 'ls') return setLines((l) => [...l, { text: 'work/  record/  credits/  bench/  resume.pdf' }]);
      if (cmd === 'help') return setLines((l) => [...l, ...HELP.map((text) => ({ text, kind: 'dim' as const }))]);
      setLines((l) => [...l, { text: `command not found: ${cmd.split(' ')[0]}. try "open" or "help".`, kind: 'dim' }]);
    },
    [leave],
  );

  useEffect(() => {
    if (document.documentElement.classList.contains('booted')) {
      setPhase('done');
      return;
    }
    document.body.style.overflow = 'hidden';
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));

    at(DRAW, () => !leaving.current && setPhase('dive'));
    at(3250, () => !leaving.current && setPhase('term'));

    // Progress follows the drawing, so the number and the line finish together.
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - t0) / DRAW);
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (step.current) step.current.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))];
      if (p < 1) raf = requestAnimationFrame(tick);
    });

    const log: Line[] = [
      { text: 'salman-os 26.11 on tty1', kind: 'dim' },
      { text: 'memory ............................ ok', kind: 'ok' },
      { text: `syncing github .................... ${total.toLocaleString('en-US')} contributions`, kind: 'ok' },
      { text: `reading hermes agent .............. ${commits} commits on main`, kind: 'ok' },
      ...(rank ? [{ text: `contributor rank .................. #${rank}`, kind: 'ok' as const }] : []),
      { text: 'printing id card .................. ok', kind: 'ok' },
      { text: 'type "help", or press enter to open', kind: 'dim' },
    ];
    log.forEach((line, i) => at(3450 + i * 190, () => setLines((l) => [...l, line])));

    const done = 3450 + log.length * 190;
    at(done, () => {
      setReady(true);
      inputRef.current?.focus({ preventScroll: true });
    });

    // Nobody has to do anything. The command types itself unless the visitor starts typing.
    'open'.split('').forEach((_, i) =>
      at(done + 500 + i * 110, () => {
        if (!touched.current) setInput('open'.slice(0, i + 1));
      }),
    );
    at(done + 1300, () => {
      if (!touched.current) run('open');
    });

    return () => {
      ids.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [run, total, commits, rank]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 99999 });
  }, [lines]);

  useEffect(() => {
    if (phase === 'done') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') leave();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, leave]);

  if (phase === 'done') return null;

  return (
    <div className={`boot is-${phase}`} role="dialog" aria-label="Portfolio intro terminal">
      <div className="boot-fig">
        <span>Fig 1</span>
        <span>Desk computer</span>
      </div>
      <div className="marks" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="load" aria-hidden="true">
        <p className="load-n">
          <span ref={pct}>00</span>
        </p>
        <p className="load-step">
          <span ref={step}>{STEPS[0]}</span>
        </p>
        <div className="load-bar">
          <b ref={bar} />
        </div>
      </div>
      <dl className="block" aria-hidden="true">
        <div><dt>Sheet</dt><dd>01 of 07</dd></div>
        <div><dt>Drawn by</dt><dd>M. Salman</dd></div>
        <div><dt>Scale</dt><dd>1 : 1</dd></div>
      </dl>

      <div
        className="machine"
        style={{ '--sx': `${SCREEN.x}%`, '--sy': `${SCREEN.y}%` } as React.CSSProperties}
      >
        <svg viewBox={VIEWBOX} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART }} />
      </div>

      <div className="crt" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div className="crt-glass" ref={scroller} data-lenis-prevent>
          {lines.map((l, i) => (
            <p key={i} className={l.kind ? `t-${l.kind}` : undefined}>
              {l.text}
            </p>
          ))}
          {ready && (
            <form
              className="t-input"
              onSubmit={(e) => {
                e.preventDefault();
                touched.current = true;
                run(input || 'open');
                setInput('');
              }}
            >
              <label htmlFor="term">$</label>
              <input
                id="term"
                ref={inputRef}
                value={input}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(e) => {
                  touched.current = true;
                  setInput(e.target.value);
                }}
              />
              <button type="submit">open ↵</button>
            </form>
          )}
        </div>
      </div>

      <button className="boot-skip" onClick={() => leave()}>
        skip <kbd>esc</kbd>
      </button>

      <div className="tiles" aria-hidden="true">
        {tiles.map((l, i) => {
          const dx = (i % 18) - 8.5;
          const dy = Math.floor(i / 18) - 4.5;
          return <i key={i} data-l={l} style={{ '--d': Math.round(Math.hypot(dx, dy * 1.6) * 28) } as React.CSSProperties} />;
        })}
      </div>
    </div>
  );
}
