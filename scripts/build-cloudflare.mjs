// OpenNext copies .env files into the Worker bundle, so they are moved aside for the build.
// On Cloudflare the token comes from a secret: wrangler secret put GITHUB_TOKEN
import { existsSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const moved = ['.env', '.env.local', '.env.production', '.env.production.local'].filter(existsSync);
for (const f of moved) renameSync(f, `${f}.aside`);
let status = 1;
try {
  status = spawnSync('npx opennextjs-cloudflare build', { stdio: 'inherit', shell: true }).status ?? 1;
} finally {
  for (const f of moved) renameSync(`${f}.aside`, f);
}
process.exit(status);
