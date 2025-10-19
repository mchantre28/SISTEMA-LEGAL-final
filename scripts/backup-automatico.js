const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configurações do backup
const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../database/solicitadora.db');
const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas em millisegundos

// Criar diretório de backup se não existir
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Função para criar backup
function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `solicitadora-backup-${timestamp}.db`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);
    
    try {
        // Copiar o ficheiro da base de dados
        fs.copyFileSync(DB_PATH, backupPath);
        
        // Comprimir o backup
        const compressedFileName = backupFileName.replace('.db', '.zip');
        const compressedPath = path.join(BACKUP_DIR, compressedFileName);
        
        // Usar PowerShell para comprimir (Windows)
        const compressCommand = `powershell "Compress-Archive -Path '${backupPath}' -DestinationPath '${compressedPath}' -Force"`;
        
        exec(compressCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao comprimir backup:', error);
                return;
            }
            
            // Remover o ficheiro não comprimido
            fs.unlinkSync(backupPath);
            
            console.log(`✅ Backup criado com sucesso: ${compressedFileName}`);
            console.log(`📁 Localização: ${compressedPath}`);
            
            // Limpar backups antigos (manter apenas os últimos 7)
            cleanupOldBackups();
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
    }
}

// Função para limpar backups antigos
function cleanupOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('solicitadora-backup-') && file.endsWith('.zip'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                stats: fs.statSync(path.join(BACKUP_DIR, file))
            }))
            .sort((a, b) => b.stats.mtime - a.stats.mtime);
        
        // Manter apenas os últimos 7 backups
        if (files.length > 7) {
            const filesToDelete = files.slice(7);
            filesToDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`🗑️ Backup antigo removido: ${file.name}`);
            });
        }
        
    } catch (error) {
        console.error('Erro ao limpar backups antigos:', error);
    }
}

// Função para restaurar backup
function restoreBackup(backupFileName) {
    const backupPath = path.join(BACKUP_DIR, backupFileName);
    
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Ficheiro de backup não encontrado:', backupFileName);
        return false;
    }
    
    try {
        // Fazer backup do ficheiro atual
        const currentBackup = path.join(BACKUP_DIR, `current-backup-${Date.now()}.db`);
        fs.copyFileSync(DB_PATH, currentBackup);
        
        // Restaurar o backup
        fs.copyFileSync(backupPath, DB_PATH);
        
        console.log('✅ Backup restaurado com sucesso!');
        console.log(`📁 Backup atual salvo como: ${currentBackup}`);
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        return false;
    }
}

// Função para listar backups disponíveis
function listBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('solicitadora-backup-') && file.endsWith('.zip'))
            .map(file => {
                const filePath = path.join(BACKUP_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
                    date: stats.mtime.toLocaleString('pt-BR')
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('📋 Backups disponíveis:');
        files.forEach((file, index) => {
            console.log(`${index + 1}. ${file.name}`);
            console.log(`   📅 Data: ${file.date}`);
            console.log(`   📦 Tamanho: ${file.size}`);
            console.log('');
        });
        
        return files;
        
    } catch (error) {
        console.error('Erro ao listar backups:', error);
        return [];
    }
}

// Iniciar backup automático
function startAutomaticBackup() {
    console.log('🔄 Iniciando sistema de backup automático...');
    console.log(`⏰ Intervalo: ${BACKUP_INTERVAL / (60 * 60 * 1000)} horas`);
    console.log(`📁 Diretório de backup: ${BACKUP_DIR}`);
    
    // Criar backup inicial
    createBackup();
    
    // Agendar backups automáticos
    setInterval(createBackup, BACKUP_INTERVAL);
}

// Exportar funções para uso externo
module.exports = {
    createBackup,
    restoreBackup,
    listBackups,
    cleanupOldBackups,
    startAutomaticBackup
};

// Se executado diretamente
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'backup':
            createBackup();
            break;
        case 'list':
            listBackups();
            break;
        case 'restore':
            const backupFile = process.argv[3];
            if (backupFile) {
                restoreBackup(backupFile);
            } else {
                console.log('❌ Especifique o nome do ficheiro de backup');
                console.log('Uso: node backup-automatico.js restore nome-do-backup.zip');
            }
            break;
        case 'start':
            startAutomaticBackup();
            break;
        default:
            console.log('🔧 Sistema de Backup Automático - Solicitadora');
            console.log('');
            console.log('Comandos disponíveis:');
            console.log('  backup  - Criar backup manual');
            console.log('  list    - Listar backups disponíveis');
            console.log('  restore - Restaurar backup (especificar nome do ficheiro)');
            console.log('  start   - Iniciar backup automático');
            console.log('');
            console.log('Exemplos:');
            console.log('  node backup-automatico.js backup');
            console.log('  node backup-automatico.js list');
            console.log('  node backup-automatico.js restore solicitadora-backup-2024-01-15T10-30-00-000Z.zip');
            console.log('  node backup-automatico.js start');
    }
}
