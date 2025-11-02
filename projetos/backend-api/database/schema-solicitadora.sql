-- ========================================
-- SCHEMA DO SISTEMA DE GESTÃO PARA SOLICITADORA
-- Sistema Completo de Gestão Jurídica
-- ========================================

-- Configuração inicial
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Auditoria_Log;
DROP TABLE IF EXISTS Tarefa;
DROP TABLE IF EXISTS Agenda;
DROP TABLE IF EXISTS Documento;
DROP TABLE IF EXISTS Processo;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Despesa;
DROP TABLE IF EXISTS Fatura;
DROP TABLE IF EXISTS Pagamento;
DROP TABLE IF EXISTS Honorario;
DROP TABLE IF EXISTS Utilizador;
DROP TABLE IF EXISTS Solicitadora;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- TABELAS PRINCIPAIS
-- ========================================

-- Tabela de Solicitadora (Usuário Principal)
CREATE TABLE Solicitadora (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nif VARCHAR(20) UNIQUE NOT NULL,
    cedula VARCHAR(50) UNIQUE NOT NULL,
    contacto_email VARCHAR(100) NOT NULL,
    contacto_telefone VARCHAR(20) NOT NULL,
    morada TEXT,
    codigo_postal VARCHAR(20),
    localidade VARCHAR(100),
    distrito VARCHAR(100),
    data_nascimento DATE,
    genero ENUM('M', 'F', 'Outro'),
    especializacoes TEXT,
    data_inscricao DATE,
    estado ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
    foto_perfil VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome),
    INDEX idx_nif (nif),
    INDEX idx_cedula (cedula),
    INDEX idx_estado (estado)
);

-- Tabela de Clientes
CREATE TABLE Cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nif VARCHAR(20) UNIQUE,
    contacto_email VARCHAR(100),
    contacto_telefone VARCHAR(20),
    contacto_telefone_alt VARCHAR(20),
    morada TEXT,
    codigo_postal VARCHAR(20),
    localidade VARCHAR(100),
    distrito VARCHAR(100),
    data_nascimento DATE,
    genero ENUM('M', 'F', 'Outro'),
    profissao VARCHAR(100),
    empresa VARCHAR(100),
    observacoes TEXT,
    tipo_cliente ENUM('pessoa_singular', 'pessoa_coletiva') DEFAULT 'pessoa_singular',
    estado ENUM('ativo', 'inativo', 'potencial') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome),
    INDEX idx_nif (nif),
    INDEX idx_estado (estado),
    INDEX idx_tipo_cliente (tipo_cliente)
);

-- Tabela de Processos Jurídicos
CREATE TABLE Processo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_processo VARCHAR(100) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    solicitadora_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_processo ENUM('civil', 'penal', 'comercial', 'trabalho', 'fiscal', 'administrativo', 'consumo', 'imobiliario', 'outro') NOT NULL,
    estado ENUM('aberto', 'em_andamento', 'suspenso', 'concluido', 'arquivado') DEFAULT 'aberto',
    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
    data_abertura DATE NOT NULL,
    data_vencimento DATE,
    data_conclusao DATE,
    valor_causa DECIMAL(12,2),
    observacoes TEXT,
    tribunal VARCHAR(255),
    juiz VARCHAR(255),
    advogado_contrario VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (solicitadora_id) REFERENCES Solicitadora(id) ON DELETE CASCADE,
    INDEX idx_numero_processo (numero_processo),
    INDEX idx_cliente (cliente_id),
    INDEX idx_solicitadora (solicitadora_id),
    INDEX idx_estado (estado),
    INDEX idx_tipo_processo (tipo_processo),
    INDEX idx_prioridade (prioridade),
    INDEX idx_data_abertura (data_abertura)
);

-- Tabela de Documentos
CREATE TABLE Documento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    processo_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_documento ENUM('contrato', 'peticao', 'sentenca', 'despacho', 'certidao', 'prova', 'outro') NOT NULL,
    ficheiro_nome VARCHAR(255),
    ficheiro_caminho VARCHAR(500),
    ficheiro_tamanho INT,
    ficheiro_tipo VARCHAR(100),
    data_documento DATE,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    versao VARCHAR(20) DEFAULT '1.0',
    estado ENUM('rascunho', 'final', 'aprovado', 'rejeitado') DEFAULT 'rascunho',
    
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE CASCADE,
    INDEX idx_processo (processo_id),
    INDEX idx_tipo_documento (tipo_documento),
    INDEX idx_data_documento (data_documento),
    INDEX idx_estado (estado)
);

-- Tabela de Honorários
CREATE TABLE Honorario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    processo_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo_honorario ENUM('fixo', 'por_hora', 'percentagem', 'por_ato') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    quantidade DECIMAL(10,2) DEFAULT 1.00,
    total DECIMAL(10,2) NOT NULL,
    data_honorario DATE NOT NULL,
    estado ENUM('pendente', 'pago', 'parcial', 'cancelado') DEFAULT 'pendente',
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE CASCADE,
    INDEX idx_processo (processo_id),
    INDEX idx_tipo_honorario (tipo_honorario),
    INDEX idx_estado (estado),
    INDEX idx_data_honorario (data_honorario)
);

-- Tabela de Despesas
CREATE TABLE Despesa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    processo_id INT,
    solicitadora_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    categoria ENUM('deslocacao', 'documentos', 'comunicacoes', 'pesquisas', 'outros') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_despesa DATE NOT NULL,
    comprovativo VARCHAR(255),
    observacoes TEXT,
    reembolsavel BOOLEAN DEFAULT TRUE,
    estado ENUM('pendente', 'aprovado', 'rejeitado', 'reembolsado') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE SET NULL,
    FOREIGN KEY (solicitadora_id) REFERENCES Solicitadora(id) ON DELETE CASCADE,
    INDEX idx_processo (processo_id),
    INDEX idx_solicitadora (solicitadora_id),
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado),
    INDEX idx_data_despesa (data_despesa)
);

-- Tabela de Pagamentos
CREATE TABLE Pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    processo_id INT,
    valor DECIMAL(10,2) NOT NULL,
    data_pagamento DATE NOT NULL,
    metodo_pagamento ENUM('dinheiro', 'transferencia', 'cheque', 'multibanco', 'paypal', 'outro') NOT NULL,
    referencia VARCHAR(100),
    observacoes TEXT,
    estado ENUM('confirmado', 'pendente', 'cancelado') DEFAULT 'confirmado',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE SET NULL,
    INDEX idx_cliente (cliente_id),
    INDEX idx_processo (processo_id),
    INDEX idx_data_pagamento (data_pagamento),
    INDEX idx_estado (estado)
);

-- Tabela de Faturas
CREATE TABLE Fatura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_fatura VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    processo_id INT,
    data_emissao DATE NOT NULL,
    data_vencimento DATE,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_pago DECIMAL(10,2) DEFAULT 0.00,
    estado ENUM('rascunho', 'emitida', 'paga', 'vencida', 'cancelada') DEFAULT 'rascunho',
    observacoes TEXT,
    ficheiro_pdf VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE SET NULL,
    INDEX idx_numero_fatura (numero_fatura),
    INDEX idx_cliente (cliente_id),
    INDEX idx_processo (processo_id),
    INDEX idx_estado (estado),
    INDEX idx_data_emissao (data_emissao)
);

-- Tabela de Agenda/Compromissos
CREATE TABLE Agenda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solicitadora_id INT NOT NULL,
    processo_id INT,
    cliente_id INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_compromisso ENUM('reuniao', 'audiencia', 'prazo', 'telefonema', 'outro') NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    local VARCHAR(255),
    participantes TEXT,
    estado ENUM('agendado', 'realizado', 'cancelado', 'adiado') DEFAULT 'agendado',
    lembrete_minutos INT DEFAULT 15,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (solicitadora_id) REFERENCES Solicitadora(id) ON DELETE CASCADE,
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE SET NULL,
    INDEX idx_solicitadora (solicitadora_id),
    INDEX idx_processo (processo_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_tipo_compromisso (tipo_compromisso),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_estado (estado)
);

-- Tabela de Tarefas
CREATE TABLE Tarefa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solicitadora_id INT NOT NULL,
    processo_id INT,
    cliente_id INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
    estado ENUM('pendente', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'pendente',
    data_criacao DATE NOT NULL,
    data_vencimento DATE,
    data_conclusao DATE,
    observacoes TEXT,
    data_criacao_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (solicitadora_id) REFERENCES Solicitadora(id) ON DELETE CASCADE,
    FOREIGN KEY (processo_id) REFERENCES Processo(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) ON DELETE SET NULL,
    INDEX idx_solicitadora (solicitadora_id),
    INDEX idx_processo (processo_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_prioridade (prioridade),
    INDEX idx_estado (estado),
    INDEX idx_data_vencimento (data_vencimento)
);

-- Tabela de Utilizadores (para autenticação)
CREATE TABLE Utilizador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    perfil ENUM('admin', 'solicitadora', 'assistente') NOT NULL,
    solicitadora_id INT,
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP,
    tentativas_login INT DEFAULT 0,
    bloqueado_ate TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (solicitadora_id) REFERENCES Solicitadora(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_perfil (perfil),
    INDEX idx_ativo (ativo),
    INDEX idx_solicitadora (solicitadora_id)
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

-- Trigger para auditoria de Cliente
DELIMITER $$
CREATE TRIGGER tr_cliente_audit_insert
    AFTER INSERT ON Cliente
    FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Log (tabela_afetada, operacao, registro_id, dados_novos)
    VALUES ('Cliente', 'INSERT', NEW.id, JSON_OBJECT(
        'nome', NEW.nome,
        'nif', NEW.nif,
        'estado', NEW.estado
    ));
END$$

CREATE TRIGGER tr_cliente_audit_update
    AFTER UPDATE ON Cliente
    FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Log (tabela_afetada, operacao, registro_id, dados_anteriores, dados_novos)
    VALUES ('Cliente', 'UPDATE', NEW.id, 
        JSON_OBJECT('estado', OLD.estado, 'nome', OLD.nome),
        JSON_OBJECT('estado', NEW.estado, 'nome', NEW.nome)
    );
END$$
DELIMITER ;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View de Processos com Clientes
CREATE VIEW vw_processos_completos AS
SELECT 
    p.id,
    p.numero_processo,
    p.titulo,
    p.tipo_processo,
    p.estado,
    p.prioridade,
    p.data_abertura,
    p.data_vencimento,
    p.valor_causa,
    c.nome as cliente_nome,
    c.contacto_email as cliente_email,
    c.contacto_telefone as cliente_telefone,
    s.nome as solicitadora_nome,
    COUNT(d.id) as total_documentos,
    SUM(CASE WHEN h.estado = 'pago' THEN h.total ELSE 0 END) as honorarios_pagos,
    SUM(CASE WHEN h.estado != 'pago' THEN h.total ELSE 0 END) as honorarios_pendentes
FROM Processo p
LEFT JOIN Cliente c ON p.cliente_id = c.id
LEFT JOIN Solicitadora s ON p.solicitadora_id = s.id
LEFT JOIN Documento d ON p.id = d.processo_id
LEFT JOIN Honorario h ON p.id = h.processo_id
GROUP BY p.id;

-- View de Estatísticas Financeiras
CREATE VIEW vw_estatisticas_financeiras AS
SELECT 
    (SELECT COUNT(*) FROM Cliente WHERE estado = 'ativo') as clientes_ativos,
    (SELECT COUNT(*) FROM Processo WHERE estado = 'aberto' OR estado = 'em_andamento') as processos_ativos,
    (SELECT COUNT(*) FROM Processo WHERE estado = 'concluido') as processos_concluidos,
    (SELECT SUM(valor_total) FROM Fatura WHERE estado = 'paga') as receitas_totais,
    (SELECT SUM(valor) FROM Despesa WHERE estado = 'aprovado') as despesas_totais,
    (SELECT SUM(total) FROM Honorario WHERE estado = 'pago') as honorarios_pagos,
    (SELECT SUM(total) FROM Honorario WHERE estado = 'pendente') as honorarios_pendentes;

-- ========================================
-- PROCEDURES ÚTEIS
-- ========================================

-- Procedure para obter processos por cliente
DELIMITER $$
CREATE PROCEDURE sp_processos_por_cliente(IN cli_id INT)
BEGIN
    SELECT 
        p.id,
        p.numero_processo,
        p.titulo,
        p.tipo_processo,
        p.estado,
        p.data_abertura,
        p.data_vencimento,
        p.valor_causa
    FROM Processo p
    WHERE p.cliente_id = cli_id
    ORDER BY p.data_abertura DESC;
END$$
DELIMITER ;

-- Procedure para obter estatísticas por período
DELIMITER $$
CREATE PROCEDURE sp_estatisticas_periodo(IN data_inicio DATE, IN data_fim DATE)
BEGIN
    SELECT 
        COUNT(*) as total_processos,
        COUNT(CASE WHEN estado = 'aberto' THEN 1 END) as processos_abertos,
        COUNT(CASE WHEN estado = 'em_andamento' THEN 1 END) as processos_em_andamento,
        COUNT(CASE WHEN estado = 'concluido' THEN 1 END) as processos_concluidos,
        SUM(valor_causa) as valor_total_causas
    FROM Processo
    WHERE data_abertura BETWEEN data_inicio AND data_fim;
END$$
DELIMITER ;

-- ========================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ========================================

-- Índices compostos para consultas frequentes
CREATE INDEX idx_processo_cliente_estado ON Processo(cliente_id, estado);
CREATE INDEX idx_processo_data_abertura ON Processo(data_abertura);
CREATE INDEX idx_documento_processo_tipo ON Documento(processo_id, tipo_documento);
CREATE INDEX idx_honorario_processo_estado ON Honorario(processo_id, estado);
CREATE INDEX idx_agenda_solicitadora_data ON Agenda(solicitadora_id, data_inicio);
CREATE INDEX idx_tarefa_solicitadora_estado ON Tarefa(solicitadora_id, estado);

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
