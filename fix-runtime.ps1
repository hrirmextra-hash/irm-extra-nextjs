$files = Get-ChildItem -Path 'src\app\admin','src\app\api' -Recurse -Include 'page.tsx','route.ts'
$missing = @()
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if ($content -notmatch "runtime = 'edge'") {
        $missing += $f.FullName
        if ($content -match "'use client';") {
            $newContent = $content -replace "'use client';", "'use client';`nexport const runtime = 'edge';"
        } else {
            $newContent = "export const runtime = 'edge';`n" + $content
        }
        Set-Content -LiteralPath $f.FullName -Value $newContent -Encoding utf8
        Write-Output "FIXED: $($f.FullName)"
    }
}
if ($missing.Count -eq 0) {
    Write-Output "All files already have runtime = 'edge'"
}
