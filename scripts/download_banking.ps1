param([int]$UserId = 0)

$ApiBase      = "https://key-click-three.vercel.app"
$DownloadDir  = Join-Path $PSScriptRoot "Download"

if (-not (Test-Path $DownloadDir)) { New-Item -ItemType Directory -Path $DownloadDir | Out-Null }

# שליפת חשבונות
$data  = Invoke-RestMethod -Uri "$ApiBase/api/banking/accounts?userId=$UserId"
$conns = $data.connections
$accs  = $data.accounts

if ($accs.Count -eq 0) { Write-Host "אין חשבונות מחוברים"; exit }

$count = 0
foreach ($acc in $accs) {
    $conn     = $conns | Where-Object { $_.id -eq $acc.connection_id } | Select-Object -First 1
    $txData   = Invoke-RestMethod -Uri "$ApiBase/api/banking/transactions?accountId=$($acc.id)"
    $txList   = $txData.transactions
    $instName = if ($conn) { $conn.institution_name } else { $acc.name }
    $accType  = if ($acc.account_type -eq 'credit') { 'כרטיס אשראי' } else { 'תנועות בחשבון עו"ש' }
    $now      = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")

    $rows = @($instName, $accType, "", ",`"$($acc.iban)`"", ",`"$now`"", "")
    foreach ($tx in $txList) {
        $debit  = if ($tx.amount -lt 0) { [Math]::Abs($tx.amount).ToString("F2") } else { "0" }
        $credit = if ($tx.amount -gt 0) { $tx.amount.ToString("F2") }               else { "0" }
        $rows  += "`"$($tx.date)`",`"$($tx.date)`",`"`",`"$($tx.description)`",$debit,$credit,$($acc.balance.ToString('F2'))"
    }

    $csv      = $rows -join "`r`n"
    $date     = (Get-Date).ToString("yyyy-MM-dd")
    $safeName = ($instName -replace '[^\wא-ת]', '_')
    $filename = "banking_${safeName}_$($acc.iban -replace '[^\w]','_')_${date}.csv"
    $filepath = Join-Path $DownloadDir $filename

    $enc = New-Object System.Text.UTF8Encoding $true
    [System.IO.File]::WriteAllText($filepath, $csv, $enc)
    $count++
    Write-Host "נשמר: $filename"
}

Write-Host "הושלם — $count קבצים"
explorer.exe $DownloadDir
