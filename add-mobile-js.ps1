# PowerShell script to add mobile enhancement JavaScript to all HTML files

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -File
$jsScript = '  <script src="assets/css/mobile-enhancements.js" defer></script>'

Write-Host "Adding mobile enhancement JS to HTML files..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if mobile-enhancements.js is already included
    if ($content -notmatch "mobile-enhancements\.js") {
        # Add before closing </body> tag
        if ($content -match '</body>') {
            $content = $content -replace '(</body>)', "$jsScript`n`$1"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        }
        else {
            Write-Host "  Skipped: $($file.Name) - no body tag found" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  Already has mobile JS: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Done! Mobile enhancement JavaScript added to all pages." -ForegroundColor Cyan
