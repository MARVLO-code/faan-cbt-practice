# Creates Desktop and Start Menu shortcuts for FAAN CBT Practice.
# Double-click this file (or right-click > Run with PowerShell) once after
# copying this folder anywhere on the PC. No admin rights or internet needed.

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$exePath = Join-Path $here 'FAAN CBT Practice.exe'

if (-not (Test-Path $exePath)) {
    Write-Host "Could not find 'FAAN CBT Practice.exe' next to this script." -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}

$shell = New-Object -ComObject WScript.Shell

$desktop = [Environment]::GetFolderPath('Desktop')
$desktopShortcut = $shell.CreateShortcut((Join-Path $desktop 'FAAN CBT Practice.lnk'))
$desktopShortcut.TargetPath = $exePath
$desktopShortcut.WorkingDirectory = $here
$desktopShortcut.Description = 'FAAN Staff Promotion CBT Practice'
$desktopShortcut.Save()

$startMenu = [Environment]::GetFolderPath('StartMenu')
$programsShortcut = $shell.CreateShortcut((Join-Path $startMenu 'Programs\FAAN CBT Practice.lnk'))
$programsShortcut.TargetPath = $exePath
$programsShortcut.WorkingDirectory = $here
$programsShortcut.Description = 'FAAN Staff Promotion CBT Practice'
$programsShortcut.Save()

Write-Host 'Done! A shortcut was added to your Desktop and Start Menu.' -ForegroundColor Green
Read-Host 'Press Enter to close'
