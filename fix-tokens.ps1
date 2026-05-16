$files = Get-ChildItem -Path 'src/pages/safety','src/pages/jobs','src/pages/tech','src/pages/health','src/pages/community','src/pages/profile' -Filter '*.jsx' -Recurse | Where-Object { $_.Name -notmatch 'Home\.jsx$' -and $_.Name -ne 'ActiveSOSPage.jsx' -and $_.Name -ne 'EmergencyContacts.jsx' -and $_.Name -ne 'KnowYourRights.jsx' }

foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    
    # Background tokens
    $c = $c -replace 'bg-\[#fdfcff\]', 'bg-[var(--color-surface)]'
    $c = $c -replace 'bg-white(?=[\s"''])', 'bg-[var(--color-surface-lowest)]'
    
    # Text tokens
    $c = $c -replace 'text-gray-900', 'text-[var(--color-text-primary)]'
    $c = $c -replace 'text-gray-700(?![\d])', 'text-[var(--color-text-primary)]'
    $c = $c -replace 'text-gray-600', 'text-[var(--color-text-secondary)]'
    $c = $c -replace 'text-gray-500(?!/)', 'text-[var(--color-text-secondary)]'
    $c = $c -replace 'text-gray-400', 'text-[var(--color-outline)]'
    
    # Border tokens  
    $c = $c -replace 'border-gray-100', 'border-[var(--color-surface-highlight)]'
    $c = $c -replace 'border-gray-200', 'border-[var(--color-surface-highlight)]'
    
    # Surface tokens
    $c = $c -replace 'bg-gray-50(?=[\s"''])', 'bg-[var(--color-surface-low)]'
    $c = $c -replace 'bg-gray-900', 'bg-[var(--color-text-primary)]'
    $c = $c -replace 'hover:bg-gray-50', 'hover:bg-[var(--color-surface-low)]'
    $c = $c -replace 'hover:bg-gray-800', 'hover:opacity-90'
    
    # Shadow standardization
    $c = $c -replace 'shadow-\[0_10px_30px_rgba\(109,40,217,0\.06\)\]', 'shadow-[0_4px_24px_rgba(0,0,0,0.04)]'
    
    Set-Content -Path $f.FullName -Value $c -NoNewline
    Write-Output "Updated: $($f.Name)"
}
