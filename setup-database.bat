@echo off
echo ========================================
echo    CONFIGURANDO BANCO DE DADOS
echo ========================================
echo.

echo 1. Criando banco de dados...
mysql -u root -p < criar-banco.sql

echo.
echo 2. Executando schema.sql...
mysql -u root -p meu_projeto_base_dados < database/schema.sql

echo.
echo 3. Executando seed.sql...
mysql -u root -p meu_projeto_base_dados < database/seed.sql

echo.
echo ========================================
echo    BANCO CONFIGURADO COM SUCESSO!
echo ========================================
echo.
echo Agora execute: npm install
echo Depois execute: npm start
echo.
pause
