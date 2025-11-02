# Script Rápido - Iniciar Trabalho no Sistema Legal
# Use este script na raiz do projeto para trabalhar no Sistema Legal

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  INICIANDO TRABALHO - SISTEMA LEGAL" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para pasta do sistema-legal
if (Test-Path "projetos\sistema-legal") {
    Set-Location "projetos\sistema-legal"
    Write-Host "[OK] Navegado para projetos\sistema-legal" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Pasta projetos\sistema-legal nao encontrada!" -ForegroundColor Red
    exit 1
}

# Verificar se está na pasta correta
$pastaAtual = Get-Location
Write-Host "[INFO] Pasta atual: $pastaAtual" -ForegroundColor White
Write-Host ""

# Executar script de segurança
if (Test-Path "trabalhar-aqui.ps1") {
    Write-Host "[INFO] Executando verificacoes de seguranca..." -ForegroundColor Yellow
    Write-Host ""
    & .\trabalhar-aqui.ps1
} else {
    Write-Host "[AVISO] Script trabalhar-aqui.ps1 nao encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Pronto para trabalhar!" -ForegroundColor Green
Write-Host "  Arquivo principal: index_clean.html" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

