const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

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
    database: process.env.DB_NAME || 'novo_projeto_local',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

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
        // Log da operação
        if (req.method !== 'GET') {
            const logData = {
                tabela_afetada: req.route?.path || 'unknown',
                operacao: req.method,
                utilizador_id: req.user?.id || null,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                detalhes: `${req.method} ${req.originalUrl}`
            };
            
            // Inserir log de auditoria (assíncrono)
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
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Novo Projeto Local - API funcionando!',
        version: '2.0.0',
        endpoints: {
            profissionais: '/api/profissionais',
            especializacoes: '/api/especializacoes',
            escritorios: '/api/escritorios',
            localizacoes: '/api/localizacoes',
            utilizadores: '/api/utilizadores',
            historico: '/api/historico',
            estatisticas: '/api/estatisticas',
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
            'SELECT * FROM Utilizador WHERE username = ? AND ativo = TRUE',
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
            { id: user.id, username: user.username, perfil: user.perfil },
            process.env.JWT_SECRET || 'seu_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                perfil: user.perfil,
                profissional_id: user.profissional_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE PROFISSIONAIS
// ========================================

app.get('/api/profissionais', async (req, res) => {
    try {
        const { estado, escritorio_id, especializacao_id } = req.query;
        let query = `
            SELECT 
                p.*,
                e.nome as escritorio_nome,
                l.concelho,
                l.distrito,
                GROUP_CONCAT(esp.descricao SEPARATOR ', ') as especializacoes
            FROM Profissional p
            LEFT JOIN Escritorio e ON p.escritorio_id = e.id
            LEFT JOIN Localizacao l ON p.localizacao_id = l.id
            LEFT JOIN Profissional_Especializacao pe ON p.id = pe.profissional_id
            LEFT JOIN Especializacao esp ON pe.especializacao_id = esp.id
        `;
        
        let params = [];
        let conditions = [];
        
        if (estado) {
            conditions.push('p.estado = ?');
            params.push(estado);
        }
        
        if (escritorio_id) {
            conditions.push('p.escritorio_id = ?');
            params.push(escritorio_id);
        }
        
        if (especializacao_id) {
            conditions.push('pe.especializacao_id = ?');
            params.push(especializacao_id);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' GROUP BY p.id ORDER BY p.nome';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/profissionais', authenticateToken, auditLog, async (req, res) => {
    try {
        const { 
            nome, nif, cedula, data_inscricao, contacto_email, contacto_tel, 
            data_nascimento, genero, localizacao_id, escritorio_id 
        } = req.body;
        
        if (!nome || !nif || !cedula) {
            return res.status(400).json({ error: 'Nome, NIF e Cédula são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            `INSERT INTO Profissional 
             (nome, nif, cedula, data_inscricao, contacto_email, contacto_tel, 
              data_nascimento, genero, localizacao_id, escritorio_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, nif, cedula, data_inscricao, contacto_email, contacto_tel, 
             data_nascimento, genero, localizacao_id, escritorio_id]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Profissional criado com sucesso' 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'NIF ou Cédula já existem' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.get('/api/profissionais/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                p.*,
                e.nome as escritorio_nome,
                l.concelho,
                l.distrito,
                GROUP_CONCAT(esp.descricao SEPARATOR ', ') as especializacoes
            FROM Profissional p
            LEFT JOIN Escritorio e ON p.escritorio_id = e.id
            LEFT JOIN Localizacao l ON p.localizacao_id = l.id
            LEFT JOIN Profissional_Especializacao pe ON p.id = pe.profissional_id
            LEFT JOIN Especializacao esp ON pe.especializacao_id = esp.id
            WHERE p.id = ?
            GROUP BY p.id`,
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE ESPECIALIZAÇÕES
// ========================================

app.get('/api/especializacoes', async (req, res) => {
    try {
        const { categoria, ativo } = req.query;
        let query = 'SELECT * FROM Especializacao';
        let params = [];
        let conditions = [];
        
        if (categoria) {
            conditions.push('categoria = ?');
            params.push(categoria);
        }
        
        if (ativo !== undefined) {
            conditions.push('ativo = ?');
            params.push(ativo === 'true');
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY categoria, descricao';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/especializacoes', authenticateToken, auditLog, async (req, res) => {
    try {
        const { descricao, categoria } = req.body;
        
        if (!descricao) {
            return res.status(400).json({ error: 'Descrição é obrigatória' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO Especializacao (descricao, categoria) VALUES (?, ?)',
            [descricao, categoria]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Especialização criada com sucesso' 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Especialização já existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// ========================================
// ROTAS DE ESCRITÓRIOS
// ========================================

app.get('/api/escritorios', async (req, res) => {
    try {
        const { ativo, localizacao_id } = req.query;
        let query = `
            SELECT 
                e.*,
                l.concelho,
                l.distrito,
                l.codigo_postal
            FROM Escritorio e
            LEFT JOIN Localizacao l ON e.localizacao_id = l.id
        `;
        
        let params = [];
        let conditions = [];
        
        if (ativo !== undefined) {
            conditions.push('e.ativo = ?');
            params.push(ativo === 'true');
        }
        
        if (localizacao_id) {
            conditions.push('e.localizacao_id = ?');
            params.push(localizacao_id);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY e.nome';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/escritorios', authenticateToken, auditLog, async (req, res) => {
    try {
        const { nome, contacto_email, contacto_telefone, website, localizacao_id } = req.body;
        
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO Escritorio (nome, contacto_email, contacto_telefone, website, localizacao_id) VALUES (?, ?, ?, ?, ?)',
            [nome, contacto_email, contacto_telefone, website, localizacao_id]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Escritório criado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE LOCALIZAÇÕES
// ========================================

app.get('/api/localizacoes', async (req, res) => {
    try {
        const { distrito, concelho } = req.query;
        let query = 'SELECT * FROM Localizacao';
        let params = [];
        let conditions = [];
        
        if (distrito) {
            conditions.push('distrito LIKE ?');
            params.push(`%${distrito}%`);
        }
        
        if (concelho) {
            conditions.push('concelho LIKE ?');
            params.push(`%${concelho}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY distrito, concelho, freguesia';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/localizacoes', authenticateToken, auditLog, async (req, res) => {
    try {
        const { distrito, concelho, freguesia, codigo_postal, latitude, longitude } = req.body;
        
        if (!distrito || !concelho || !freguesia) {
            return res.status(400).json({ error: 'Distrito, concelho e freguesia são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO Localizacao (distrito, concelho, freguesia, codigo_postal, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
            [distrito, concelho, freguesia, codigo_postal, latitude, longitude]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Localização criada com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE HISTÓRICO
// ========================================

app.get('/api/historico', async (req, res) => {
    try {
        const { profissional_id, tipo_ato, status, data_inicio, data_fim } = req.query;
        let query = `
            SELECT 
                h.*,
                p.nome as profissional_nome
            FROM Historico_Registo h
            LEFT JOIN Profissional p ON h.profissional_id = p.id
        `;
        
        let params = [];
        let conditions = [];
        
        if (profissional_id) {
            conditions.push('h.profissional_id = ?');
            params.push(profissional_id);
        }
        
        if (tipo_ato) {
            conditions.push('h.tipo_ato LIKE ?');
            params.push(`%${tipo_ato}%`);
        }
        
        if (status) {
            conditions.push('h.status = ?');
            params.push(status);
        }
        
        if (data_inicio) {
            conditions.push('h.data >= ?');
            params.push(data_inicio);
        }
        
        if (data_fim) {
            conditions.push('h.data <= ?');
            params.push(data_fim);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY h.data DESC, h.id DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/historico', authenticateToken, auditLog, async (req, res) => {
    try {
        const { profissional_id, tipo_ato, data, observacoes, valor, status } = req.body;
        
        if (!profissional_id || !tipo_ato || !data) {
            return res.status(400).json({ error: 'Profissional, tipo de ato e data são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO Historico_Registo (profissional_id, tipo_ato, data, observacoes, valor, status) VALUES (?, ?, ?, ?, ?, ?)',
            [profissional_id, tipo_ato, data, observacoes, valor, status || 'pendente']
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Registo histórico criado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE ESTATÍSTICAS
// ========================================

app.get('/api/estatisticas', async (req, res) => {
    try {
        const [stats] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM Profissional WHERE estado = 'ativo') as profissionais_ativos,
                (SELECT COUNT(*) FROM Escritorio WHERE ativo = TRUE) as escritorios_ativos,
                (SELECT COUNT(*) FROM Especializacao WHERE ativo = TRUE) as especializacoes_ativas,
                (SELECT COUNT(*) FROM Localizacao) as total_localizacoes,
                (SELECT COUNT(*) FROM Utilizador WHERE ativo = TRUE) as utilizadores_ativos,
                (SELECT COUNT(*) FROM Historico_Registo WHERE status = 'aprovado') as registos_aprovados,
                (SELECT COUNT(*) FROM Historico_Registo WHERE status = 'pendente') as registos_pendentes
        `);
        
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE UTILIZADORES
// ========================================

app.get('/api/utilizadores', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                u.id,
                u.username,
                u.perfil,
                u.ativo,
                u.ultimo_acesso,
                p.nome as profissional_nome
            FROM Utilizador u
            LEFT JOIN Profissional p ON u.profissional_id = p.id
            ORDER BY u.username
        `);
        
        res.json(rows);
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
    console.log(`🚀 Novo Projeto Local rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💾 Banco: ${dbConfig.database}@${dbConfig.host}`);
});

module.exports = app;
