# PowerShell script to fix mobile menu conflicts across all HTML files
# This script comments out inline burger menu scripts that conflict with mobile-enhancements.js

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Exclude "mobile-test.html","footer.html","mobile-demo.html"

$patterns = @(
    # Pattern 1: Simple inline burger script
    @{
        Old = 'const burger=document.querySelector(''.hamburger'');const menu=document.getElementById(''menu'');burger?.addEventListener(''click'',()=>{const open=menu.classList.toggle(''show'');burger.setAttribute(''aria-expanded'',String(open));});'
        New = '/* Mobile menu handled by mobile-enhancements.js */ // const burger=document.querySelector(''.hamburger'');const menu=document.getElementById(''menu'');burger?.addEventListener(''click'',()=>{const open=menu.classList.toggle(''show'');burger.setAttribute(''aria-expanded'',String(open));});'
    },
    # Pattern 2: With line breaks
    @{
        Old = 'const burger=document.querySelector(''.hamburger''); const menu=document.getElementById(''menu''); burger?.addEventListener(''click'',()=>{ const open=menu.classList.toggle(''show''); burger.setAttribute(''aria-expanded'', String(open)); });'
        New = '/* Mobile menu handled by mobile-enhancements.js */ // const burger=document.querySelector(''.hamburger''); const menu=document.getElementById(''menu''); burger?.addEventListener(''click'',()=>{ const open=menu.classList.toggle(''show''); burger.setAttribute(''aria-expanded'', String(open)); });'
    },
    # Pattern 3: Multi-line version
    @{
        Old = @'
    const burger=document.querySelector('.hamburger');
    const menu=document.getElementById('menu');
    burger?.addEventListener('click',()=>{
      const open=menu.classList.toggle('show');
      burger.setAttribute('aria-expanded', String(open));
    });
'@
        New = @'
    /* Mobile menu handled by mobile-enhancements.js */
    // const burger=document.querySelector('.hamburger');
    // const menu=document.getElementById('menu');
    // burger?.addEventListener('click',()=>{
    //   const open=menu.classList.toggle('show');
    //   burger.setAttribute('aria-expanded', String(open));
    // });
'@
    }
)

$filesModified = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $modified = $false
    
    # Check if file contains burger addEventListener
    if ($content -match "burger.*addEventListener") {
        
        # Try each pattern
        foreach ($pattern in $patterns) {
            if ($content -match [regex]::Escape($pattern.Old)) {
                $content = $content -replace [regex]::Escape($pattern.Old), $pattern.New
                $modified = $true
                Write-Host "  ✓ Pattern matched and replaced" -ForegroundColor Green
                break
            }
        }
        
        # If no exact match, do a general comment-out
        if (-not $modified) {
            # Look for the burger listener and comment it out
            $content = $content -replace '(\s*)(const burger\s*=\s*document\.querySelector)', '$1/* Mobile menu handled by mobile-enhancements.js */$1// $2'
            $content = $content -replace '(\s*)(burger\?\.)addEventListener', '$1// $2addEventListener'
            $modified = $true
            Write-Host "  ✓ General pattern replaced" -ForegroundColor Yellow
        }
    }
    
    if ($modified -and $content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $filesModified++
        Write-Host "  ✓ File saved" -ForegroundColor Green
    } else {
        Write-Host "  - No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "Complete! Modified $filesModified files" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "`nAll pages now use mobile-enhancements.js for menu functionality" -ForegroundColor Cyan
