$files = Get-ChildItem -Path 'src\app' -Recurse -Include 'page.tsx','route.ts'
foreach ($f in $files) {
    $path = $f.FullName
    $content = [System.IO.File]::ReadAllText($path)
    if ($content -match "getDB\(\)|getR2\(\)|getEnv\(\)|getCloudflareContext") {
        if ($content -notmatch "export const dynamic") {
            if ($content -match "'use client';") {
                $newContent = $content -replace "'use client';", "'use client';`nexport const dynamic = 'force-dynamic';"
            } else {
                $newContent = "export const dynamic = 'force-dynamic';`n" + $content
            }
            [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
            Write-Output "ADDED: $path"
        } else {
            Write-Output "SKIP (already has dynamic): $path"
        }
    }
}
Write-Output "=== Done ==="
