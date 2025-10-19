@echo off
echo ========================================
echo SISTEMA DE GESTAO PARA SOLICITADORA
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)
echo Node.js encontrado!

echo.
echo [2/4] Instalando dependencias...
npm install

echo.
echo [3/4] Configurando base de dados...
echo Por favor, certifique-se de que o MySQL esta rodando e configure o arquivo .env
echo Exemplo de .env:
echo DB_HOST=localhost
echo DB_USER=root
echo DB_PASSWORD=sua_senha
echo DB_NAME=solicitadora_db
echo DB_PORT=3306
echo JWT_SECRET=seu_jwt_secret_aqui

echo.
echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo API: http://localhost:3000/api
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

node backend/app-solicitadora.js
