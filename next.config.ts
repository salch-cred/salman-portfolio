import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: { optimizePackageImports: ['@hugeicons/core-free-icons'] },
};

export default config;
