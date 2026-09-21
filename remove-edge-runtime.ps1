$files = Get-ChildItem -Path 'src\app' -Recurse -Include 'page.tsx','route.ts'
foreach ($f in $files) {
    $path = $f.FullName
    $content = [System.IO.File]::ReadAllText($path)
    if ($content -match "export const runtime = 'edge';") {
        $newContent = $content -replace "export const runtime = 'edge';\r?\n", ''
        [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Output "REMOVED: $path"
    }
}
Write-Output "=== Done ==="
