// All GitHub reads live here. Runs on the server only, so the token never reaches the browser.
export type Day = { d: string; c: number };
export type Year = { key: string; label: string; total: number; days: Day[] };
export type Credit = {
  kind: 'merged' | 'authored' | 'co-authored';
  id: string;
  m: string;
  u: string;
  d: string;
};
export type Rank = { place: number; contributions: number };
export type GitHubData = {
  fetchedAt: string;
  login: string;
  years: Year[];
  credits: Credit[];
  rank: Rank | null;
  totals: { commits: number; authored: number; coAuthored: number; merged: number };
};

export const LOGIN = 'salch-cred';
export const HERMES = 'NousResearch/hermes-agent';
type Init = Record<string, unknown>;

const gitHubHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'User-Agent': 'portfolio',
  'Content-Type': 'application/json',
});

/** Place on the repository's contributor list, which GitHub orders by commits on the default branch. */
export async function fetchRank(token: string, init: Init = {}): Promise<Rank | null> {
  const me = LOGIN.toLowerCase();
  let seen = 0;
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${HERMES}/contributors?per_page=100&page=${page}`;
    const res = await fetch(url, { headers: gitHubHeaders(token), ...init });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const list: { login?: string; contributions: number }[] = await res.json();
    for (const c of list) {
      seen++;
      if (c.login?.toLowerCase() === me) return { place: seen, contributions: c.contributions };
    }
    if (list.length < 100) break;
  }
  return null;
}

export async function fetchGitHub(token: string, init: Init = {}): Promise<GitHubData> {
  const headers = gitHubHeaders(token);

  async function gql(query: string, variables: object = {}) {
    // GitHub's search-backed GraphQL answers 502 now and then, so give it a few tries.
    for (let attempt = 0; ; attempt++) {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        ...init,
      });
      if (res.status >= 500 && attempt < 3) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message ?? 'GitHub GraphQL error');
      return json.data;
    }
  }

  // Contribution calendars: the rolling year, then each calendar year since joining.
  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const yearList: number[] = [];
  for (let y = thisYear; y >= 2023; y--) yearList.push(y);
  const yearFields = yearList
    .map((y) => {
      const to = y === thisYear ? now.toISOString() : `${y}-12-31T23:59:59Z`;
      return `y${y}: contributionsCollection(from:"${y}-01-01T00:00:00Z", to:"${to}"){ ...cal }`;
    })
    .join('\n');
  const cal = await gql(
    `query($l:String!){ user(login:$l){ last: contributionsCollection { ...cal } ${yearFields} } }
     fragment cal on ContributionsCollection {
       contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
     }`,
    { l: LOGIN },
  );
  const toYear = (key: string, label: string): Year => {
    const c = cal.user[key].contributionCalendar;
    return {
      key,
      label,
      total: c.totalContributions,
      days: c.weeks.flatMap((w: any) =>
        w.contributionDays.map((x: any) => ({ d: x.date, c: x.contributionCount })),
      ),
    };
  };
  const years = [toYear('last', 'Last year'), ...yearList.map((y) => toYear(`y${y}`, String(y))).filter((y) => y.total > 0)];

  const credits: Credit[] = [];

  // Merged pull requests in Hermes Agent.
  const merged = await gql(
    `query($q:String!){ search(query:$q, type:ISSUE, first:100){ nodes { ... on PullRequest {
      title url number mergedAt
    } } } }`,
    { q: `is:pr is:merged author:${LOGIN} repo:${HERMES}` },
  );
  for (const p of merged.search.nodes) {
    credits.push({ kind: 'merged', id: `#${p.number}`, m: p.title, u: p.url, d: p.mergedAt.slice(0, 10) });
  }

  // Commit search only indexes the default branch, so everything here is on main.
  async function searchCommits(q: string) {
    const url = `https://api.github.com/search/commits?q=${encodeURIComponent(q)}&sort=author-date&order=desc&per_page=100`;
    const res = await fetch(url, { headers, ...init });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    return (await res.json()).items ?? [];
  }
  const toCredit = (kind: Credit['kind'], c: any): Credit => ({
    kind,
    id: c.sha.slice(0, 7),
    m: c.commit.message.split('\n')[0],
    u: c.html_url,
    d: c.commit.author.date.slice(0, 10),
  });

  const authored = await searchCommits(`repo:${HERMES} author:${LOGIN}`);
  const seen = new Set<string>(authored.map((c: any) => c.sha));
  for (const c of authored) credits.push(toCredit('authored', c));

  // The trailer check drops commits that merely mention the login in their text.
  const trailer = new RegExp(`co-authored-by:[^\\n]*${LOGIN}`, 'i');
  const coAuthored = (await searchCommits(`repo:${HERMES} "Co-authored-by" ${LOGIN}`)).filter(
    (c: any) => !seen.has(c.sha) && trailer.test(c.commit.message),
  );
  for (const c of coAuthored) credits.push(toCredit('co-authored', c));

  credits.sort((a, b) => b.d.localeCompare(a.d));

  return {
    fetchedAt: now.toISOString(),
    login: LOGIN,
    years,
    credits,
    rank: await fetchRank(token, init),
    totals: {
      commits: authored.length + coAuthored.length,
      authored: authored.length,
      coAuthored: coAuthored.length,
      merged: merged.search.nodes.length,
    },
  };
}
