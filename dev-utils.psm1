# ================================
# DevTools PowerShell Module
# ================================

function Reset-Db {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]$DbName,
        [string]$DbHost = "localhost",
        [string]$DbUser = "root",
        [switch]$SkipSeed
    )

    $ServerDir = "server"

    if (-not (Test-Path $ServerDir)) {
        Write-Warning "⚠️ Folder '$ServerDir' tidak ditemukan. Proses dibatalkan."
        return
    }

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Push-Location $ServerDir

    try {
        Write-Verbose "Menghapus dan membuat ulang database '$DbName'..."
        $Command = "mysql -h $DbHost -u $DbUser -p -e `"DROP DATABASE IF EXISTS $DbName; CREATE DATABASE $DbName;`""
        & cmd /c $Command

        if ($LASTEXITCODE -ne 0) {
            throw "Gagal membuat ulang database '$DbName'."
        }

        npx sequelize-cli db:migrate
        if ($LASTEXITCODE -ne 0) { throw "Gagal melakukan migrasi database." }

        if (-not $SkipSeed) {
            npx sequelize-cli db:seed:all
            if ($LASTEXITCODE -ne 0) { throw "Gagal menjalankan seeder database." }
        }

        $sw.Stop()
        Write-Host "✅ Database '$DbName' berhasil direset dalam $($sw.Elapsed.TotalSeconds.ToString("0.00")) detik!" -ForegroundColor Cyan
    }
    catch {
        Write-Error "❌ Terjadi kesalahan: $_"
    }
    finally {
        Pop-Location
    }
}

function New-RandomHex {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [int]$Length
    )

    try {
        return node -e "console.log(require('crypto').randomBytes($Length).toString('hex'))"
    }
    catch {
        throw "❌ Gagal generate random hex: $_"
    }
}

function Measure-Text {
    [CmdletBinding(DefaultParameterSetName = 'String')]
    param (
        [Parameter(ParameterSetName = 'String', Position = 0, Mandatory = $true)]
        [string]$String,

        [Parameter(ParameterSetName = 'ScriptBlock', Position = 0, Mandatory = $true)]
        [scriptblock]$Command,

        [switch]$Detail
    )

    if ($PSCmdlet.ParameterSetName -eq 'ScriptBlock') {
        $tempFile = "$env:TEMP\count_output_$(Get-Random).txt"

        Start-Transcript -Path $tempFile -NoClobber | Out-Null
        try {
            & $Command
        } finally {
            Stop-Transcript | Out-Null
        }

        $rawLines = Get-Content $tempFile
        Remove-Item $tempFile -Force

        $starLineIndexes = @()
        for ($i = 0; $i -lt $rawLines.Count; $i++) {
            if ($rawLines[$i] -match '^\*{10,}$') {
                $starLineIndexes += $i
            }
        }

        if ($starLineIndexes.Count -ge 4) {
            $start = $starLineIndexes[-3] + 1
            $end   = $starLineIndexes[-2] - 1
            $filteredLines = $rawLines[$start..$end]
            $output = $filteredLines -join "`n"
        } else {
            $output = $rawLines -join "`n"
        }

        Write-Host "`n📤 Output Perintah:" -ForegroundColor Yellow
        Write-Host "─────────────────────────────" -ForegroundColor DarkGray
        Write-Host $output -ForegroundColor Cyan
    } else {
        $output = $String
    }

    $lines = $output -split "`r?`n"
    $charCount = ($output -replace "`r?`n", "").Length
    $lineCount = $lines.Count

    Write-Host "`n📊 Hasil Perhitungan:" -ForegroundColor Green
    Write-Host "─────────────────────────────" -ForegroundColor DarkGray
    Write-Host ("🔡 Total Karakter : {0}" -f $charCount) -ForegroundColor White
    Write-Host ("📜 Jumlah Baris   : {0}" -f $lineCount) -ForegroundColor White

    if ($Detail) {
        Write-Host "`n🔎 Frekuensi Karakter (tanpa spasi):" -ForegroundColor Magenta
        Write-Host "─────────────────────────────" -ForegroundColor DarkGray
        $charFreq = @{}
        foreach ($char in $output.ToCharArray()) {
            if ($char -match "\s") { continue }
            if ($charFreq.ContainsKey($char)) {
                $charFreq[$char] += 1
            } else {
                $charFreq[$char] = 1
            }
        }

        $charFreq.GetEnumerator() |
            Sort-Object -Property Value -Descending |
            ForEach-Object {
                Write-Host ("{0} = {1}" -f $_.Key, $_.Value) -ForegroundColor White
            }
    }
}

function Get-Checksum {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]$Path,

        [ValidateSet("SHA384", "SHA256", "SHA1", "MD5")]
        [string]$Algo = "SHA256",

        [string]$Check
    )

    if (-not (Test-Path $Path)) {
        throw "❌ File tidak ditemukan: $Path"
    }

    # Parse format algo:hash
    if ($Check -match '^(sha384|sha256|sha1|md5):([0-9a-f]+)$') {
        $Algo  = $matches[1].ToUpper()
        $Check = $matches[2]
    }

    $hashObj    = Get-FileHash -Path $Path -Algorithm $Algo
    $actualHash = $hashObj.Hash.ToLower()

    $result = [PSCustomObject]@{
        Algorithm = $Algo
        File      = $Path
        Hash      = $actualHash
        Match     = $null
    }

    if ($Check) {
        $result.Match = ($actualHash -eq $Check.Trim().ToLower())
    }

    return $result
}

function New-RandomNumber {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [ValidateRange(1, 10000)]
        [int]$Length
    )

    $rng   = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $bytes = New-Object byte[] ($Length)
        $rng.GetBytes($bytes)
        $digits = foreach ($b in $bytes) { $b % 10 }
        return ($digits -join "")
    }
    finally {
        $rng.Dispose()
    }
}

function New-SecretKey {
    [CmdletBinding()]
    param(
        [int]$Length = 32,
        [ValidateSet("Base64", "Hex", "UrlSafeBase64")]
        [string]$Format = "Base64"
    )

    $bytes = New-Object byte[] $Length
    $rng   = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()

    switch ($Format) {
        "Base64"        { return [Convert]::ToBase64String($bytes) }
        "Hex"           { return [BitConverter]::ToString($bytes).Replace("-", "").ToLower() }
        "UrlSafeBase64" {
            $b64 = [Convert]::ToBase64String($bytes)
            return $b64.TrimEnd("=").Replace('+','-').Replace('/','_')
        }
    }
}

# Dynamic Argument Completion for SecretKey Format
Register-ArgumentCompleter -CommandName New-SecretKey -ParameterName Format -ScriptBlock {
    param($commandName, $parameterName, $wordToComplete)

    "Base64","Hex","UrlSafeBase64" |
        Where-Object { $_ -like "$wordToComplete*" } |
        ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', "Format $_")
        }
}

function hurlj {
    param([string]$file)
    hurl --output - $file | ConvertFrom-Json | ConvertTo-Json -Depth 10 -Compress:$false
}
