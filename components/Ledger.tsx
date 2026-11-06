'use client';

import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitCommitIcon, GitMergeIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import type { Credit, GitHubData, Rank } from '@/lib/github-fetch';

type Filter = 'all' | Credit['kind'];
const ICON = { merged: GitMergeIcon, authored: GitCommitIcon, 'co-authored': UserGroupIcon };
const FILTERS: Filter[] = ['all', 'merged', 'authored', 'co-authored'];

export default function Ledger({ data }: { data: GitHubData }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [rank, setRank] = useState<Rank | null>(data.rank);

  // The rank is read on every page load, separately from the hourly page cache.
  useEffect(() => {
    let live = true;
    fetch('/api/rank')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => live && j?.rank && setRank(j.rank))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const rows = data.credits.filter((c) => filter === 'all' || c.kind === filter);
  const count = (f: Filter) => (f === 'all' ? data.credits.length : data.credits.filter((c) => c.kind === f).length);
  const formula = filter === 'all' ? '=COUNTA(hermes_agent.credits)' : `=COUNTIF(kind,"${filter}")`;

  return (
    <div className="sheet rise">
      <dl className="tally">
        <div className="tally-rank">
          <dt>Contributor rank</dt>
          <dd>{rank ? `#${rank.place}` : 'n/a'}</dd>
        </div>
        <div>
          <dt>Commits on main</dt>
          <dd>{data.totals.commits}</dd>
        </div>
        <div>
          <dt>Authored</dt>
          <dd>{data.totals.authored}</dd>
        </div>
        <div>
          <dt>Co-authored</dt>
          <dd>{data.totals.coAuthored}</dd>
        </div>
        <div>
          <dt>Merged PRs</dt>
          <dd>{data.totals.merged}</dd>
        </div>
      </dl>

      <div className="sheet-bar">
        <span className="sheet-cell">A1</span>
        <span className="sheet-fx">fx</span>
        <code>{formula}</code>
        <output>{rows.length}</output>
      </div>

      <div className="sheet-tools">
        <div className="sheet-states" role="group" aria-label="Filter credits">
          {FILTERS.map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f} <small>{count(f)}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="sheet-scroll" data-lenis-prevent>
        <table>
          <thead>
            <tr>
              <th />
              <th>A &nbsp;credit</th>
              <th>B &nbsp;ref</th>
              <th>C &nbsp;change</th>
              <th>D &nbsp;date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.kind + c.id}>
                <td>{i + 1}</td>
                <td>
                  <span className={`st st-${c.kind}`}>
                    <HugeiconsIcon icon={ICON[c.kind]} size={13} strokeWidth={1.8} />
                    {c.kind}
                  </span>
                </td>
                <td>{c.id}</td>
                <td>
                  <a href={c.u} target="_blank" rel="noreferrer">
                    {c.m}
                  </a>
                </td>
                <td>{c.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
