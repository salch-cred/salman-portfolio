import { NextResponse } from 'next/server';
import { fetchRank } from '@/lib/github-fetch';

// Pages ask for this on every load. A minute of cache keeps a busy day inside GitHub's rate limit.
const TTL = 60;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ rank: null }, { status: 503 });
  try {
    const rank = await fetchRank(token, { next: { revalidate: TTL } });
    return NextResponse.json(
      { rank },
      { headers: { 'Cache-Control': `public, s-maxage=${TTL}, stale-while-revalidate=${TTL}` } },
    );
  } catch {
    return NextResponse.json({ rank: null }, { status: 502 });
  }
}
