-- ========================================
-- SCHEMA DO NOVO PROJETO LOCAL
-- Sistema de Gestão Empresarial
-- ========================================

-- Configuração inicial
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Auditoria_Log;
DROP TABLE IF EXISTS Utilizador;
DROP TABLE IF EXISTS Historico_Registo;
DROP TABLE IF EXISTS Profissional_Especializacao;
DROP TABLE IF EXISTS Profissional;
DROP TABLE IF EXISTS Escritorio;
DROP TABLE IF EXISTS Especializacao;
DROP TABLE IF EXISTS Localizacao;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- TABELAS PRINCIPAIS
-- ========================================

-- Tabela de Localização
CREATE TABLE Localizacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    distrito VARCHAR(100) NOT NULL,
    concelho VARCHAR(100) NOT NULL,
    freguesia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_distrito (distrito),
    INDEX idx_concelho (concelho),
    INDEX idx_codigo_postal (codigo_postal)
);

-- Tabela de Especializações
CREATE TABLE Especializacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_descricao (descricao),
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo)
);

-- Tabela de Escritórios
CREATE TABLE Escritorio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    contacto_email VARCHAR(100),
    contacto_telefone VARCHAR(20),
    website VARCHAR(255),
    localizacao_id INT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (localizacao_id) REFERENCES Localizacao(id) ON DELETE SET NULL,
    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo),
    INDEX idx_localizacao (localizacao_id)
);

-- Tabela de Profissionais
CREATE TABLE Profissional (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nif VARCHAR(20) UNIQUE NOT NULL,
    cedula VARCHAR(50) UNIQUE NOT NULL,
    data_inscricao DATE,
    estado ENUM('ativo', 'inativo', 'suspenso', 'aposentado') DEFAULT 'ativo',
    contacto_email VARCHAR(100),
    contacto_tel VARCHAR(20),
    data_nascimento DATE,
    genero ENUM('M', 'F', 'Outro'),
    localizacao_id INT,
    escritorio_id INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (localizacao_id) REFERENCES Localizacao(id) ON DELETE SET NULL,
    FOREIGN KEY (escritorio_id) REFERENCES Escritorio(id) ON DELETE SET NULL,
    INDEX idx_nome (nome),
    INDEX idx_nif (nif),
    INDEX idx_cedula (cedula),
    INDEX idx_estado (estado),
    INDEX idx_escritorio (escritorio_id),
    INDEX idx_localizacao (localizacao_id)
);

-- Tabela de Relacionamento Profissional-Especialização
CREATE TABLE Profissional_Especializacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    especializacao_id INT NOT NULL,
    data_especializacao DATE DEFAULT (CURRENT_DATE),
    nivel ENUM('básico', 'intermédio', 'avançado', 'especialista') DEFAULT 'básico',
    certificado VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profissional_id) REFERENCES Profissional(id) ON DELETE CASCADE,
    FOREIGN KEY (especializacao_id) REFERENCES Especializacao(id) ON DELETE CASCADE,
    UNIQUE KEY unique_prof_esp (profissional_id, especializacao_id),
    INDEX idx_profissional (profissional_id),
    INDEX idx_especializacao (especializacao_id),
    INDEX idx_nivel (nivel)
);

-- Tabela de Histórico de Registo
CREATE TABLE Historico_Registo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    tipo_ato VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    observacoes TEXT,
    documento_anexo VARCHAR(255),
    valor DECIMAL(10,2),
    status ENUM('pendente', 'aprovado', 'rejeitado', 'em_analise') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profissional_id) REFERENCES Profissional(id) ON DELETE CASCADE,
    INDEX idx_profissional (profissional_id),
    INDEX idx_tipo_ato (tipo_ato),
    INDEX idx_data (data),
    INDEX idx_status (status)
);

-- Tabela de Utilizadores
CREATE TABLE Utilizador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    perfil ENUM('admin', 'profissional', 'publico', 'gestor') NOT NULL,
    profissional_id INT,
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP,
    tentativas_login INT DEFAULT 0,
    bloqueado_ate TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profissional_id) REFERENCES Profissional(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_perfil (perfil),
    INDEX idx_ativo (ativo),
    INDEX idx_profissional (profissional_id)
);

-- Tabela de Auditoria
CREATE TABLE Auditoria_Log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tabela_afetada VARCHAR(100) NOT NULL,
    operacao ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT') NOT NULL,
    utilizador_id INT,
    registro_id INT,
    dados_anteriores JSON,
    dados_novos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalhes TEXT,
    
    FOREIGN KEY (utilizador_id) REFERENCES Utilizador(id) ON DELETE SET NULL,
    INDEX idx_tabela (tabela_afetada),
    INDEX idx_operacao (operacao),
    INDEX idx_utilizador (utilizador_id),
    INDEX idx_data (data_operacao),
    INDEX idx_registro (registro_id)
);

-- ========================================
-- TRIGGERS DE AUDITORIA
-- ========================================

-- Trigger para auditoria de Profissional
DELIMITER $$
CREATE TRIGGER tr_profissional_audit_insert
    AFTER INSERT ON Profissional
    FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Log (tabela_afetada, operacao, registro_id, dados_novos)
    VALUES ('Profissional', 'INSERT', NEW.id, JSON_OBJECT(
        'nome', NEW.nome,
        'nif', NEW.nif,
        'cedula', NEW.cedula,
        'estado', NEW.estado
    ));
END$$

CREATE TRIGGER tr_profissional_audit_update
    AFTER UPDATE ON Profissional
    FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Log (tabela_afetada, operacao, registro_id, dados_anteriores, dados_novos)
    VALUES ('Profissional', 'UPDATE', NEW.id, 
        JSON_OBJECT('estado', OLD.estado, 'nome', OLD.nome),
        JSON_OBJECT('estado', NEW.estado, 'nome', NEW.nome)
    );
END$$

CREATE TRIGGER tr_profissional_audit_delete
    AFTER DELETE ON Profissional
    FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Log (tabela_afetada, operacao, registro_id, dados_anteriores)
    VALUES ('Profissional', 'DELETE', OLD.id, 
        JSON_OBJECT('nome', OLD.nome, 'nif', OLD.nif)
    );
END$$
DELIMITER ;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View de Profissionais Completos
CREATE VIEW vw_profissionais_completos AS
SELECT 
    p.id,
    p.nome,
    p.nif,
    p.cedula,
    p.estado,
    p.contacto_email,
    p.contacto_tel,
    p.data_inscricao,
    e.nome as escritorio_nome,
    l.concelho,
    l.distrito,
    GROUP_CONCAT(esp.descricao SEPARATOR ', ') as especializacoes,
    COUNT(pe.id) as total_especializacoes
FROM Profissional p
LEFT JOIN Escritorio e ON p.escritorio_id = e.id
LEFT JOIN Localizacao l ON p.localizacao_id = l.id
LEFT JOIN Profissional_Especializacao pe ON p.id = pe.profissional_id
LEFT JOIN Especializacao esp ON pe.especializacao_id = esp.id
GROUP BY p.id;

-- View de Estatísticas
CREATE VIEW vw_estatisticas AS
SELECT 
    (SELECT COUNT(*) FROM Profissional WHERE estado = 'ativo') as profissionais_ativos,
    (SELECT COUNT(*) FROM Escritorio WHERE ativo = TRUE) as escritorios_ativos,
    (SELECT COUNT(*) FROM Especializacao WHERE ativo = TRUE) as especializacoes_ativas,
    (SELECT COUNT(*) FROM Localizacao) as total_localizacoes,
    (SELECT COUNT(*) FROM Utilizador WHERE ativo = TRUE) as utilizadores_ativos;

-- ========================================
-- PROCEDURES ÚTEIS
-- ========================================

-- Procedure para obter profissionais por especialização
DELIMITER $$
CREATE PROCEDURE sp_profissionais_por_especializacao(IN esp_id INT)
BEGIN
    SELECT 
        p.id,
        p.nome,
        p.cedula,
        p.estado,
        e.nome as escritorio,
        pe.nivel,
        pe.data_especializacao
    FROM Profissional p
    JOIN Profissional_Especializacao pe ON p.id = pe.profissional_id
    LEFT JOIN Escritorio e ON p.escritorio_id = e.id
    WHERE pe.especializacao_id = esp_id
    AND p.estado = 'ativo'
    ORDER BY p.nome;
END$$
DELIMITER ;

-- Procedure para obter estatísticas por período
DELIMITER $$
CREATE PROCEDURE sp_estatisticas_periodo(IN data_inicio DATE, IN data_fim DATE)
BEGIN
    SELECT 
        COUNT(*) as total_registos,
        COUNT(CASE WHEN status = 'aprovado' THEN 1 END) as aprovados,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
        COUNT(CASE WHEN status = 'rejeitado' THEN 1 END) as rejeitados
    FROM Historico_Registo
    WHERE data BETWEEN data_inicio AND data_fim;
END$$
DELIMITER ;

-- ========================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ========================================

-- Índices compostos para consultas frequentes
CREATE INDEX idx_profissional_estado_escritorio ON Profissional(estado, escritorio_id);
CREATE INDEX idx_historico_profissional_data ON Historico_Registo(profissional_id, data);
CREATE INDEX idx_auditoria_tabela_data ON Auditoria_Log(tabela_afetada, data_operacao);

-- ========================================
-- CONFIGURAÇÕES FINAIS
-- ========================================

-- Configurar charset e collation
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Configurar timezone
SET time_zone = '+00:00';

-- ========================================
-- SCHEMA CRIADO COM SUCESSO!
-- ========================================