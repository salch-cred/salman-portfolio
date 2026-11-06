import { writeFileSync } from 'node:fs';
import { fetchGitHub } from '../lib/github-fetch.ts';

const data = await fetchGitHub(process.env.GITHUB_TOKEN!);
writeFileSync('data/snapshot.json', JSON.stringify(data));
console.log(
  data.totals,
  data.years.map((y) => `${y.label}:${y.total}`).join(' '),
  data.rank,
);
