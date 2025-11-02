const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config({ path: '../config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'solicitadora_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Configuração do Multer para upload de ficheiros
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/documents';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de ficheiro não permitido'));
        }
    }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Middleware de auditoria
const auditLog = async (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        if (req.method !== 'GET') {
            const logData = {
                tabela_afetada: req.route?.path || 'unknown',
                operacao: req.method,
                utilizador_id: req.user?.id || null,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                detalhes: `${req.method} ${req.originalUrl}`
            };
            
            pool.execute(
                'INSERT INTO Auditoria_Log (tabela_afetada, operacao, utilizador_id, ip_address, user_agent, detalhes) VALUES (?, ?, ?, ?, ?, ?)',
                [logData.tabela_afetada, logData.operacao, logData.utilizador_id, logData.ip_address, logData.user_agent, logData.detalhes]
            ).catch(console.error);
        }
        
        originalSend.call(this, data);
    };
    next();
};

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index-solicitadora.html'));
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Sistema de Gestão para Solicitadora - API funcionando!',
        version: '1.0.0',
        endpoints: {
            clientes: '/api/clientes',
            processos: '/api/processos',
            documentos: '/api/documentos',
            honorarios: '/api/honorarios',
            despesas: '/api/despesas',
            pagamentos: '/api/pagamentos',
            faturas: '/api/faturas',
            agenda: '/api/agenda',
            tarefas: '/api/tarefas',
            solicitadora: '/api/solicitadora',
            auth: '/api/auth',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Rota de teste
app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ 
            status: 'OK', 
            message: 'Sistema funcionando perfeitamente!',
            database: 'Conectado',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Error', 
            message: error.message,
            database: 'Desconectado'
        });
    }
});

// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }

        const [users] = await pool.execute(
            'SELECT u.*, s.nome as solicitadora_nome FROM Utilizador u LEFT JOIN Solicitadora s ON u.solicitadora_id = s.id WHERE u.username = ? AND u.ativo = TRUE',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Atualizar último acesso
        await pool.execute(
            'UPDATE Utilizador SET ultimo_acesso = NOW() WHERE id = ?',
            [user.id]
        );

        const token = jwt.sign(
            { id: user.id, username: user.username, perfil: user.perfil, solicitadora_id: user.solicitadora_id },
            process.env.JWT_SECRET || 'seu_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                perfil: user.perfil,
                solicitadora_id: user.solicitadora_id,
                solicitadora_nome: user.solicitadora_nome
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE CLIENTES
// ========================================

app.get('/api/clientes', authenticateToken, async (req, res) => {
    try {
        const { estado, tipo_cliente, nome } = req.query;
        let query = 'SELECT * FROM Cliente';
        let params = [];
        let conditions = [];
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (tipo_cliente) {
            conditions.push('tipo_cliente = ?');
            params.push(tipo_cliente);
        }
        
        if (nome) {
            conditions.push('nome LIKE ?');
            params.push(`%${nome}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY nome';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clientes', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            nome, nif, contacto_email, contacto_telefone, contacto_telefone_alt,
            morada, codigo_postal, localidade, distrito, data_nascimento,
            genero, profissao, empresa, observacoes, tipo_cliente, estado
        } = req.body;
        
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Cliente 
             (nome, nif, contacto_email, contacto_telefone, contacto_telefone_alt,
              morada, codigo_postal, localidade, distrito, data_nascimento,
              genero, profissao, empresa, observacoes, tipo_cliente, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, nif, contacto_email, contacto_telefone, contacto_telefone_alt,
             morada, codigo_postal, localidade, distrito, data_nascimento,
             genero, profissao, empresa, observacoes, tipo_cliente || 'pessoa_singular', estado || 'ativo']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Cliente criado com sucesso' 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'NIF já existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.get('/api/clientes/:id', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Cliente WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/clientes/:id', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            nome, nif, contacto_email, contacto_telefone, contacto_telefone_alt,
            morada, codigo_postal, localidade, distrito, data_nascimento,
            genero, profissao, empresa, observacoes, tipo_cliente, estado
        } = req.body;
        
        const [result] = await pool.execute(
            `UPDATE Cliente SET 
             nome = ?, nif = ?, contacto_email = ?, contacto_telefone = ?, contacto_telefone_alt = ?,
             morada = ?, codigo_postal = ?, localidade = ?, distrito = ?, data_nascimento = ?,
             genero = ?, profissao = ?, empresa = ?, observacoes = ?, tipo_cliente = ?, estado = ?
             WHERE id = ?`,
            [nome, nif, contacto_email, contacto_telefone, contacto_telefone_alt,
             morada, codigo_postal, localidade, distrito, data_nascimento,
             genero, profissao, empresa, observacoes, tipo_cliente, estado, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        
        res.json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE PROCESSOS
// ========================================

app.get('/api/processos', authenticateToken, async (req, res) => {
    try {
        const { estado, tipo_processo, cliente_id, solicitadora_id } = req.query;
        let query = `
            SELECT 
                p.*,
                c.nome as cliente_nome,
                c.contacto_email as cliente_email,
                c.contacto_telefone as cliente_telefone,
                s.nome as solicitadora_nome
            FROM Processo p
            LEFT JOIN Cliente c ON p.cliente_id = c.id
            LEFT JOIN Solicitadora s ON p.solicitadora_id = s.id
        `;
        
        let params = [];
        let conditions = [];
        
        if (estado) {
            conditions.push('p.estado = ?');
            params.push(estado);
        }
        
        if (tipo_processo) {
            conditions.push('p.tipo_processo = ?');
            params.push(tipo_processo);
        }
        
        if (cliente_id) {
            conditions.push('p.cliente_id = ?');
            params.push(cliente_id);
        }
        
        if (solicitadora_id) {
            conditions.push('p.solicitadora_id = ?');
            params.push(solicitadora_id);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY p.data_abertura DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/processos', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            numero_processo, cliente_id, solicitadora_id, titulo, descricao,
            tipo_processo, estado, prioridade, data_abertura, data_vencimento,
            valor_causa, observacoes, tribunal, juiz, advogado_contrario
        } = req.body;
        
        if (!numero_processo || !cliente_id || !titulo || !tipo_processo) {
            return res.status(400).json({ error: 'Campos obrigatórios: número do processo, cliente, título e tipo de processo' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Processo 
             (numero_processo, cliente_id, solicitadora_id, titulo, descricao,
              tipo_processo, estado, prioridade, data_abertura, data_vencimento,
              valor_causa, observacoes, tribunal, juiz, advogado_contrario) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [numero_processo, cliente_id, solicitadora_id || req.user.solicitadora_id, titulo, descricao,
             tipo_processo, estado || 'aberto', prioridade || 'media', data_abertura, data_vencimento,
             valor_causa, observacoes, tribunal, juiz, advogado_contrario]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Processo criado com sucesso' 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Número do processo já existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// ========================================
// ROTAS DE DOCUMENTOS
// ========================================

app.get('/api/documentos', authenticateToken, async (req, res) => {
    try {
        const { processo_id, tipo_documento } = req.query;
        let query = 'SELECT * FROM Documento';
        let params = [];
        let conditions = [];
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (tipo_documento) {
            conditions.push('tipo_documento = ?');
            params.push(tipo_documento);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_upload DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/documentos', authenticateToken, upload.single('ficheiro'), auditLog, async (req, res) => {
    try {
        const { 
            processo_id, titulo, descricao, tipo_documento, 
            data_documento, observacoes, versao, estado
        } = req.body;
        
        if (!processo_id || !titulo || !tipo_documento) {
            return res.status(400).json({ error: 'Processo, título e tipo de documento são obrigatórios' });
        }
        
        const ficheiro = req.file;
        
        const [result] = await pool.execute(
            `INSERT INTO Documento 
             (processo_id, titulo, descricao, tipo_documento, ficheiro_nome, ficheiro_caminho,
              ficheiro_tamanho, ficheiro_tipo, data_documento, observacoes, versao, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [processo_id, titulo, descricao, tipo_documento, 
             ficheiro ? ficheiro.originalname : null,
             ficheiro ? ficheiro.path : null,
             ficheiro ? ficheiro.size : null,
             ficheiro ? ficheiro.mimetype : null,
             data_documento, observacoes, versao || '1.0', estado || 'rascunho']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Documento criado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE HONORÁRIOS
// ========================================

app.get('/api/honorarios', authenticateToken, async (req, res) => {
    try {
        const { processo_id, estado, tipo_honorario } = req.query;
        let query = 'SELECT * FROM Honorario';
        let params = [];
        let conditions = [];
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (tipo_honorario) {
            conditions.push('tipo_honorario = ?');
            params.push(tipo_honorario);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_honorario DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/honorarios', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            processo_id, descricao, tipo_honorario, valor, quantidade,
            data_honorario, observacoes, estado
        } = req.body;
        
        if (!processo_id || !descricao || !tipo_honorario || !valor) {
            return res.status(400).json({ error: 'Processo, descrição, tipo e valor são obrigatórios' });
        }
        
        const total = parseFloat(valor) * parseFloat(quantidade || 1);
        
        const [result] = await pool.execute(
            `INSERT INTO Honorario 
             (processo_id, descricao, tipo_honorario, valor, quantidade, total,
              data_honorario, observacoes, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [processo_id, descricao, tipo_honorario, valor, quantidade || 1, total,
             data_honorario, observacoes, estado || 'pendente']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Honorário criado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE DESPESAS
// ========================================

app.get('/api/despesas', authenticateToken, async (req, res) => {
    try {
        const { processo_id, solicitadora_id, categoria, estado } = req.query;
        let query = 'SELECT * FROM Despesa';
        let params = [];
        let conditions = [];
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (solicitadora_id) {
            conditions.push('solicitadora_id = ?');
            params.push(solicitadora_id);
        }
        
        if (categoria) {
            conditions.push('categoria = ?');
            params.push(categoria);
        }
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_despesa DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/despesas', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            processo_id, solicitadora_id, descricao, categoria, valor,
            data_despesa, comprovativo, observacoes, reembolsavel, estado
        } = req.body;
        
        if (!descricao || !categoria || !valor || !data_despesa) {
            return res.status(400).json({ error: 'Descrição, categoria, valor e data são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Despesa 
             (processo_id, solicitadora_id, descricao, categoria, valor,
              data_despesa, comprovativo, observacoes, reembolsavel, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [processo_id, solicitadora_id || req.user.solicitadora_id, descricao, categoria, valor,
             data_despesa, comprovativo, observacoes, reembolsavel !== false, estado || 'pendente']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Despesa criada com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE PAGAMENTOS
// ========================================

app.get('/api/pagamentos', authenticateToken, async (req, res) => {
    try {
        const { cliente_id, processo_id, estado } = req.query;
        let query = 'SELECT * FROM Pagamento';
        let params = [];
        let conditions = [];
        
        if (cliente_id) {
            conditions.push('cliente_id = ?');
            params.push(cliente_id);
        }
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_pagamento DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pagamentos', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            cliente_id, processo_id, valor, data_pagamento, metodo_pagamento,
            referencia, observacoes, estado
        } = req.body;
        
        if (!cliente_id || !valor || !data_pagamento || !metodo_pagamento) {
            return res.status(400).json({ error: 'Cliente, valor, data e método de pagamento são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Pagamento 
             (cliente_id, processo_id, valor, data_pagamento, metodo_pagamento,
              referencia, observacoes, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [cliente_id, processo_id, valor, data_pagamento, metodo_pagamento,
             referencia, observacoes, estado || 'confirmado']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Pagamento registado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE FATURAS
// ========================================

app.get('/api/faturas', authenticateToken, async (req, res) => {
    try {
        const { cliente_id, processo_id, estado } = req.query;
        let query = 'SELECT * FROM Fatura';
        let params = [];
        let conditions = [];
        
        if (cliente_id) {
            conditions.push('cliente_id = ?');
            params.push(cliente_id);
        }
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_emissao DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/faturas', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            numero_fatura, cliente_id, processo_id, data_emissao, data_vencimento,
            valor_total, observacoes, estado
        } = req.body;
        
        if (!numero_fatura || !cliente_id || !data_emissao || !valor_total) {
            return res.status(400).json({ error: 'Número da fatura, cliente, data de emissão e valor são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Fatura 
             (numero_fatura, cliente_id, processo_id, data_emissao, data_vencimento,
              valor_total, observacoes, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [numero_fatura, cliente_id, processo_id, data_emissao, data_vencimento,
             valor_total, observacoes, estado || 'rascunho']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Fatura criada com sucesso' 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Número da fatura já existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// ========================================
// ROTAS DE AGENDA
// ========================================

app.get('/api/agenda', authenticateToken, async (req, res) => {
    try {
        const { solicitadora_id, processo_id, cliente_id, tipo_compromisso, data_inicio, data_fim } = req.query;
        let query = 'SELECT * FROM Agenda';
        let params = [];
        let conditions = [];
        
        if (solicitadora_id) {
            conditions.push('solicitadora_id = ?');
            params.push(solicitadora_id);
        }
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (cliente_id) {
            conditions.push('cliente_id = ?');
            params.push(cliente_id);
        }
        
        if (tipo_compromisso) {
            conditions.push('tipo_compromisso = ?');
            params.push(tipo_compromisso);
        }
        
        if (data_inicio) {
            conditions.push('data_inicio >= ?');
            params.push(data_inicio);
        }
        
        if (data_fim) {
            conditions.push('data_inicio <= ?');
            params.push(data_fim);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_inicio';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agenda', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            solicitadora_id, processo_id, cliente_id, titulo, descricao,
            tipo_compromisso, data_inicio, data_fim, local, participantes,
            lembrete_minutos, observacoes, estado
        } = req.body;
        
        if (!solicitadora_id || !titulo || !tipo_compromisso || !data_inicio) {
            return res.status(400).json({ error: 'Solicitadora, título, tipo e data de início são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Agenda 
             (solicitadora_id, processo_id, cliente_id, titulo, descricao,
              tipo_compromisso, data_inicio, data_fim, local, participantes,
              lembrete_minutos, observacoes, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [solicitadora_id, processo_id, cliente_id, titulo, descricao,
             tipo_compromisso, data_inicio, data_fim, local, participantes,
             lembrete_minutos || 15, observacoes, estado || 'agendado']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Compromisso agendado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE TAREFAS
// ========================================

app.get('/api/tarefas', authenticateToken, async (req, res) => {
    try {
        const { solicitadora_id, processo_id, cliente_id, prioridade, estado } = req.query;
        let query = 'SELECT * FROM Tarefa';
        let params = [];
        let conditions = [];
        
        if (solicitadora_id) {
            conditions.push('solicitadora_id = ?');
            params.push(solicitadora_id);
        }
        
        if (processo_id) {
            conditions.push('processo_id = ?');
            params.push(processo_id);
        }
        
        if (cliente_id) {
            conditions.push('cliente_id = ?');
            params.push(cliente_id);
        }
        
        if (prioridade) {
            conditions.push('prioridade = ?');
            params.push(prioridade);
        }
        
        if (estado) {
            conditions.push('estado = ?');
            params.push(estado);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY prioridade DESC, data_vencimento ASC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tarefas', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            solicitadora_id, processo_id, cliente_id, titulo, descricao,
            prioridade, data_criacao, data_vencimento, observacoes, estado
        } = req.body;
        
        if (!solicitadora_id || !titulo) {
            return res.status(400).json({ error: 'Solicitadora e título são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Tarefa 
             (solicitadora_id, processo_id, cliente_id, titulo, descricao,
              prioridade, data_criacao, data_vencimento, observacoes, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [solicitadora_id, processo_id, cliente_id, titulo, descricao,
             prioridade || 'media', data_criacao || new Date().toISOString().split('T')[0], 
             data_vencimento, observacoes, estado || 'pendente']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Tarefa criada com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE SOLICITADORA
// ========================================

app.get('/api/solicitadora', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Solicitadora WHERE id = ?',
            [req.user.solicitadora_id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Solicitadora não encontrada' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/solicitadora', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            nome, nif, cedula, contacto_email, contacto_telefone,
            morada, codigo_postal, localidade, distrito, data_nascimento,
            genero, especializacoes, data_inscricao, estado, foto_perfil
        } = req.body;
        
        const [result] = await pool.execute(
            `UPDATE Solicitadora SET 
             nome = ?, nif = ?, cedula = ?, contacto_email = ?, contacto_telefone = ?,
             morada = ?, codigo_postal = ?, localidade = ?, distrito = ?, data_nascimento = ?,
             genero = ?, especializacoes = ?, data_inscricao = ?, estado = ?, foto_perfil = ?
             WHERE id = ?`,
            [nome, nif, cedula, contacto_email, contacto_telefone,
             morada, codigo_postal, localidade, distrito, data_nascimento,
             genero, especializacoes, data_inscricao, estado, foto_perfil, req.user.solicitadora_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Solicitadora não encontrada' });
        }
        
        res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE ESTATÍSTICAS
// ========================================

app.get('/api/estatisticas', authenticateToken, async (req, res) => {
    try {
        const [stats] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM Cliente WHERE estado = 'ativo') as clientes_ativos,
                (SELECT COUNT(*) FROM Processo WHERE estado = 'aberto' OR estado = 'em_andamento') as processos_ativos,
                (SELECT COUNT(*) FROM Processo WHERE estado = 'concluido') as processos_concluidos,
                (SELECT SUM(valor_total) FROM Fatura WHERE estado = 'paga') as receitas_totais,
                (SELECT SUM(valor) FROM Despesa WHERE estado = 'aprovado') as despesas_totais,
                (SELECT SUM(total) FROM Honorario WHERE estado = 'pago') as honorarios_pagos,
                (SELECT SUM(total) FROM Honorario WHERE estado = 'pendente') as honorarios_pendentes,
                (SELECT COUNT(*) FROM Agenda WHERE estado = 'agendado' AND data_inicio >= CURDATE()) as compromissos_hoje,
                (SELECT COUNT(*) FROM Tarefa WHERE estado = 'pendente' AND data_vencimento <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)) as tarefas_vencendo
        `);
        
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Sistema de Solicitadora rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💾 Banco: ${dbConfig.database}@${dbConfig.host}`);
});

module.exports = app;
