@echo off
title Sistema Legal - Servidor Local
color 0A

echo.
echo ========================================
echo    SISTEMA LEGAL - SERVIDOR LOCAL
echo ========================================
echo.

echo 🚀 Iniciando servidor...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo 💡 Instale Python em: https://python.org
    echo.
    pause
    exit /b 1
)

REM Executar servidor
python servidor-local.py

echo.
echo ⏹️  Servidor parado
pause
