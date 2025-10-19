@echo off
echo ========================================
echo CONFIGURACAO DA BASE DE DADOS
echo ========================================
echo.

echo Por favor, certifique-se de que o MySQL esta instalado e rodando.
echo.

echo 1. Abra o MySQL Workbench ou linha de comando do MySQL
echo 2. Execute os seguintes comandos:
echo.
echo CREATE DATABASE IF NOT EXISTS solicitadora_db;
echo USE solicitadora_db;
echo.
echo 3. Depois execute este script para importar os dados:
echo.

pause

echo Importando schema da base de dados...
mysql -u root -p solicitadora_db < database/schema-solicitadora.sql

echo.
echo Importando dados iniciais...
mysql -u root -p solicitadora_db < database/seed-solicitadora.sql

echo.
echo ========================================
echo BASE DE DADOS CONFIGURADA COM SUCESSO!
echo ========================================
echo.
echo Agora pode iniciar o sistema com:
echo node backend/app-solicitadora.js
echo.
pause
