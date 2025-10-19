-- ========================================
-- DADOS INICIAIS PARA SISTEMA DE SOLICITADORA
-- ========================================

-- Inserir Solicitadora Principal
INSERT INTO Solicitadora (
    nome, nif, cedula, contacto_email, contacto_telefone, 
    morada, codigo_postal, localidade, distrito, 
    data_nascimento, genero, especializacoes, data_inscricao, estado
) VALUES (
    'Maria Silva Santos',
    '123456789',
    'SOL-001',
    'maria.santos@solicitadora.pt',
    '+351 912 345 678',
    'Rua da Justiça, 123',
    '1000-001',
    'Lisboa',
    'Lisboa',
    '1985-03-15',
    'F',
    'Direito Civil, Direito Comercial, Direito do Trabalho',
    '2010-06-01',
    'ativo'
);

-- Inserir Utilizador Admin
INSERT INTO Utilizador (
    username, password_hash, perfil, solicitadora_id, ativo
) VALUES (
    'admin',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    1,
    TRUE
);

-- Inserir Utilizador Solicitadora
INSERT INTO Utilizador (
    username, password_hash, perfil, solicitadora_id, ativo
) VALUES (
    'maria.santos',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'solicitadora',
    1,
    TRUE
);

-- Inserir Clientes de Exemplo
INSERT INTO Cliente (
    nome, nif, contacto_email, contacto_telefone, morada, 
    codigo_postal, localidade, distrito, data_nascimento, 
    genero, profissao, tipo_cliente, estado
) VALUES 
(
    'João Manuel Ferreira',
    '987654321',
    'joao.ferreira@email.com',
    '+351 911 222 333',
    'Rua das Flores, 45',
    '2000-100',
    'Santarém',
    'Santarém',
    '1978-05-20',
    'M',
    'Empresário',
    'pessoa_singular',
    'ativo'
),
(
    'Ana Cristina Oliveira',
    '456789123',
    'ana.oliveira@email.com',
    '+351 922 333 444',
    'Avenida Central, 78',
    '3000-200',
    'Coimbra',
    'Coimbra',
    '1982-11-10',
    'F',
    'Professora',
    'pessoa_singular',
    'ativo'
),
(
    'Empresa ABC, Lda',
    '123456789',
    'geral@empresaabc.pt',
    '+351 213 456 789',
    'Rua Comercial, 100',
    '1000-200',
    'Lisboa',
    'Lisboa',
    NULL,
    NULL,
    'Comércio',
    'pessoa_coletiva',
    'ativo'
),
(
    'Carlos Alberto Silva',
    '789123456',
    'carlos.silva@email.com',
    '+351 933 444 555',
    'Travessa da Paz, 12',
    '4000-300',
    'Porto',
    'Porto',
    '1975-08-25',
    'M',
    'Engenheiro',
    'pessoa_singular',
    'ativo'
);

-- Inserir Processos de Exemplo
INSERT INTO Processo (
    numero_processo, cliente_id, solicitadora_id, titulo, descricao,
    tipo_processo, estado, prioridade, data_abertura, data_vencimento,
    valor_causa, observacoes, tribunal
) VALUES 
(
    'PROC-2024-001',
    1,
    1,
    'Ação de Divórcio',
    'Processo de divórcio por mútuo consentimento',
    'civil',
    'em_andamento',
    'alta',
    '2024-01-15',
    '2024-06-15',
    5000.00,
    'Processo em fase de negociação',
    'Tribunal de Família de Santarém'
),
(
    'PROC-2024-002',
    2,
    1,
    'Contrato de Trabalho',
    'Revisão de contrato de trabalho e direitos laborais',
    'trabalho',
    'aberto',
    'media',
    '2024-02-01',
    '2024-05-01',
    2000.00,
    'Aguardando documentação do cliente',
    'Tribunal do Trabalho de Coimbra'
),
(
    'PROC-2024-003',
    3,
    1,
    'Contrato Comercial',
    'Elaboração e revisão de contratos comerciais',
    'comercial',
    'concluido',
    'baixa',
    '2024-01-10',
    '2024-03-10',
    1500.00,
    'Processo concluído com sucesso',
    'Tribunal Comercial de Lisboa'
),
(
    'PROC-2024-004',
    4,
    1,
    'Propriedade Intelectual',
    'Registo de marca e proteção de propriedade intelectual',
    'civil',
    'aberto',
    'media',
    '2024-02-15',
    '2024-08-15',
    3000.00,
    'Processo em fase inicial',
    'INPI - Instituto Nacional da Propriedade Industrial'
);

-- Inserir Documentos de Exemplo
INSERT INTO Documento (
    processo_id, titulo, descricao, tipo_documento, 
    ficheiro_nome, data_documento, observacoes, estado
) VALUES 
(
    1,
    'Petição Inicial',
    'Petição inicial do processo de divórcio',
    'peticao',
    'peticao_divorcio_001.pdf',
    '2024-01-15',
    'Documento principal do processo',
    'final'
),
(
    1,
    'Certidão de Casamento',
    'Certidão de casamento dos cônjuges',
    'certidao',
    'certidao_casamento.pdf',
    '2024-01-10',
    'Documento de suporte',
    'aprovado'
),
(
    2,
    'Contrato de Trabalho Original',
    'Contrato de trabalho a ser revisto',
    'contrato',
    'contrato_trabalho_original.pdf',
    '2024-01-20',
    'Documento base para análise',
    'final'
),
(
    3,
    'Contrato Comercial Final',
    'Contrato comercial elaborado',
    'contrato',
    'contrato_comercial_final.pdf',
    '2024-03-05',
    'Contrato finalizado e assinado',
    'aprovado'
);

-- Inserir Honorários de Exemplo
INSERT INTO Honorario (
    processo_id, descricao, tipo_honorario, valor, quantidade, total,
    data_honorario, estado, observacoes
) VALUES 
(
    1,
    'Honorários iniciais - Divórcio',
    'fixo',
    1000.00,
    1.00,
    1000.00,
    '2024-01-15',
    'pago',
    'Pagamento inicial do processo'
),
(
    1,
    'Honorários por hora - Consultas',
    'por_hora',
    75.00,
    5.00,
    375.00,
    '2024-02-01',
    'pendente',
    'Consultas adicionais com cliente'
),
(
    2,
    'Honorários - Revisão Contrato',
    'fixo',
    500.00,
    1.00,
    500.00,
    '2024-02-01',
    'pendente',
    'Honorários pela revisão do contrato'
),
(
    3,
    'Honorários - Elaboração Contrato',
    'fixo',
    800.00,
    1.00,
    800.00,
    '2024-01-10',
    'pago',
    'Honorários pela elaboração do contrato'
);

-- Inserir Despesas de Exemplo
INSERT INTO Despesa (
    processo_id, solicitadora_id, descricao, categoria, valor,
    data_despesa, observacoes, reembolsavel, estado
) VALUES 
(
    1,
    1,
    'Deslocação ao Tribunal',
    'deslocacao',
    25.50,
    '2024-01-20',
    'Deslocação para entrega de documentos',
    TRUE,
    'aprovado'
),
(
    1,
    1,
    'Fotocópias de Documentos',
    'documentos',
    15.00,
    '2024-01-18',
    'Fotocópias necessárias para o processo',
    TRUE,
    'aprovado'
),
(
    2,
    1,
    'Chamadas Telefónicas',
    'comunicacoes',
    8.50,
    '2024-02-05',
    'Comunicações com cliente e entidades',
    TRUE,
    'pendente'
),
(
    NULL,
    1,
    'Subscrição Revista Jurídica',
    'pesquisas',
    45.00,
    '2024-01-01',
    'Subscrição anual para pesquisa jurídica',
    FALSE,
    'aprovado'
);

-- Inserir Pagamentos de Exemplo
INSERT INTO Pagamento (
    cliente_id, processo_id, valor, data_pagamento, metodo_pagamento,
    referencia, observacoes, estado
) VALUES 
(
    1,
    1,
    1000.00,
    '2024-01-20',
    'transferencia',
    'TXN-001-2024',
    'Pagamento inicial do processo de divórcio',
    'confirmado'
),
(
    2,
    2,
    250.00,
    '2024-02-10',
    'multibanco',
    'MB-002-2024',
    'Pagamento parcial dos honorários',
    'confirmado'
),
(
    3,
    3,
    800.00,
    '2024-03-15',
    'transferencia',
    'TXN-003-2024',
    'Pagamento total dos honorários',
    'confirmado'
);

-- Inserir Faturas de Exemplo
INSERT INTO Fatura (
    numero_fatura, cliente_id, processo_id, data_emissao, data_vencimento,
    valor_total, valor_pago, estado, observacoes
) VALUES 
(
    'FAT-2024-001',
    1,
    1,
    '2024-01-20',
    '2024-02-20',
    1000.00,
    1000.00,
    'paga',
    'Fatura dos honorários iniciais'
),
(
    'FAT-2024-002',
    2,
    2,
    '2024-02-01',
    '2024-03-01',
    500.00,
    250.00,
    'emitida',
    'Fatura dos honorários - pagamento parcial'
),
(
    'FAT-2024-003',
    3,
    3,
    '2024-03-10',
    '2024-04-10',
    800.00,
    800.00,
    'paga',
    'Fatura dos honorários - paga integralmente'
);

-- Inserir Agenda/Compromissos de Exemplo
INSERT INTO Agenda (
    solicitadora_id, processo_id, cliente_id, titulo, descricao,
    tipo_compromisso, data_inicio, data_fim, local, participantes,
    estado, lembrete_minutos, observacoes
) VALUES 
(
    1,
    1,
    1,
    'Reunião com Cliente - Divórcio',
    'Reunião para discussão dos termos do divórcio',
    'reuniao',
    '2024-03-15 14:00:00',
    '2024-03-15 15:30:00',
    'Escritório',
    'Maria Santos, João Ferreira',
    'agendado',
    30,
    'Preparar documentação necessária'
),
(
    1,
    2,
    2,
    'Audiência no Tribunal',
    'Audiência para discussão do contrato de trabalho',
    'audiencia',
    '2024-03-20 10:00:00',
    '2024-03-20 12:00:00',
    'Tribunal do Trabalho de Coimbra',
    'Maria Santos, Ana Oliveira, Juiz',
    'agendado',
    60,
    'Levar toda a documentação do processo'
),
(
    1,
    NULL,
    4,
    'Consulta Inicial',
    'Primeira consulta com novo cliente',
    'reuniao',
    '2024-03-25 16:00:00',
    '2024-03-25 17:00:00',
    'Escritório',
    'Maria Santos, Carlos Silva',
    'agendado',
    15,
    'Avaliar o caso e definir estratégia'
);

-- Inserir Tarefas de Exemplo
INSERT INTO Tarefa (
    solicitadora_id, processo_id, cliente_id, titulo, descricao,
    prioridade, estado, data_criacao, data_vencimento, observacoes
) VALUES 
(
    1,
    1,
    1,
    'Preparar Documentos para Audiência',
    'Organizar toda a documentação necessária para a audiência',
    'alta',
    'pendente',
    '2024-03-10',
    '2024-03-18',
    'Incluir certidões, contratos e provas'
),
(
    1,
    2,
    2,
    'Contactar Entidade Patronal',
    'Entrar em contacto com a empresa para negociação',
    'media',
    'em_andamento',
    '2024-03-05',
    '2024-03-15',
    'Tentar acordo extrajudicial'
),
(
    1,
    NULL,
    4,
    'Pesquisar Jurisprudência',
    'Pesquisar casos similares para fundamentar o pedido',
    'media',
    'pendente',
    '2024-03-12',
    '2024-03-20',
    'Focar em casos recentes do mesmo tribunal'
),
(
    1,
    1,
    1,
    'Atualizar Cliente sobre Progresso',
    'Informar cliente sobre o estado atual do processo',
    'baixa',
    'pendente',
    '2024-03-14',
    '2024-03-16',
    'Telefonema ou email com resumo'
);

-- ========================================
-- DADOS INICIAIS INSERIDOS COM SUCESSO!
-- ========================================
