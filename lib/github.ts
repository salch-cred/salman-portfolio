import 'server-only';
import { fetchGitHub, type GitHubData } from './github-fetch.ts';
import snapshot from '@/data/snapshot.json';

export const REVALIDATE = 3600;

/** Live data, cached for an hour. The committed snapshot keeps the page up if GitHub or the token fails. */
export async function getGitHub(): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return snapshot as GitHubData;
  try {
    return await fetchGitHub(token, { next: { revalidate: REVALIDATE } });
  } catch (err) {
    console.error('GitHub fetch failed, serving snapshot:', err);
    return snapshot as GitHubData;
  }
}
