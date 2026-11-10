// One source for the /resume page and the PDF. Single column, standard headings, plain text.
export const RESUME = {
  name: 'Mahammad Salman',
  title: 'AI/ML Engineer | Full-Stack Developer',
  contact: [
    'Mangaluru, India',
    'salmanchamumu@gmail.com',
    'github.com/salch-cred',
    'x.com/salmanch_',
    'paymateagent.xyz',
  ],
  summary:
    'AI/ML and full-stack engineer building agent infrastructure: settlement rails, permission layers and reliability work for long-running systems. Upstream contributor to Nous Research Hermes Agent across the gateway, tool execution, state and desktop layers. MCA candidate in AI/ML Engineering and Data Science. Ships Python and TypeScript systems from model integration to production deployment.',
  skills: [
    ['Languages', 'Python, TypeScript, JavaScript, SQL, Solidity, Move, Rust, Bash'],
    [
      'AI and Machine Learning',
      'PyTorch, TensorFlow, scikit-learn, pandas, NumPy, Hugging Face, LlamaIndex, RAG, LLM evaluation, feature engineering, data analysis',
    ],
    ['AI Agents', 'Model Context Protocol (MCP), Agent Client Protocol (ACP), x402, tool calling, memory stores, sandboxes'],
    ['Web Development', 'React, Next.js, Node.js, FastAPI, Flask, Express, GraphQL, tRPC, REST APIs, WebSockets, Tailwind CSS'],
    [
      'Data and Cloud',
      'PostgreSQL, Redis, SQLite, MongoDB, pgvector, ClickHouse, Docker, GitHub Actions, Vercel, Cloudflare Workers, Linux, Terraform',
    ],
    ['Web3', 'Hardhat, Foundry, viem, wagmi, EVM, ERC-8004, ERC-7857'],
    ['Testing', 'Pytest, Vitest, Playwright'],
  ],
  experience: [
    {
      role: 'Open Source Contributor',
      org: 'Nous Research, Hermes Agent',
      meta: 'Remote | Jul 2026 - Present',
      bullets: [
        '{commits} commit credits on the main branch of Hermes Agent (260k+ GitHub stars): {authored} authored and {coAuthored} co-authored, plus {merged} merged pull requests across Hermes Agent and its plugin repositories.',
        'Hardened gateway lifecycle in Python: durable startup-failure stamps, unprovable-ownership handling for restart loops, and liveness probe diagnostics.',
        'Bounded tool availability probes so a wedged check cannot hang an agent turn, and scoped git force-push approval patterns to the command segment.',
        'Improved SQLite state and cron reliability, including stable tool identity for display rows and failure stamps that keep healed runs visible.',
        'Published 10 standalone Hermes skills for monitoring and digests, covering TLS expiry, disk, public IP, releases and system vitals.',
      ],
    },
  ],
  projects: [
    {
      name: 'PayMate',
      tech: 'Next.js, TypeScript, Solidity, x402, PostgreSQL, Mistral',
      bullets: [
        'Built non-custodial USDC invoicing and x402 pay-per-use billing for AI agents, live on GOAT mainnet with on-chain settlement verification.',
        'Shipped escrow contracts, ERC-8004 reputation credentials, LLM dispute arbitration and a replay-guarded, idempotent relayer ledger.',
      ],
    },
    {
      name: 'MediVault',
      tech: 'TypeScript, Solidity, 0G, ERC-7857',
      bullets: ['Built a private AI health vault with client-side encryption and ERC-7857 records, with a live mainnet contract.'],
    },
    {
      name: 'GenLayer Adjudication Protocols',
      tech: 'GenLayer, TypeScript, LLM consensus',
      bullets: [
        'Shipped four protocols (Veritas, PolicyCourt, AeroSure, AgentPassport) that run LLM consensus inside contracts for fact-checking, disputes, insurance and bounties.',
      ],
    },
    {
      name: 'Cat Wallet',
      tech: 'Next.js, TypeScript, Solidity, Hardhat',
      bullets: ['Built a Telegram-native wallet with onboarding, swaps, staking and payments, including the contracts and liquidity pools behind it.'],
    },
    {
      name: 'Client Systems',
      tech: 'Next.js, TypeScript, PostgreSQL',
      bullets: [
        'Delivered production software for two businesses: a travel company website, ERP and desktop billing app, and a hardware store site, admin console and billing POS.',
      ],
    },
  ],
  education: [
    {
      degree: 'Master of Computer Applications (MCA), AI/ML Engineering and Data Science',
      school: 'Yenepoya University',
      meta: 'In progress. Also studying robotics basics.',
    },
    {
      degree: 'Bachelor of Computer Applications (BCA), Software Development and Web Design',
      school: 'Srinivas University',
      meta: 'Completed',
    },
  ],
};

type Totals = { commits: number; authored: number; coAuthored: number; merged: number; pluginsMerged: number };

/** Fills the {placeholders} with the GitHub totals, so the numbers refresh with the daily data. */
export function resumeWith(t: Totals): typeof RESUME {
  const values: Record<string, number> = { ...t, merged: t.merged + t.pluginsMerged };
  return JSON.parse(JSON.stringify(RESUME).replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : m)));
}
