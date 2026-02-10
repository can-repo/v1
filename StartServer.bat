@echo off
setlocal
title Smart Dev Launcher

echo [1/3] Memulai npm run dev...
start "NPM Dev" cmd /k "npm run dev"

echo.
echo [2/3] Menunggu server Vite (port 5173) siap...
echo       Mohon tunggu sampai Local URL muncul di jendela NPM...

:: --- LOOP PENGECEKAN ---
:WAIT_LOOP
:: Tunggu 2 detik sebelum cek ulang agar tidak membebani CPU
timeout /t 2 /nobreak >nul

:: Cek apakah ada proses yang LISTENING di port 5173
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul

:: Jika errorlevel bukan 0, artinya belum ketemu. Ulangi loop.
if %errorlevel% neq 0 (
    goto WAIT_LOOP
)
:: -----------------------

echo.
echo [+] Server terdeteksi aktif! Melanjutkan...

echo [3/3] Menjalankan Tunneling...
start "Ngrok Tunnel" cmd /k "ngrok http 5173"
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:8080"

echo.
echo Selesai! Semua layanan telah berjalan.
pause