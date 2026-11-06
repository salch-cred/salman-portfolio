import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowUpRight01Icon,
  Download01Icon,
  GithubIcon,
  Mail01Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import Boot from '@/components/Boot';
import Lanyard from '@/components/Lanyard';
import Heatmap from '@/components/Heatmap';
import Ledger from '@/components/Ledger';
import Folders from '@/components/Folders';
import Pinboard from '@/components/Pinboard';
import Fig from '@/components/Fig';
import FooterMark from '@/components/FooterMark';
import Flow from '@/components/Flow';
import Deco from '@/components/Deco';
import { getGitHub } from '@/lib/github';
import { EDUCATION, PERSON, STACK } from '@/lib/profile';

export const revalidate = 3600;

const TAPE = ['Agent infrastructure', 'Settlement rails', 'Permission layers', 'Hermes Agent', 'Robotics basics', 'Reliability work'];

function Tape({ alt }: { alt?: boolean }) {
  return (
    <div className={`tape${alt ? ' alt' : ''}`} aria-hidden="true">
      <div>
        {[0, 1, 2, 3].map((n) => (
          <span key={n}>
            {TAPE.map((t) => (
              <b key={t}>
                {t}
                <i />
              </b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const gh = await getGitHub();
  const last = gh.years[0];
  const barcode = last.days.slice(-72).map((d) => d.c);
  // The intro's closing wipe is built from the last 180 days of real activity.
  const tiles = last.days.slice(-180).map((d) => (!d.c ? 1 : d.c < 4 ? 2 : d.c < 12 ? 3 : 4));

  return (
    <>
      <Boot total={last.total} commits={gh.totals.commits} rank={gh.rank?.place ?? null} tiles={tiles} />
      <Flow />

      <nav className="nav">
        <a href="#top" className="nav-prompt">
          salman<span>@</span>portfolio <i>~ %</i>
          <b className="caret" />
        </a>
        <div className="nav-links">
          <a href="#work">work</a>
          <a href="#record">record</a>
          <a href="#credits">credits</a>
          <a href="/resume">resume</a>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <p className="hero-l">
            I build the machinery under agents: settlement rails, permission layers, and the parts that
            have to hold when nobody is watching.
          </p>
          <p className="hero-r">
            Currently MCA in AI/ML &amp; Data Science
            <br />
            @ Yenepoya University
            <br />
            Studying robotics basics
          </p>
          <h1 className="hero-name" aria-label={PERSON.name}>
            {'Salman'.split('').map((ch, i) => (
              <span key={i} aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </h1>
          <svg className="stamp" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="stamp-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
            </defs>
            <circle cx="60" cy="60" r="57" />
            <circle cx="60" cy="60" r="32" />
            <text>
              <textPath href="#stamp-ring" textLength="272">M. SALMAN / MANGALURU / AI + ML / ROBOTICS /</textPath>
            </text>
            <path d="M48 53l11 7-11 7M63 69h11" />
          </svg>
          <Lanyard barcode={barcode} commits={gh.totals.commits} />
          <p className="hero-hint">drag the card. click to flip it.</p>
        </section>

        <Tape />

        <section id="work" className="sec">
          <Fig n={2} label="Case files" />
          <Deco name="floppy" />
          <h2 className="sec-title">Six files worth opening.</h2>
          <Folders />
        </section>

        <section id="record" className="sec">
          <Fig n={3} label="Contribution record" />
          <Heatmap years={gh.years} fetchedAt={gh.fetchedAt} />
        </section>

        <section id="credits" className="sec">
          <Fig n={4} label="Hermes Agent credits" />
          <Deco name="keycap" />
          <h2 className="sec-title">
            Credited in <em>Hermes Agent.</em>
          </h2>
          <Ledger data={gh} />
        </section>

        <Tape alt />

        <section id="bench" className="sec">
          <Fig n={5} label="Workbench" />
          <Deco name="mug" />
          <h2 className="sec-title">Smaller builds, pinned up.</h2>
          <Pinboard />
        </section>

        <section className="sec two">
          <div>
            <Fig n={6} label="Parts list" />
            <table className="bom">
              <tbody>
                {STACK.map(([k, v], i) => (
                  <tr key={k}>
                    <td>{String(i + 1).padStart(2, '0')}</td>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Fig n={7} label="Training" />
            <ul className="edu">
              {EDUCATION.map((e) => (
                <li key={e.school}>
                  <span>{e.status}</span>
                  <h3>{e.school}</h3>
                  <p>
                    {e.degree}
                    <br />
                    {e.focus}
                  </p>
                </li>
              ))}
            </ul>
            <div className="resume-cta">
              <a href="/Mahammad-Salman-Resume.pdf" download className="btn">
                <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.6} />
                Resume PDF
              </a>
              <a href="/resume" className="btn ghost">
                Read it here
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <Deco name="server" />
        <p className="foot-lead">
          Open to work on agent infrastructure, settlement and adjudication, and hard reliability
          problems in long-running systems.
        </p>
        <div className="foot-links">
          <a href={`mailto:${PERSON.email}`}>
            <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={1.5} />
            {PERSON.email}
          </a>
          <a href={PERSON.github} rel="noreferrer" target="_blank">
            <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.5} />
            GitHub
          </a>
          <a href={PERSON.x} rel="noreferrer" target="_blank">
            <HugeiconsIcon icon={NewTwitterIcon} size={18} strokeWidth={1.5} />
            X
          </a>
        </div>
        <FooterMark text="Let's build" />
      </footer>
    </>
  );
}
