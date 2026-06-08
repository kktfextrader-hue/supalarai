@echo off
setlocal
cd /d "%~dp0"

REM ===== push-now.bat — commit + push ขึ้น GitHub (Pages rebuild เองใน ~1 นาที) =====
REM วิธีใช้:  push-now.bat "ข้อความ commit"
REM หรือดับเบิลคลิก (จะใช้ข้อความ default)

set "MSG=%~1"
if "%MSG%"=="" set "MSG=update"

echo.
echo === [1/3] git add ===
git add -A

echo === [2/3] commit: %MSG% ===
git commit -m "%MSG%"
if errorlevel 1 echo (ไม่มีอะไรเปลี่ยน หรือ commit ไม่สำเร็จ - ข้ามไป push)

echo === [3/3] push origin main ===
git push origin main
if errorlevel 1 (
  echo.
  echo [!] push ไม่สำเร็จ - อาจต้อง login GitHub ครั้งแรก ^(จะเด้งเบราว์เซอร์^)
  goto end
)

echo.
echo === DONE ===
echo เว็บจะอัปเดตใน ~1 นาที:
echo   https://kktfextrader-hue.github.io/supalarai/
:end
echo.
pause
