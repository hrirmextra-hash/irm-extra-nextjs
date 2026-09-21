$files = Get-ChildItem -Path 'src\app\admin','src\app\api' -Recurse -Include 'page.tsx','route.ts'
foreach ($f in $files) {
    $path = $f.FullName
    $content = [System.IO.File]::ReadAllText($path)
    if ($content.Length -eq 0) {
        Write-Output "SKIP (empty file, not touching): $path"
        continue
    }
    if ($content -notmatch "runtime = 'edge'") {
        if ($content -match "'use client';") {
            $newContent = $content -replace "'use client';", "'use client';`nexport const runtime = 'edge';"
        } else {
            $newContent = "export const runtime = 'edge';`n" + $content
        }
        [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Output "FIXED: $path"
    } else {
        Write-Output "OK (already has edge): $path"
    }
}
Write-Output "Done."
