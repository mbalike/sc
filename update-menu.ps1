# Update all HTML files with reordered itineraries and enhanced active highlighting

$files = Get-ChildItem -Path "c:\Users\Artisan\Documents\Projects\sc" -Filter "*.html" -File | 
         Where-Object { $_.Name -notin @('itinerary4.html', 'index.html') }

foreach($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # Reorder itineraries dropdown (3, 5, 7, 8 days)
    $content = $content -replace '(<li><a href="itinerary1\.html">5-Day Essence</a></li>[\s\S]*?<li><a href="itinerary2\.html">3-Day Chic Escape</a></li>[\s\S]*?<li><a href="itinerary3\.html">8-Day Zanzibar Luxe</a></li>[\s\S]*?<li><a href="itinerary4\.html">7-Day Kilimanjaro</a></li>)', '<li><a href="itinerary2.html">3-Day Chic Escape</a></li>
              <li><a href="itinerary1.html">5-Day Essence</a></li>
              <li><a href="itinerary4.html">7-Day Kilimanjaro</a></li>
              <li><a href="itinerary3.html">8-Day Zanzibar Luxe</a></li>'
    
    # Enhanced active link highlighting with parent menu support
    $oldScript = @'
    // Active link highlighting (auto-detect by URL)
    (function(){
      const path = location.pathname.split('/').pop() || 'index.html';
      const links = document.querySelectorAll('nav a[href]');
      links.forEach(a=>{
        const href=a.getAttribute('href');
        if(href===path){ a.setAttribute('aria-current','page'); }
      });
    })();
'@

    $newScript = @'
    // Active link highlighting (auto-detect by URL)
    (function(){
      const path = location.pathname.split('/').pop() || 'index.html';
      const links = document.querySelectorAll('nav a[href]');
      links.forEach(a=>{
        const href=a.getAttribute('href');
        if(href===path){ a.setAttribute('aria-current','page'); }
      });
      // Highlight parent menu item when child page is active
      const activeSubmenuLink = document.querySelector('nav li.has-submenu .submenu a[aria-current="page"]');
      if(activeSubmenuLink){
        const parentMenuItem = activeSubmenuLink.closest('li.has-submenu');
        if(parentMenuItem){
          const parentLink = parentMenuItem.querySelector(':scope > a');
          if(parentLink) parentLink.setAttribute('aria-current','page');
        }
      }
    })();
'@

    $content = $content -replace [regex]::Escape($oldScript), $newScript
    
    Set-Content $file.FullName -Value $content -NoNewline
}

Write-Host "`nUpdated $($files.Count) files successfully!"
