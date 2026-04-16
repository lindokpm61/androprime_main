$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$sourceDir = Join-Path $workspaceRoot 'database\migrations'
$targetDir = Join-Path $workspaceRoot 'supabase\migrations'

if (-not (Test-Path -LiteralPath $sourceDir)) {
  throw "Source migration directory not found: $sourceDir"
}

New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

$sourceFiles = Get-ChildItem -Path $sourceDir -Filter '*.sql' -File | Sort-Object Name
$targetFiles = @{}

Get-ChildItem -Path $targetDir -Filter '*.sql' -File -ErrorAction SilentlyContinue | ForEach-Object {
  $targetFiles[$_.Name] = $_.FullName
}

foreach ($file in $sourceFiles) {
  $destination = Join-Path $targetDir $file.Name
  Copy-Item -LiteralPath $file.FullName -Destination $destination -Force
  $targetFiles.Remove($file.Name) | Out-Null
}

foreach ($orphanedFile in $targetFiles.Values) {
  Remove-Item -LiteralPath $orphanedFile -Force
}

Write-Host "Synced $($sourceFiles.Count) migration file(s) to $targetDir"
