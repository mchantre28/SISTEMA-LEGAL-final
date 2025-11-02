# Script para Organizar Projetos Misturados
Write-Host "[*] Organizando projetos..." -ForegroundColor Green

# 1. SISTEMA LEGAL - Modais e sistema jurídico
Write-Host "`n[*] Organizando Sistema Legal..." -ForegroundColor Yellow
$arquivosLegal = @(
    "index_clean.html",
    "sistema-legal.html",
    "sistema-melhorado.html",
    "sistema-otimizado.html",
    "sistema-legal.html"
)

foreach ($arquivo in $arquivosLegal) {
    if (Test-Path $arquivo) {
        Move-Item -Path $arquivo -Destination "projetos\sistema-legal\" -Force
        Write-Host "  [OK] Movido: $arquivo" -ForegroundColor Green
    }
}

# 2. LOJA VARIADA - Loja online
Write-Host "`n[*] Organizando Loja Variada..." -ForegroundColor Yellow
$arquivosLoja = @(
    "index.html",
    "script.js",
    "styles.css"
)

foreach ($arquivo in $arquivosLoja) {
    if (Test-Path $arquivo) {
        Move-Item -Path $arquivo -Destination "projetos\loja-variada\" -Force
        Write-Host "  [OK] Movido: $arquivo" -ForegroundColor Green
    }
}

# 3. SOLICITADORA - Sistema jurídico
Write-Host "`n[*] Organizando Solicitadora..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*solicitadora*" | ForEach-Object {
    if ($_.Name -notlike "projetos\*") {
        Move-Item -Path $_.FullName -Destination "projetos\solicitadora\" -Force
        Write-Host "  [OK] Movido: $($_.Name)" -ForegroundColor Green
    }
}

# Mover pasta solicitadora completa
if (Test-Path "solicitadora") {
    Move-Item -Path "solicitadora" -Destination "projetos\solicitadora\solicitadora-original" -Force
    Write-Host "  [OK] Movida pasta: solicitadora" -ForegroundColor Green
}

# 4. BACKEND/API
Write-Host "`n[*] Organizando Backend/API..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Move-Item -Path "backend" -Destination "projetos\backend-api\" -Force
    Write-Host "  [OK] Movida pasta: backend" -ForegroundColor Green
}
if (Test-Path "api") {
    Move-Item -Path "api" -Destination "projetos\backend-api\" -Force
    Write-Host "  [OK] Movida pasta: api" -ForegroundColor Green
}
if (Test-Path "database") {
    Move-Item -Path "database" -Destination "projetos\backend-api\" -Force
    Write-Host "  [OK] Movida pasta: database" -ForegroundColor Green
}

# 5. ARQUIVOS DO FRONTEND
Write-Host "`n[*] Organizando Frontend..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    # Mover arquivos do sistema legal para sistema-legal
    Get-ChildItem -Path "frontend" -Filter "index-*.html" | ForEach-Object {
        $nome = $_.Name
        if ($nome -like "*solicitadora*" -or $nome -like "*juridico*") {
            Move-Item -Path $_.FullName -Destination "projetos\solicitadora\" -Force
            Write-Host "  [OK] Movido para solicitadora: $nome" -ForegroundColor Green
        } elseif ($nome -like "*completo*" -or $nome -like "*funcional*" -or $nome -like "*sistema*") {
            Move-Item -Path $_.FullName -Destination "projetos\sistema-legal\" -Force
            Write-Host "  [OK] Movido para sistema-legal: $nome" -ForegroundColor Green
        } else {
            Move-Item -Path $_.FullName -Destination "projetos\sistema-legal\frontend\" -Force
            Write-Host "  [OK] Movido: $nome" -ForegroundColor Green
        }
    }
    # Criar pasta frontend no sistema-legal se não existir
    if (-not (Test-Path "projetos\sistema-legal\frontend")) {
        New-Item -ItemType Directory -Path "projetos\sistema-legal\frontend" -Force | Out-Null
    }
}

# 6. BACKUPS E ARQUIVOS TEMPORÁRIOS
Write-Host "`n[*] Organizando Backups..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*backup*" | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "projetos\_backups\" -Force
    Write-Host "  [OK] Movido: $($_.Name)" -ForegroundColor Green
}

# Criar pasta de backups se não existir
if (-not (Test-Path "projetos\_backups")) {
    New-Item -ItemType Directory -Path "projetos\_backups" -Force | Out-Null
}

Write-Host "`n[OK] Organizacao concluida!" -ForegroundColor Green
Write-Host "`n[*] Estrutura criada:" -ForegroundColor Cyan
Write-Host "  projetos/sistema-legal/" -ForegroundColor White
Write-Host "  projetos/loja-variada/" -ForegroundColor White
Write-Host "  projetos/solicitadora/" -ForegroundColor White
Write-Host "  projetos/backend-api/" -ForegroundColor White
Write-Host "  projetos/_backups/" -ForegroundColor White

