@echo off
echo ========================================
echo   SISTEMA DE SOLICITADORA MELHORADO
echo ========================================
echo.

echo 🚀 Iniciando sistema com melhorias...
echo.

echo 📊 1. Verificando dependencias...
if not exist "node_modules" (
    echo    Instalando dependencias...
    npm install
) else (
    echo    ✅ Dependencias ja instaladas
)

echo.
echo 🔧 2. Criando diretorio de backups...
if not exist "backups" (
    mkdir backups
    echo    ✅ Diretorio de backups criado
) else (
    echo    ✅ Diretorio de backups ja existe
)

echo.
echo 📁 3. Verificando estrutura de ficheiros...
if not exist "frontend\index-dashboard-melhorado.html" (
    echo    ❌ Ficheiro do dashboard melhorado nao encontrado
    pause
    exit
) else (
    echo    ✅ Dashboard melhorado encontrado
)

if not exist "scripts\backup-automatico.js" (
    echo    ❌ Script de backup nao encontrado
    pause
    exit
) else (
    echo    ✅ Script de backup encontrado
)

echo.
echo 🗄️ 4. Iniciando backup automatico...
start /B node scripts\backup-automatico.js start

echo.
echo 🌐 5. Iniciando servidor web...
echo    📱 Acesse: http://localhost:3000
echo    🔗 API: http://localhost:3000/api
echo    💾 Base de dados: SQLite
echo.

echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo 🎯 MELHORIAS IMPLEMENTADAS:
echo    ✅ Dashboard com graficos Chart.js
echo    ✅ Interface responsiva melhorada
echo    ✅ Sistema de backup automatico
echo    ✅ Upload de documentos melhorado
echo    ✅ Graficos interativos
echo    ✅ Estatisticas em tempo real
echo.
echo 📋 COMANDOS UTEIS:
echo    - Backup manual: node scripts\backup-automatico.js backup
echo    - Listar backups: node scripts\backup-automatico.js list
echo    - Restaurar backup: node scripts\backup-automatico.js restore nome-do-backup.zip
echo.

node backend\app-solicitadora-sqlite.js
