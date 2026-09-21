$content = @'
import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getDB(): D1Database {
  const { env } = getCloudflareContext();
  if (!env.DB) throw new Error('D1 database binding (DB) is not configured.');
  return env.DB;
}
export function getR2(): R2Bucket {
  const { env } = getCloudflareContext();
  if (!env.BUCKET) throw new Error('R2 bucket binding (BUCKET) is not configured.');
  return env.BUCKET;
}
export function getEnv(): Env {
  const { env } = getCloudflareContext();
  return env;
}
'@

[System.IO.File]::WriteAllText("$PSScriptRoot\src\lib\db.ts", $content, [System.Text.Encoding]::UTF8)
Write-Output "Done. New file content:"
Write-Output "---"
Get-Content "$PSScriptRoot\src\lib\db.ts"
Write-Output "---"
$size = (Get-Item "$PSScriptRoot\src\lib\db.ts").Length
Write-Output "File size: $size bytes"
