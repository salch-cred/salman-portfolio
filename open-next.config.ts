import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';

// KV holds the hourly page refresh, so the graph stays current on Workers.
export default defineCloudflareConfig({ incrementalCache: kvIncrementalCache });
