-- =========================
-- SCHEMA SQLITE PARA SOLICITADORA
-- =========================

-- =========================
-- TABELA 1: CLIENTES
-- =========================
CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nif VARCHAR(15),
    morada TEXT,
    telefone VARCHAR(20),
    email TEXT,
    data_registo DATE DEFAULT CURRENT_DATE
);

-- =========================
-- TABELA 2: PROCESSOS
-- =========================
CREATE TABLE processos (
    id_processo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    numero_processo TEXT UNIQUE NOT NULL,
    tipo_processo TEXT,
    descricao TEXT,
    estado TEXT CHECK(estado IN ('Em curso', 'Concluído', 'Suspenso')) DEFAULT 'Em curso',
    data_abertura DATE DEFAULT CURRENT_DATE,
    data_conclusao DATE,
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
);

-- =========================
-- TABELA 3: DOCUMENTOS
-- =========================
CREATE TABLE documentos (
    id_documento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_processo INTEGER,
    nome_documento TEXT,
    tipo_documento TEXT,
    caminho_arquivo TEXT,
    data_upload DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_processo) REFERENCES processos (id_processo)
);

-- =========================
-- TABELA 4: FINANCEIRO
-- =========================
CREATE TABLE financeiro (
    id_financeiro INTEGER PRIMARY KEY AUTOINCREMENT,
    id_processo INTEGER,
    tipo TEXT CHECK(tipo IN ('Honorário', 'Despesa', 'Pagamento')),
    descricao TEXT,
    valor REAL,
    data_registo DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK(status IN ('Pendente', 'Pago')) DEFAULT 'Pendente',
    FOREIGN KEY (id_processo) REFERENCES processos (id_processo)
);

-- =========================
-- TABELA 5: AGENDA
-- =========================
CREATE TABLE agenda (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_processo INTEGER,
    titulo TEXT NOT NULL,
    data_evento DATETIME,
    observacoes TEXT,
    FOREIGN KEY (id_processo) REFERENCES processos (id_processo)
);

-- =========================
-- TABELA 6: USUÁRIO / SOLICITADORA
-- =========================
CREATE TABLE solicitadora (
    id_solicitadora INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    nif TEXT,
    email TEXT,
    telefone TEXT,
    morada TEXT
);

-- =========================
-- DADOS INICIAIS
-- =========================

-- Inserir Solicitadora
INSERT INTO solicitadora (nome, nif, email, telefone, morada) VALUES 
('Maria Silva Santos', '123456789', 'maria.santos@solicitadora.pt', '+351 912 345 678', 'Rua da Justiça, 123');

-- Inserir Clientes
INSERT INTO clientes (nome, nif, morada, telefone, email) VALUES 
('João Manuel Ferreira', '987654321', 'Rua das Flores, 45', '+351 911 222 333', 'joao.ferreira@email.com'),
('Ana Cristina Oliveira', '456789123', 'Avenida Central, 78', '+351 922 333 444', 'ana.oliveira@email.com'),
('Empresa ABC, Lda', '123456789', 'Rua Comercial, 100', '+351 213 456 789', 'geral@empresaabc.pt');

-- Inserir Processos
INSERT INTO processos (id_cliente, numero_processo, tipo_processo, descricao, estado, data_abertura) VALUES 
(1, 'PROC-2024-001', 'Civil', 'Ação de Divórcio', 'Em curso', '2024-01-15'),
(2, 'PROC-2024-002', 'Trabalho', 'Contrato de Trabalho', 'Em curso', '2024-02-01'),
(3, 'PROC-2024-003', 'Comercial', 'Contrato Comercial', 'Concluído', '2024-01-10');

-- Inserir Documentos
INSERT INTO documentos (id_processo, nome_documento, tipo_documento, caminho_arquivo, data_upload) VALUES 
(1, 'Petição Inicial', 'Petição', '/uploads/peticao_001.pdf', '2024-01-15'),
(1, 'Certidão de Casamento', 'Certidão', '/uploads/certidao_casamento.pdf', '2024-01-10'),
(2, 'Contrato de Trabalho', 'Contrato', '/uploads/contrato_trabalho.pdf', '2024-02-01');

-- Inserir Financeiro
INSERT INTO financeiro (id_processo, tipo, descricao, valor, data_registo, status) VALUES 
(1, 'Honorário', 'Honorários iniciais - Divórcio', 1000.00, '2024-01-15', 'Pago'),
(1, 'Honorário', 'Honorários por hora - Consultas', 375.00, '2024-02-01', 'Pendente'),
(2, 'Honorário', 'Honorários - Revisão Contrato', 500.00, '2024-02-01', 'Pendente'),
(1, 'Despesa', 'Deslocação ao Tribunal', 25.50, '2024-01-20', 'Pago');

-- Inserir Agenda
INSERT INTO agenda (id_processo, titulo, data_evento, observacoes) VALUES 
(1, 'Reunião com Cliente - Divórcio', '2024-03-15 14:00:00', 'Preparar documentação necessária'),
(2, 'Audiência no Tribunal', '2024-03-20 10:00:00', 'Levar toda a documentação do processo'),
(1, 'Consulta Inicial', '2024-03-25 16:00:00', 'Avaliar o caso e definir estratégia');
