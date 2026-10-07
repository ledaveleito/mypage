@echo off
setlocal
set "PROJECT_DIR=%~dp0"
set "BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%BUNDLED_NODE%" (
  set "NODE_EXE=%BUNDLED_NODE%"
) else (
  where node.exe >nul 2>nul
  if errorlevel 1 (
    echo Khong tim thay Node.js. Cai Node.js hoac chay trang web trong Codex.
    exit /b 1
  )
  set "NODE_EXE=node.exe"
)

cd /d "%PROJECT_DIR%"
"%NODE_EXE%" "tools\check-content.cjs"
