$files = Get-ChildItem -Path 'src/pages' -Filter '*.jsx' -Recurse | Where-Object { $_.Name -notmatch 'Home\.jsx$' -and $_.Name -ne 'ActiveSOSPage.jsx' -and $_.Name -ne 'EmergencyContacts.jsx' -and $_.Name -ne 'KnowYourRights.jsx' }

foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    
    # Catch all gray tokens
    $c = $c -replace 'text-gray-900', 'text-[var(--color-text-primary)]'
    $c = $c -replace 'text-gray-800', 'text-[var(--color-text-primary)]'
    $c = $c -replace 'text-gray-700', 'text-[var(--color-text-primary)]'
    $c = $c -replace 'text-gray-600', 'text-[var(--color-text-secondary)]'
    $c = $c -replace 'text-gray-500', 'text-[var(--color-text-secondary)]'
    $c = $c -replace 'text-gray-400', 'text-[var(--color-outline)]'
    $c = $c -replace 'text-gray-300', 'text-[var(--color-outline)]'
    
    $c = $c -replace 'bg-gray-50', 'bg-[var(--color-surface-low)]'
    $c = $c -replace 'bg-gray-100', 'bg-[var(--color-surface-highlight)]'
    $c = $c -replace 'bg-gray-200', 'bg-[var(--color-surface-highlight)]'
    $c = $c -replace 'bg-gray-900', 'bg-[var(--color-text-primary)]'
    
    $c = $c -replace 'border-gray-100', 'border-[var(--color-surface-highlight)]'
    $c = $c -replace 'border-gray-200', 'border-[var(--color-surface-highlight)]'
    $c = $c -replace 'border-gray-300', 'border-[var(--color-outline)]'
    
    $c = $c -replace 'hover:bg-gray-50', 'hover:bg-[var(--color-surface-low)]'
    $c = $c -replace 'hover:bg-gray-100', 'hover:bg-[var(--color-surface-low)]'
    
    Set-Content -Path $f.FullName -Value $c -NoNewline
}
Write-Output "Done"
