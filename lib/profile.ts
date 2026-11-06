export const PERSON = {
  name: 'Mahammad Salman',
  short: 'Salman',
  role: 'AI/ML Engineer & Full-Stack Developer',
  location: 'Mangaluru, India',
  email: 'salmanchamumu@gmail.com',
  github: 'https://github.com/salch-cred',
  x: 'https://x.com/salmanch_',
  site: 'https://www.paymateagent.xyz',
};

export const EDUCATION = [
  {
    degree: 'Master of Computer Applications (MCA)',
    focus: 'AI/ML Engineering and Data Science',
    school: 'Yenepoya University',
    status: 'In progress',
  },
  {
    degree: 'Fundamentals',
    focus: '',
    school: 'Robotics Basics',
    status: 'Currently studying',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    focus: 'Software Development and Web Design',
    school: 'Srinivas University',
    status: 'Completed',
  },
];

export type CaseFile = {
  id: string;
  name: string;
  tag: string;
  line: string;
  body: string;
  flow: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

const gh = (r: string) => `${PERSON.github}/${r}`;

export const CASES: CaseFile[] = [
  {
    id: 'paymate',
    name: 'PayMate',
    tag: 'Live on GOAT mainnet',
    line: 'The billing rail for the agent economy.',
    body: 'Agents can write code. They cannot collect money. A freelancer or an agent opens an invoice or a paywalled endpoint, the client settles in USDC straight to their wallet, and each settlement mints a portable reputation credential. Bridge and DEX paths ship fail-closed until a real-money probe passes.',
    flow: ['Invoice or x402 challenge', 'USDC settles to wallet', 'Verified on-chain', 'ERC-8004 credential minted'],
    stack: ['Next.js', 'TypeScript', 'Solidity', 'x402', 'Postgres', 'Mistral'],
    links: [
      { label: 'Live', href: PERSON.site },
      { label: 'Source', href: gh('paymate-new-') },
      { label: 'Docs', href: `${PERSON.site}/docs` },
    ],
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    tag: 'Upstream contributor',
    line: 'Failure modes in a long-running agent runtime.',
    body: 'I work where agents break when nobody is watching: a gateway that will not release a stale PID, a wedged availability probe that hangs a turn, a WAL generation unlinked by a short-lived reader. Surfaces touched include the TUI, gateway lifecycle, tool execution, cron, SQLite state, desktop runtimes and channel adapters.',
    flow: ['Reproduce the failure', 'Write the failing test', 'Patch the lifecycle', 'Upstream the fix'],
    stack: ['Python', 'SQLite', 'MCP', 'ACP', 'TypeScript'],
    links: [
      { label: 'Repository', href: 'https://github.com/NousResearch/hermes-agent' },
      { label: 'See the ledger', href: '#ledger' },
    ],
  },
  {
    id: 'medivault',
    name: 'MediVault',
    tag: 'Live, mainnet contract',
    line: 'A private AI health vault you actually own.',
    body: 'Health records are encrypted on the client before they leave the device, then held as ERC-7857 intelligent NFTs on 0G. The AI layer works over records the owner chooses to unseal.',
    flow: ['Encrypt in the browser', 'Store on 0G', 'Mint ERC-7857 record', 'Unseal for AI'],
    stack: ['TypeScript', '0G', 'Solidity', 'Client-side encryption'],
    links: [
      { label: 'Live', href: 'https://medivault-ecru.vercel.app' },
      { label: 'Source', href: gh('medivault') },
    ],
  },
  {
    id: 'genlayer',
    name: 'GenLayer Courts',
    tag: 'Four protocols',
    line: 'Adjudication contracts that weigh evidence.',
    body: 'Veritas checks facts, PolicyCourt settles policy disputes with bonded objections, AeroSure pays flight insurance from live aviation data, and AgentPassport runs escrowed bounties with on-chain reputation. Each one puts an LLM consensus step inside the contract.',
    flow: ['Evidence submitted', 'Validators run LLMs', 'Consensus verdict', 'Funds released'],
    stack: ['GenLayer', 'TypeScript', 'LLM consensus'],
    links: [
      { label: 'Veritas', href: gh('veritas-genlayer') },
      { label: 'PolicyCourt', href: gh('PolicyCourt') },
      { label: 'AeroSure', href: gh('aerosure-genlayer') },
      { label: 'AgentPassport', href: gh('AgentPassport') },
    ],
  },
  {
    id: 'catwallet',
    name: 'Cat Wallet',
    tag: 'Private repository',
    line: 'A wallet that lives inside the chat.',
    body: 'Telegram-native onboarding, swaps and payments without leaving the conversation. Built end to end, including the contracts, pools and staking behind it, with reliability work on replica lag and transaction types at the RPC layer.',
    flow: ['Open in Telegram', 'Wallet created', 'Swap or pay in chat', 'Settled on-chain'],
    stack: ['Next.js', 'TypeScript', 'Solidity', 'Hardhat'],
    links: [],
  },
  {
    id: 'clients',
    name: 'Client Systems',
    tag: 'In production',
    line: 'Real businesses, running on software I wrote.',
    body: 'Bahadur Tours runs its site, ERP and desktop billing app on my stack. Shree Shyam Enterprise, a hardware store, runs a storefront, admin console, billing POS and TypeScript backend.',
    flow: ['Storefront', 'Admin console', 'Billing', 'Reporting'],
    stack: ['Next.js', 'TypeScript', 'Postgres'],
    links: [
      { label: 'Bahadur Tours', href: 'https://bahadurroursandtravel.vercel.app' },
      { label: 'Shree Shyam', href: 'https://shreeshyam-enterprise-sable.vercel.app' },
    ],
  },
];

export const SCRAPS = [
  { t: 'HydraSentinel', d: 'npm supply-chain blast radius, walked live.', r: 'hydrasentinel', x: 3, y: 8, a: -3 },
  { t: 'ProvenNode', d: 'Verifiable model lifecycle on Shelby and Aptos Move.', r: 'provenode', x: 27, y: 2, a: 2 },
  { t: 'ShowOnce', d: 'Teach a robot by showing it once.', r: 'showonce', x: 53, y: 9, a: -1.5 },
  { t: 'JanFix', d: 'Civic reporting with zero login and ward routing.', r: 'janfix', x: 77, y: 3, a: 3 },
  { t: 'SnakeCase', d: 'A free 34-lesson Python curriculum.', r: 'snakecase', x: 7, y: 54, a: 2.5 },
  { t: 'Reso', d: 'A zero-knowledge compliance engine.', r: 'reso', x: 30, y: 49, a: -2.5 },
  { t: 'MooveGate', d: 'Agent-to-agent commerce gateway and MCP server.', r: 'moovegate', x: 54, y: 55, a: 1.5 },
  { t: 'Daily Briefing', d: 'One of ten published Hermes skills.', r: 'hermes-daily-briefing', x: 78, y: 50, a: -2 },
];

export const STACK: [string, string][] = [
  ['Languages', 'TypeScript, Python, Solidity, Move, Rust, SQL, Bash'],
  ['AI / ML', 'PyTorch, TensorFlow, scikit-learn, pandas, NumPy, Hugging Face, RAG, LlamaIndex, evals'],
  ['Agents', 'MCP, ACP, x402, tool calling, memory stores, sandboxes, subagents'],
  ['Frontend', 'React, Next.js, Vite, Tailwind, Framer Motion, Three.js, Zustand'],
  ['Backend', 'Node, Fastify, Express, FastAPI, Flask, GraphQL, tRPC, WebSockets, Prisma, Drizzle'],
  ['Data', 'Postgres, Redis, SQLite, MongoDB, pgvector, ClickHouse, Supabase'],
  ['Chains', 'EVM, Hardhat, Foundry, viem, wagmi, GenLayer, 0G, Aptos Move, Stellar Soroban, Zama FHE'],
  ['Infra', 'Docker, GitHub Actions, Vercel, Cloudflare Workers, Linux, Nginx, Terraform, Sentry'],
  ['Testing', 'Vitest, Pytest, Playwright'],
];
