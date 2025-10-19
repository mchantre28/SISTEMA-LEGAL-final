-- ========================================
-- DADOS INICIAIS DO NOVO PROJETO LOCAL
-- Sistema de Gestão Empresarial
-- ========================================

-- Limpar dados existentes (se necessário)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Auditoria_Log;
TRUNCATE TABLE Utilizador;
TRUNCATE TABLE Historico_Registo;
TRUNCATE TABLE Profissional_Especializacao;
TRUNCATE TABLE Profissional;
TRUNCATE TABLE Escritorio;
TRUNCATE TABLE Especializacao;
TRUNCATE TABLE Localizacao;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- LOCALIZAÇÕES
-- ========================================

INSERT INTO Localizacao (distrito, concelho, freguesia, codigo_postal, latitude, longitude) VALUES
-- Lisboa
('Lisboa', 'Lisboa', 'Areeiro', '1000-001', 38.7369, -9.1427),
('Lisboa', 'Lisboa', 'Campo de Ourique', '1350-000', 38.7147, -9.1631),
('Lisboa', 'Lisboa', 'Estrela', '1200-000', 38.7108, -9.1427),
('Lisboa', 'Lisboa', 'Misericórdia', '1200-000', 38.7108, -9.1427),
('Lisboa', 'Lisboa', 'Santo António', '1150-000', 38.7108, -9.1427),

-- Porto
('Porto', 'Porto', 'Cedofeita', '4050-180', 41.1579, -8.6291),
('Porto', 'Porto', 'Lordelo do Ouro', '4150-000', 41.1579, -8.6291),
('Porto', 'Porto', 'Massarelos', '4050-000', 41.1579, -8.6291),
('Porto', 'Porto', 'Miragaia', '4050-000', 41.1579, -8.6291),
('Porto', 'Porto', 'Nevogilde', '4100-000', 41.1579, -8.6291),

-- Coimbra
('Coimbra', 'Coimbra', 'Sé Nova', '3000-213', 40.2033, -8.4103),
('Coimbra', 'Coimbra', 'Sé Velha', '3000-000', 40.2033, -8.4103),
('Coimbra', 'Coimbra', 'Santa Clara', '3040-000', 40.2033, -8.4103),

-- Braga
('Braga', 'Braga', 'São José de São Lázaro', '4700-000', 41.5518, -8.4229),
('Braga', 'Braga', 'São Paio de Merelim', '4700-000', 41.5518, -8.4229),
('Braga', 'Braga', 'São Vicente', '4700-000', 41.5518, -8.4229),

-- Aveiro
('Aveiro', 'Aveiro', 'Glória', '3800-001', 40.6405, -8.6538),
('Aveiro', 'Aveiro', 'Nariz', '3800-000', 40.6405, -8.6538),
('Aveiro', 'Aveiro', 'Requeixo', '3800-000', 40.6405, -8.6538),

-- Faro
('Faro', 'Faro', 'Sé', '8000-000', 37.0194, -7.9322),
('Faro', 'Faro', 'São Pedro', '8000-000', 37.0194, -7.9322),

-- Setúbal
('Setúbal', 'Setúbal', 'Nossa Senhora da Anunciada', '2900-000', 38.5244, -8.8882),
('Setúbal', 'Setúbal', 'São Sebastião', '2900-000', 38.5244, -8.8882);

-- ========================================
-- ESPECIALIZAÇÕES
-- ========================================

INSERT INTO Especializacao (descricao, categoria) VALUES
-- Direito Civil
('Direito Civil Geral', 'Civil'),
('Direito da Família', 'Civil'),
('Direito das Sucessões', 'Civil'),
('Direito das Obrigações', 'Civil'),
('Direito dos Contratos', 'Civil'),

-- Direito Penal
('Direito Penal Geral', 'Penal'),
('Direito Penal Económico', 'Penal'),
('Direito Penal Tributário', 'Penal'),
('Direito Penal Informático', 'Penal'),

-- Direito Comercial
('Direito Comercial', 'Comercial'),
('Direito Societário', 'Comercial'),
('Direito Bancário', 'Comercial'),
('Direito dos Valores Mobiliários', 'Comercial'),
('Direito da Concorrência', 'Comercial'),

-- Direito do Trabalho
('Direito do Trabalho', 'Trabalho'),
('Direito da Segurança Social', 'Trabalho'),
('Direito Sindical', 'Trabalho'),

-- Direito Fiscal
('Direito Fiscal', 'Fiscal'),
('Direito Aduaneiro', 'Fiscal'),
('Direito Tributário Internacional', 'Fiscal'),

-- Direito Administrativo
('Direito Administrativo', 'Administrativo'),
('Direito do Urbanismo', 'Administrativo'),
('Direito do Ambiente', 'Administrativo'),
('Direito da Saúde', 'Administrativo'),

-- Direito do Consumo
('Direito do Consumo', 'Consumo'),
('Direito da Publicidade', 'Consumo'),

-- Direito Imobiliário
('Direito Imobiliário', 'Imobiliário'),
('Direito da Propriedade Intelectual', 'Imobiliário'),

-- Outros
('Direito Europeu', 'Internacional'),
('Direito Internacional Privado', 'Internacional'),
('Direito da União Europeia', 'Internacional'),
('Direito dos Seguros', 'Especializado'),
('Direito Desportivo', 'Especializado'),
('Direito da Comunicação Social', 'Especializado');

-- ========================================
-- ESCRITÓRIOS
-- ========================================

INSERT INTO Escritorio (nome, contacto_email, contacto_telefone, website, localizacao_id) VALUES
-- Lisboa
('Silva & Associados - Sociedade de Advogados', 'geral@silvaassociados.pt', '213456789', 'www.silvaassociados.pt', 1),
('Advocacia Lisboa Legal', 'info@lisboalegal.pt', '213567890', 'www.lisboalegal.pt', 2),
('Sociedade de Advogados Capital', 'contacto@capitaladv.pt', '213678901', 'www.capitaladv.pt', 3),
('Escritório Jurídico Central', 'geral@centraljuridico.pt', '213789012', 'www.centraljuridico.pt', 4),
('Advocacia Moderna', 'info@modernaadv.pt', '213890123', 'www.modernaadv.pt', 5),

-- Porto
('Porto Legal - Sociedade de Advogados', 'info@portolegal.pt', '225678901', 'www.portolegal.pt', 6),
('Advocacia Norte', 'geral@norteadv.pt', '225789012', 'www.norteadv.pt', 7),
('Escritório Jurídico do Porto', 'contacto@portojuridico.pt', '225890123', 'www.portojuridico.pt', 8),
('Sociedade de Advogados Douro', 'info@douroadv.pt', '225901234', 'www.douroadv.pt', 9),
('Advocacia Porto Centro', 'geral@portocentro.pt', '225012345', 'www.portocentro.pt', 10),

-- Coimbra
('Coimbra Legal - Sociedade de Advogados', 'contacto@coimbralegal.pt', '239123456', 'www.coimbralegal.pt', 11),
('Advocacia Académica', 'info@academicaadv.pt', '239234567', 'www.academicaadv.pt', 12),
('Escritório Jurídico Universitário', 'geral@universitariojuridico.pt', '239345678', 'www.universitariojuridico.pt', 13),

-- Braga
('Braga Jurídico - Sociedade de Advogados', 'geral@bragajuridico.pt', '253789012', 'www.bragajuridico.pt', 14),
('Advocacia Minho', 'info@minhoadv.pt', '253890123', 'www.minhoadv.pt', 15),
('Escritório Jurídico Bracarense', 'contacto@bracarensejuridico.pt', '253901234', 'www.bracarensejuridico.pt', 16),

-- Aveiro
('Aveiro Legal Partners', 'info@aveirolegal.pt', '234567890', 'www.aveirolegal.pt', 17),
('Advocacia Ria', 'geral@riaadv.pt', '234678901', 'www.riaadv.pt', 18),
('Escritório Jurídico Aveirense', 'contacto@aveirensejuridico.pt', '234789012', 'www.aveirensejuridico.pt', 19),

-- Faro
('Faro Legal - Sociedade de Advogados', 'info@farolegal.pt', '289123456', 'www.farolegal.pt', 20),
('Advocacia Algarve', 'geral@algarveadv.pt', '289234567', 'www.algarveadv.pt', 21),

-- Setúbal
('Setúbal Jurídico', 'contacto@setubaljuridico.pt', '265123456', 'www.setubaljuridico.pt', 22),
('Advocacia Península', 'info@peninsulaadv.pt', '265234567', 'www.peninsulaadv.pt', 23);

-- ========================================
-- PROFISSIONAIS
-- ========================================

INSERT INTO Profissional (nome, nif, cedula, data_inscricao, estado, contacto_email, contacto_tel, data_nascimento, genero, localizacao_id, escritorio_id) VALUES
-- Lisboa
('Dr. João Carlos Silva', '123456789', 'CED001', '2020-01-15', 'ativo', 'joao.silva@silvaassociados.pt', '213456789', '1980-05-15', 'M', 1, 1),
('Dra. Maria Fernanda Santos', '987654321', 'CED002', '2019-03-20', 'ativo', 'maria.santos@silvaassociados.pt', '213456790', '1985-08-22', 'F', 1, 1),
('Dr. Pedro Miguel Oliveira', '456789123', 'CED003', '2021-06-10', 'ativo', 'pedro.oliveira@lisboalegal.pt', '213567891', '1978-12-03', 'M', 2, 2),
('Dra. Ana Paula Costa', '789123456', 'CED004', '2018-09-05', 'ativo', 'ana.costa@capitaladv.pt', '213678902', '1982-04-18', 'F', 3, 3),
('Dr. Carlos Manuel Mendes', '321654987', 'CED005', '2022-02-28', 'ativo', 'carlos.mendes@centraljuridico.pt', '213789013', '1975-11-30', 'M', 4, 4),

-- Porto
('Dr. António José Ferreira', '654321987', 'CED006', '2019-07-12', 'ativo', 'antonio.ferreira@portolegal.pt', '225678902', '1983-03-25', 'M', 6, 6),
('Dra. Isabel Cristina Rodrigues', '147258369', 'CED007', '2020-11-08', 'ativo', 'isabel.rodrigues@norteadv.pt', '225789013', '1987-09-14', 'F', 7, 7),
('Dr. Rui Manuel Alves', '369258147', 'CED008', '2021-04-20', 'ativo', 'rui.alves@portojuridico.pt', '225890124', '1981-06-07', 'M', 8, 8),
('Dra. Sofia Alexandra Martins', '258147369', 'CED009', '2018-12-15', 'ativo', 'sofia.martins@douroadv.pt', '225901235', '1984-01-28', 'F', 9, 9),
('Dr. Miguel Ângelo Sousa', '741852963', 'CED010', '2020-08-03', 'ativo', 'miguel.sousa@portocentro.pt', '225012346', '1979-10-12', 'M', 10, 10),

-- Coimbra
('Dr. Francisco Manuel Lopes', '852963741', 'CED011', '2019-05-18', 'ativo', 'francisco.lopes@coimbralegal.pt', '239234568', '1986-07-05', 'M', 11, 11),
('Dra. Teresa Maria Gomes', '963741852', 'CED012', '2021-01-22', 'ativo', 'teresa.gomes@academicaadv.pt', '239345679', '1988-02-16', 'F', 12, 12),
('Dr. José António Pereira', '741963852', 'CED013', '2020-10-30', 'ativo', 'jose.pereira@universitariojuridico.pt', '239456780', '1980-12-09', 'M', 13, 13),

-- Braga
('Dr. Luís Filipe Teixeira', '159753486', 'CED014', '2018-06-14', 'ativo', 'luis.teixeira@bragajuridico.pt', '253890124', '1977-04-21', 'M', 14, 14),
('Dra. Catarina Isabel Silva', '486159753', 'CED015', '2021-09-27', 'ativo', 'catarina.silva@minhoadv.pt', '253901235', '1989-11-03', 'F', 15, 15),
('Dr. Nuno Miguel Fernandes', '753486159', 'CED016', '2019-12-11', 'ativo', 'nuno.fernandes@bracarensejuridico.pt', '253012346', '1983-08-17', 'M', 16, 16),

-- Aveiro
('Dr. Ricardo Manuel Castro', '357159486', 'CED017', '2020-03-25', 'ativo', 'ricardo.castro@aveirolegal.pt', '234678902', '1985-05-30', 'M', 17, 17),
('Dra. Patrícia Alexandra Lima', '486357159', 'CED018', '2021-07-08', 'ativo', 'patricia.lima@riaadv.pt', '234789013', '1987-01-13', 'F', 18, 18),
('Dr. André Miguel Rocha', '159486357', 'CED019', '2019-11-19', 'ativo', 'andre.rocha@aveirensejuridico.pt', '234890124', '1981-09-26', 'M', 19, 19),

-- Faro
('Dr. Sérgio Manuel Dias', '753159486', 'CED020', '2020-04-12', 'ativo', 'sergio.dias@farolegal.pt', '289234568', '1984-06-08', 'M', 20, 20),
('Dra. Mónica Isabel Correia', '486753159', 'CED021', '2021-08-16', 'ativo', 'monica.correia@algarveadv.pt', '289345679', '1986-03-24', 'F', 21, 21),

-- Setúbal
('Dr. Paulo José Monteiro', '159753486', 'CED022', '2019-02-07', 'ativo', 'paulo.monteiro@setubaljuridico.pt', '265234568', '1982-10-11', 'M', 22, 22),
('Dra. Sandra Maria Vieira', '486159753', 'CED023', '2020-12-23', 'ativo', 'sandra.vieira@peninsulaadv.pt', '265345679', '1988-07-19', 'F', 23, 23);

-- ========================================
-- ESPECIALIZAÇÕES DOS PROFISSIONAIS
-- ========================================

INSERT INTO Profissional_Especializacao (profissional_id, especializacao_id, nivel, data_especializacao, certificado) VALUES
-- Dr. João Carlos Silva (Civil, Comercial, Família)
(1, 1, 'especialista', '2020-06-15', 'Certificado Especialista Civil'),
(1, 10, 'avançado', '2020-08-20', 'Certificado Comercial Avançado'),
(1, 2, 'especialista', '2021-03-10', 'Certificado Família Especialista'),

-- Dra. Maria Fernanda Santos (Penal, Trabalho, Consumo)
(2, 6, 'especialista', '2019-09-20', 'Certificado Penal Especialista'),
(2, 14, 'avançado', '2020-01-15', 'Certificado Trabalho Avançado'),
(2, 20, 'intermédio', '2020-05-30', 'Certificado Consumo Intermédio'),

-- Dr. Pedro Miguel Oliveira (Civil, Fiscal, Administrativo)
(3, 1, 'avançado', '2021-08-10', 'Certificado Civil Avançado'),
(3, 16, 'especialista', '2021-12-05', 'Certificado Fiscal Especialista'),
(3, 18, 'avançado', '2022-02-20', 'Certificado Administrativo Avançado'),

-- Dra. Ana Paula Costa (Penal, Família, Bancário)
(4, 6, 'avançado', '2018-12-15', 'Certificado Penal Avançado'),
(4, 2, 'especialista', '2019-06-20', 'Certificado Família Especialista'),
(4, 12, 'avançado', '2019-10-12', 'Certificado Bancário Avançado'),

-- Dr. Carlos Manuel Mendes (Comercial, Administrativo, Imobiliário)
(5, 10, 'especialista', '2022-04-18', 'Certificado Comercial Especialista'),
(5, 18, 'avançado', '2022-06-25', 'Certificado Administrativo Avançado'),
(5, 22, 'intermédio', '2022-08-30', 'Certificado Imobiliário Intermédio');

-- ========================================
-- HISTÓRICO DE REGISTOS
-- ========================================

INSERT INTO Historico_Registo (profissional_id, tipo_ato, data, observacoes, valor, status) VALUES
-- Dr. João Carlos Silva
(1, 'Inscrição na Ordem dos Advogados', '2020-01-15', 'Inscrição inicial como advogado', 150.00, 'aprovado'),
(1, 'Especialização em Direito Civil', '2020-06-15', 'Conclusão de curso de especialização', 500.00, 'aprovado'),
(1, 'Certificação em Direito Comercial', '2020-08-20', 'Certificação em direito comercial avançado', 300.00, 'aprovado'),
(1, 'Participação em Congresso Jurídico', '2021-03-10', 'Participação no Congresso Nacional de Direito', 200.00, 'aprovado'),

-- Dra. Maria Fernanda Santos
(2, 'Inscrição na Ordem dos Advogados', '2019-03-20', 'Inscrição inicial como advogada', 150.00, 'aprovado'),
(2, 'Especialização em Direito Penal', '2019-09-20', 'Certificação em direito penal avançado', 400.00, 'aprovado'),
(2, 'Curso de Direito do Trabalho', '2020-01-15', 'Formação especializada em direito do trabalho', 350.00, 'aprovado'),
(2, 'Seminário de Direito do Consumo', '2020-05-30', 'Participação em seminário especializado', 150.00, 'aprovado'),

-- Dr. Pedro Miguel Oliveira
(3, 'Inscrição na Ordem dos Advogados', '2021-06-10', 'Inscrição inicial como advogado', 150.00, 'aprovado'),
(3, 'Formação em Direito Civil', '2021-08-10', 'Curso avançado de direito civil', 400.00, 'aprovado'),
(3, 'Especialização Fiscal', '2021-12-05', 'Certificação em direito fiscal', 600.00, 'aprovado'),
(3, 'Curso de Direito Administrativo', '2022-02-20', 'Formação em direito administrativo', 450.00, 'aprovado'),

-- Dra. Ana Paula Costa
(4, 'Inscrição na Ordem dos Advogados', '2018-09-05', 'Inscrição inicial como advogada', 150.00, 'aprovado'),
(4, 'Especialização Penal', '2018-12-15', 'Certificação em direito penal', 400.00, 'aprovado'),
(4, 'Curso de Direito da Família', '2019-06-20', 'Formação especializada em direito da família', 350.00, 'aprovado'),
(4, 'Formação Bancária', '2019-10-12', 'Curso de direito bancário', 300.00, 'aprovado'),

-- Dr. Carlos Manuel Mendes
(5, 'Inscrição na Ordem dos Advogados', '2022-02-28', 'Inscrição inicial como advogado', 150.00, 'aprovado'),
(5, 'Especialização Comercial', '2022-04-18', 'Certificação em direito comercial', 500.00, 'aprovado'),
(5, 'Curso Administrativo', '2022-06-25', 'Formação em direito administrativo', 400.00, 'aprovado'),
(5, 'Formação Imobiliária', '2022-08-30', 'Curso de direito imobiliário', 300.00, 'aprovado');

-- ========================================
-- UTILIZADORES
-- ========================================

INSERT INTO Utilizador (username, password_hash, perfil, profissional_id) VALUES
-- Administradores
('admin', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'admin', NULL),
('gestor.sistema', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'gestor', NULL),

-- Profissionais
('joao.silva', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 1),
('maria.santos', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 2),
('pedro.oliveira', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 3),
('ana.costa', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 4),
('carlos.mendes', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 5),
('antonio.ferreira', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 6),
('isabel.rodrigues', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 7),
('rui.alves', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 8),
('sofia.martins', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 9),
('miguel.sousa', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'profissional', 10),

-- Utilizadores públicos
('publico1', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'publico', NULL),
('publico2', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'publico', NULL),
('cliente.teste', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6u', 'publico', NULL);

-- ========================================
-- LOGS DE AUDITORIA INICIAIS
-- ========================================

INSERT INTO Auditoria_Log (tabela_afetada, operacao, utilizador_id, registro_id, dados_novos, ip_address, detalhes) VALUES
('Profissional', 'INSERT', 1, 1, JSON_OBJECT('nome', 'Dr. João Carlos Silva', 'nif', '123456789', 'cedula', 'CED001'), '127.0.0.1', 'Criação inicial do profissional'),
('Profissional', 'INSERT', 1, 2, JSON_OBJECT('nome', 'Dra. Maria Fernanda Santos', 'nif', '987654321', 'cedula', 'CED002'), '127.0.0.1', 'Criação inicial do profissional'),
('Escritorio', 'INSERT', 1, 1, JSON_OBJECT('nome', 'Silva & Associados - Sociedade de Advogados', 'contacto_email', 'geral@silvaassociados.pt'), '127.0.0.1', 'Criação inicial do escritório'),
('Utilizador', 'INSERT', 1, 1, JSON_OBJECT('username', 'admin', 'perfil', 'admin'), '127.0.0.1', 'Criação do utilizador administrador'),
('Especializacao', 'INSERT', 1, 1, JSON_OBJECT('descricao', 'Direito Civil Geral', 'categoria', 'Civil'), '127.0.0.1', 'Criação da especialização'),
('Localizacao', 'INSERT', 1, 1, JSON_OBJECT('distrito', 'Lisboa', 'concelho', 'Lisboa', 'freguesia', 'Areeiro'), '127.0.0.1', 'Criação da localização');

-- ========================================
-- DADOS CRIADOS COM SUCESSO!
-- ========================================

-- Verificar dados inseridos
SELECT 'Dados inseridos com sucesso!' as status;
SELECT COUNT(*) as total_profissionais FROM Profissional;
SELECT COUNT(*) as total_escritorios FROM Escritorio;
SELECT COUNT(*) as total_especializacoes FROM Especializacao;
SELECT COUNT(*) as total_localizacoes FROM Localizacao;
SELECT COUNT(*) as total_utilizadores FROM Utilizador;
SELECT COUNT(*) as total_historico FROM Historico_Registo;
SELECT COUNT(*) as total_auditoria FROM Auditoria_Log;