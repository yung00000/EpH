# 🔧 Java 17 Setup Guide for Android Builds

## Problem
You're getting this error:
```
Unsupported class file major version 69
```

This happens because you have Java 25 installed, but Android builds require **Java 17**.

---

## ✅ Solution: Install and Configure Java 17

### Step 1: Download Java 17

1. Go to: **https://adoptium.net/temurin/releases/?version=17**
2. Select:
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** JDK
   - **Version:** 17 (LTS)
3. Download the **.msi** installer

### Step 2: Install Java 17

1. Run the downloaded `.msi` installer
2. **Important:** Note the installation path (usually `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`)
3. Complete the installation

### Step 3: Set JAVA_HOME Environment Variable (Windows)

#### Option A: Using PowerShell (Temporary - Current Session Only)

```powershell
# Find Java 17 installation path
$java17Path = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory | Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1 -ExpandProperty FullName

# Set JAVA_HOME for current session
$env:JAVA_HOME = $java17Path
$env:PATH = "$java17Path\bin;$env:PATH"

# Verify
java -version
```

#### Option B: Using System Settings (Permanent)

1. Press `Win + X` → **System** → **Advanced system settings**
2. Click **Environment Variables**
3. Under **User variables** or **System variables**, click **New**
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot` (use your actual path)
6. Find **Path** variable → Click **Edit**
7. Add new entry: `%JAVA_HOME%\bin`
8. Move it to the top of the list (so Java 17 is used first)
9. Click **OK** on all dialogs
10. **Restart your terminal/PowerShell** for changes to take effect

### Step 4: Verify Setup

Open a **new** PowerShell window and run:

```powershell
# Check Java version (should show 17)
java -version

# Check JAVA_HOME
echo $env:JAVA_HOME

# Should output something like:
# C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot
```

**Expected output:**
```
openjdk version "17.0.x" 2024-xx-xx
OpenJDK Runtime Environment Temurin-17.0.x+x (build 17.0.x+x-LTS)
OpenJDK 64-Bit Server VM Temurin-17.0.x+x (build 17.0.x+x-LTS, mixed mode, sharing)
```

### Step 5: Build APK Again

After setting up Java 17, try building again:

```powershell
cd RunCalcPro
npm run android:build:release
```

---

## 🔄 Alternative: Use Java 17 Only for This Project

If you want to keep Java 25 as default but use Java 17 for Android builds:

### Create a Build Script

Create `RunCalcPro/build-apk.ps1`:

```powershell
# Set Java 17 for this build
$java17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"  # Update with your path
$env:JAVA_HOME = $java17Path
$env:PATH = "$java17Path\bin;$env:PATH"

# Verify Java version
Write-Host "Using Java:"
java -version

# Build APK
npm run android:build:release
```

Then run:
```powershell
cd RunCalcPro
.\build-apk.ps1
```

---

## 🐛 Troubleshooting

### "Java 17 not found" after installation

1. Check installation path:
   ```powershell
   Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory
   ```

2. Verify JAVA_HOME points to correct path:
   ```powershell
   echo $env:JAVA_HOME
   ```

3. Make sure `bin` folder exists:
   ```powershell
   Test-Path "$env:JAVA_HOME\bin\java.exe"
   ```

### Still using Java 25

1. **Restart terminal/PowerShell** after setting environment variables
2. Check PATH order - Java 17's `bin` should come before Java 25's
3. Verify in new terminal:
   ```powershell
   where.exe java
   # Should show Java 17 path first
   ```

### Build still fails

1. Clean Gradle cache:
   ```powershell
   cd RunCalcPro\android
   .\gradlew clean
   cd ..
   ```

2. Try building again:
   ```powershell
   npm run android:build:release
   ```

---

## 📝 Quick Reference

**Download Java 17:** https://adoptium.net/temurin/releases/?version=17

**Verify Java version:**
```powershell
java -version
```

**Set JAVA_HOME (PowerShell):**
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"
```

**Build APK:**
```powershell
npm run android:build:release
```

---

## ✅ After Setup

Once Java 17 is configured, your APK build should work. The APK will be located at:

```
RunCalcPro\android\app\build\outputs\apk\release\app-release.apk
```

