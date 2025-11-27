# PowerShell script to add responsive CSS link to all HTML files
# Safari Chic - Mobile Optimization

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -File
$responsiveCssLink = '  <link rel="stylesheet" href="assets/css/responsive.css">'
$insertAfter = 'assets/css/header-footer.css'

Write-Host "Adding responsive CSS to HTML files..." -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if responsive.css is already included
    if ($content -notmatch "responsive\.css") {
        # Find the position after header-footer.css or overrides.css
        if ($content -match 'assets/css/header-footer\.css["\s]*>') {
            $content = $content -replace '(assets/css/header-footer\.css["\s]*>)', "`$1`n$responsiveCssLink"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        }
        elseif ($content -match 'assets/css/overrides\.css["\s]*>') {
            $content = $content -replace '(assets/css/overrides\.css["\s]*>)', "`$1`n$responsiveCssLink"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        }
        else {
            Write-Host "  Skipped: $($file.Name) - no CSS link found" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  Already has responsive.css: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Done! All HTML files have been updated." -ForegroundColor Cyan
