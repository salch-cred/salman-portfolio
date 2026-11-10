import type { Metadata } from 'next';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import DownloadResume from '@/components/DownloadResume';
import { resumeWith } from '@/lib/resume';
import snapshot from '@/data/snapshot.json';

export const metadata: Metadata = { title: 'Resume, Mahammad Salman' };

export default function ResumePage() {
  const r = resumeWith(snapshot.totals);
  return (
    <main className="cv-wrap">
      <div className="cv-bar">
        <a href="/" className="btn ghost">
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.6} style={{ transform: 'rotate(-135deg)' }} />
          Back
        </a>
        <DownloadResume />
      </div>

      <article className="cv">
        <h1>{r.name}</h1>
        <p className="cv-title">{r.title}</p>
        <p className="cv-contact">{r.contact.join('  |  ')}</p>

        <h2>Summary</h2>
        <p>{r.summary}</p>

        <h2>Skills</h2>
        <ul className="cv-skills">
          {r.skills.map(([k, v]) => (
            <li key={k}>
              <b>{k}:</b> {v}
            </li>
          ))}
        </ul>

        <h2>Experience</h2>
        {r.experience.map((e) => (
          <section key={e.role}>
            <h3>
              {e.role}, {e.org}
            </h3>
            <p className="cv-meta">{e.meta}</p>
            <ul>
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>Projects</h2>
        {r.projects.map((p) => (
          <section key={p.name}>
            <h3>{p.name}</h3>
            <p className="cv-meta">{p.tech}</p>
            <ul>
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>Education</h2>
        {r.education.map((e) => (
          <section key={e.school}>
            <h3>{e.degree}</h3>
            <p className="cv-meta">
              {[e.school, e.meta].filter(Boolean).join(' | ')}
            </p>
          </section>
        ))}
      </article>
    </main>
  );
}
