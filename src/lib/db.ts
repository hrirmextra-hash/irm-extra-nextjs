import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getDB(): D1Database {
  const env = getCloudflareContext().env as Env;
  if (!env.DB) throw new Error('D1 database binding (DB) is not configured.');
  return env.DB;
}
export function getR2(): R2Bucket {
  const env = getCloudflareContext().env as Env;
  if (!env.BUCKET) throw new Error('R2 bucket binding (BUCKET) is not configured.');
  return env.BUCKET;
}
export function getEnv(): Env {
  return getCloudflareContext().env as Env;
}