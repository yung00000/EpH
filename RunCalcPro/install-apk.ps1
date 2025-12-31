# PowerShell script to uninstall and install APK on Android emulator/device
# Usage: .\install-apk.ps1

$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$packageName = "com.yourcompany.runcalspro"
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"

Write-Host "Uninstalling existing app..." -ForegroundColor Yellow
& $adbPath uninstall $packageName

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully uninstalled!" -ForegroundColor Green
} else {
    Write-Host "App may not exist, continuing..." -ForegroundColor Yellow
}

Write-Host "Installing new APK..." -ForegroundColor Yellow
& $adbPath install -r $apkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "APK installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Installation failed!" -ForegroundColor Red
    exit 1
}

