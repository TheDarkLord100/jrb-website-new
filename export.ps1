# clean-export.ps1
# Removes Next.js's client-side prefetch payload files (__next.*.txt) from
# the static export, and any directories left empty as a result. This
# eliminates the directory/file name collisions (e.g. about/ vs about.html)
# that were causing Apache's automatic trailing-slash redirects to misfire.

$outDir = Join-Path $PSScriptRoot "out"

if (-not (Test-Path $outDir)) {
    Write-Error "No 'out' folder found at $outDir — run 'npm run build' first."
    exit 1
}

Set-Location $outDir

Write-Host "Removing __next.* prefetch files..."
Get-ChildItem -Recurse -File -Filter "__next.*" | Remove-Item -Force

Write-Host "Removing directories left empty..."
do {
    $emptyDirs = Get-ChildItem -Recurse -Directory | Where-Object {
        (Get-ChildItem $_.FullName -Force | Measure-Object).Count -eq 0
    }
    $emptyDirs | Remove-Item -Force
} while ($emptyDirs.Count -gt 0)

Write-Host "Done. 'out' is ready to upload."