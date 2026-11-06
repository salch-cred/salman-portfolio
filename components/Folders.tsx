'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { CASES } from '@/lib/profile';

export default function Folders() {
  const [open, setOpen] = useState(0);

  return (
    <div className="drawer rise">
      {CASES.map((c, i) => {
        const on = i === open;
        return (
          <article
            key={c.id}
            className={`folder${on ? ' on' : ''}`}
            style={{ '--n': i, '--tab': `${(i % 3) * 22 + 2}%` } as React.CSSProperties}
          >
            <button
              className="folder-tab"
              aria-expanded={on}
              aria-controls={`case-${c.id}`}
              onClick={() => setOpen(on ? -1 : i)}
            >
              <span className="folder-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="folder-tag">{c.tag}</span>
            </button>
            <div className="folder-sheet">
              <button className="folder-edge" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(on ? -1 : i)}>
                <span>{c.name}</span>
                <em>{c.line}</em>
              </button>
              <div className="folder-fold" id={`case-${c.id}`}>
                <div className="folder-in">
                  <div className="folder-copy">
                    <p>{c.body}</p>
                    <ul className="folder-stack">
                      {c.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    {c.links.length > 0 && (
                      <div className="folder-links">
                        {c.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            {...(l.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
                          >
                            {l.label}
                            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <ol className="flow" aria-label="How it works">
                    {c.flow.map((f, n) => (
                      <li key={f}>
                        <span>{String.fromCharCode(65 + n)}</span>
                        {f}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
