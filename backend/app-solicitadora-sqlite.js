const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Configuração do SQLite
const dbPath = path.join(__dirname, '../database/solicitadora.db');
const db = new sqlite3.Database(dbPath);

// Inicializar base de dados se não existir
function initDatabase() {
    return new Promise((resolve, reject) => {
        console.log('📁 Inicializando base de dados SQLite...');
        
        // Ler e executar o schema
        const schema = fs.readFileSync(path.join(__dirname, '../database/schema-sqlite.sql'), 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        let completed = 0;
        const totalStatements = statements.length;
        
        statements.forEach((statement, index) => {
            if (statement.trim()) {
                db.exec(statement, (err) => {
                    if (err) {
                        console.error('Erro ao executar statement:', err);
                        console.error('Statement:', statement);
                    }
                    completed++;
                    if (completed === totalStatements) {
                        console.log('✅ Base de dados SQLite criada com sucesso!');
                        resolve();
                    }
                });
            } else {
                completed++;
                if (completed === totalStatements) {
                    console.log('✅ Base de dados SQLite criada com sucesso!');
                    resolve();
                }
            }
        });
    });
}

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    jwt.verify(token, 'solicitadora_jwt_secret_2024', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/solicitadora-sistema.html'));
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Sistema de Gestão para Solicitadora - API funcionando!',
        version: '1.0.0',
        database: 'SQLite',
        endpoints: {
            clientes: '/api/clientes',
            processos: '/api/processos',
            documentos: '/api/documentos',
            financeiro: '/api/financeiro',
            agenda: '/api/agenda',
            solicitadora: '/api/solicitadora',
            auth: '/api/auth',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Rota de teste
app.get('/api/health', async (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sistema funcionando perfeitamente!',
        database: 'SQLite Conectado',
        timestamp: new Date().toISOString()
    });
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

        // Usuários demo
        const users = {
            'admin': { id: 1, username: 'admin', perfil: 'admin', solicitadora_id: 1, solicitadora_nome: 'Maria Silva Santos' },
            'maria.santos': { id: 2, username: 'maria.santos', perfil: 'solicitadora', solicitadora_id: 1, solicitadora_nome: 'Maria Silva Santos' }
        };

        const user = users[username];
        if (!user || password !== 'password') {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, perfil: user.perfil, solicitadora_id: user.solicitadora_id },
            'solicitadora_jwt_secret_2024',
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
        db.all('SELECT * FROM clientes ORDER BY nome', (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clientes', authenticateToken, async (req, res) => {
    try {
        const { nome, nif, morada, telefone, email } = req.body;
        
        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }
        
        db.run(
            'INSERT INTO clientes (nome, nif, morada, telefone, email) VALUES (?, ?, ?, ?, ?)',
            [nome, nif, morada, telefone, email],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ 
                    id: this.lastID, 
                    message: 'Cliente criado com sucesso' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE PROCESSOS
// ========================================

app.get('/api/processos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT p.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
            FROM processos p
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            ORDER BY p.data_abertura DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/processos', authenticateToken, async (req, res) => {
    try {
        const { id_cliente, numero_processo, tipo_processo, descricao, estado } = req.body;
        
        if (!id_cliente || !numero_processo || !tipo_processo) {
            return res.status(400).json({ error: 'Cliente, número do processo e tipo são obrigatórios' });
        }
        
        db.run(
            'INSERT INTO processos (id_cliente, numero_processo, tipo_processo, descricao, estado) VALUES (?, ?, ?, ?, ?)',
            [id_cliente, numero_processo, tipo_processo, descricao, estado || 'Em curso'],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ 
                    id: this.lastID, 
                    message: 'Processo criado com sucesso' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE DOCUMENTOS
// ========================================

app.get('/api/documentos', authenticateToken, async (req, res) => {
    try {
        const { id_processo } = req.query;
        let query = 'SELECT * FROM documentos';
        let params = [];
        
        if (id_processo) {
            query += ' WHERE id_processo = ?';
            params.push(id_processo);
        }
        
        query += ' ORDER BY data_upload DESC';
        
        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/documentos', authenticateToken, async (req, res) => {
    try {
        const { id_processo, nome_documento, tipo_documento, caminho_arquivo } = req.body;
        
        if (!id_processo || !nome_documento || !tipo_documento) {
            return res.status(400).json({ error: 'Processo, nome e tipo do documento são obrigatórios' });
        }
        
        db.run(
            'INSERT INTO documentos (id_processo, nome_documento, tipo_documento, caminho_arquivo) VALUES (?, ?, ?, ?)',
            [id_processo, nome_documento, tipo_documento, caminho_arquivo],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ 
                    id: this.lastID, 
                    message: 'Documento criado com sucesso' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE FINANCEIRO
// ========================================

app.get('/api/financeiro', authenticateToken, async (req, res) => {
    try {
        const { id_processo, tipo, status } = req.query;
        let query = 'SELECT * FROM financeiro';
        let params = [];
        let conditions = [];
        
        if (id_processo) {
            conditions.push('id_processo = ?');
            params.push(id_processo);
        }
        
        if (tipo) {
            conditions.push('tipo = ?');
            params.push(tipo);
        }
        
        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_registo DESC';
        
        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/financeiro', authenticateToken, async (req, res) => {
    try {
        const { id_processo, tipo, descricao, valor, status } = req.body;
        
        if (!id_processo || !tipo || !descricao || !valor) {
            return res.status(400).json({ error: 'Processo, tipo, descrição e valor são obrigatórios' });
        }
        
        db.run(
            'INSERT INTO financeiro (id_processo, tipo, descricao, valor, status) VALUES (?, ?, ?, ?, ?)',
            [id_processo, tipo, descricao, valor, status || 'Pendente'],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ 
                    id: this.lastID, 
                    message: 'Registo financeiro criado com sucesso' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE AGENDA
// ========================================

app.get('/api/agenda', authenticateToken, async (req, res) => {
    try {
        const { id_processo, data_inicio, data_fim } = req.query;
        let query = 'SELECT * FROM agenda';
        let params = [];
        let conditions = [];
        
        if (id_processo) {
            conditions.push('id_processo = ?');
            params.push(id_processo);
        }
        
        if (data_inicio) {
            conditions.push('data_evento >= ?');
            params.push(data_inicio);
        }
        
        if (data_fim) {
            conditions.push('data_evento <= ?');
            params.push(data_fim);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY data_evento';
        
        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agenda', authenticateToken, async (req, res) => {
    try {
        const { id_processo, titulo, data_evento, observacoes } = req.body;
        
        if (!titulo || !data_evento) {
            return res.status(400).json({ error: 'Título e data do evento são obrigatórios' });
        }
        
        db.run(
            'INSERT INTO agenda (id_processo, titulo, data_evento, observacoes) VALUES (?, ?, ?, ?)',
            [id_processo, titulo, data_evento, observacoes],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ 
                    id: this.lastID, 
                    message: 'Evento agendado com sucesso' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE SOLICITADORA
// ========================================

app.get('/api/solicitadora', authenticateToken, async (req, res) => {
    try {
        db.get('SELECT * FROM solicitadora WHERE id_solicitadora = 1', (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(404).json({ error: 'Solicitadora não encontrada' });
                return;
            }
            res.json(row);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/solicitadora', authenticateToken, async (req, res) => {
    try {
        const { nome, nif, email, telefone, morada } = req.body;
        
        db.run(
            'UPDATE solicitadora SET nome = ?, nif = ?, email = ?, telefone = ?, morada = ? WHERE id_solicitadora = 1',
            [nome, nif, email, telefone, morada],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Perfil atualizado com sucesso' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE ESTATÍSTICAS
// ========================================

app.get('/api/estatisticas', authenticateToken, async (req, res) => {
    try {
        db.get(`
            SELECT 
                (SELECT COUNT(*) FROM clientes) as clientes_ativos,
                (SELECT COUNT(*) FROM processos WHERE estado = 'Em curso') as processos_ativos,
                (SELECT COUNT(*) FROM processos WHERE estado = 'Concluído') as processos_concluidos,
                (SELECT SUM(valor) FROM financeiro WHERE tipo = 'Honorário' AND status = 'Pago') as receitas_totais,
                (SELECT SUM(valor) FROM financeiro WHERE tipo = 'Honorário' AND status = 'Pago') as honorarios_pagos,
                (SELECT COUNT(*) FROM agenda WHERE date(data_evento) = date('now')) as compromissos_hoje,
                (SELECT COUNT(*) FROM financeiro WHERE status = 'Pendente') as tarefas_vencendo
        `, (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE RELATÓRIOS E CONSULTAS
// ========================================

// Listar todos os processos ativos
app.get('/api/relatorios/processos-ativos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT p.numero_processo, c.nome AS cliente, p.tipo_processo, p.estado
            FROM processos p
            JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE p.estado = 'Em curso'
            ORDER BY p.data_abertura DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mostrar total financeiro por processo
app.get('/api/relatorios/total-financeiro', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT p.numero_processo, 
                   SUM(f.valor) AS total, 
                   SUM(CASE WHEN f.status='Pago' THEN f.valor ELSE 0 END) AS total_pago,
                   SUM(CASE WHEN f.status='Pendente' THEN f.valor ELSE 0 END) AS total_pendente
            FROM financeiro f
            JOIN processos p ON f.id_processo = p.id_processo
            GROUP BY p.numero_processo
            ORDER BY total DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Próximos compromissos
app.get('/api/relatorios/proximos-compromissos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT a.titulo, a.data_evento, a.observacoes, p.numero_processo, c.nome as cliente
            FROM agenda a
            LEFT JOIN processos p ON a.id_processo = p.id_processo
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE a.data_evento >= DATE('now')
            ORDER BY a.data_evento ASC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Relatório completo de processos
app.get('/api/relatorios/processos-completos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT 
                p.numero_processo,
                c.nome as cliente,
                p.tipo_processo,
                p.estado,
                p.data_abertura,
                p.data_conclusao,
                COUNT(d.id_documento) as total_documentos,
                SUM(f.valor) as total_financeiro,
                SUM(CASE WHEN f.status='Pago' THEN f.valor ELSE 0 END) as total_pago
            FROM processos p
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            LEFT JOIN documentos d ON p.id_processo = d.id_processo
            LEFT JOIN financeiro f ON p.id_processo = f.id_processo
            GROUP BY p.id_processo
            ORDER BY p.data_abertura DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Relatório financeiro detalhado
app.get('/api/relatorios/financeiro-detalhado', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT 
                f.tipo,
                f.descricao,
                f.valor,
                f.status,
                f.data_registo,
                p.numero_processo,
                c.nome as cliente
            FROM financeiro f
            LEFT JOIN processos p ON f.id_processo = p.id_processo
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            ORDER BY f.data_registo DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clientes ativos e número de processos
app.get('/api/relatorios/clientes-ativos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT c.nome, c.email, c.telefone, 
                   COUNT(p.id_processo) as total_processos,
                   COUNT(CASE WHEN p.estado = 'Em curso' THEN 1 END) as processos_ativos,
                   COUNT(CASE WHEN p.estado = 'Concluído' THEN 1 END) as processos_concluidos
            FROM clientes c
            LEFT JOIN processos p ON c.id_cliente = p.id_cliente
            GROUP BY c.id_cliente, c.nome, c.email, c.telefone
            HAVING COUNT(p.id_processo) > 0
            ORDER BY total_processos DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fluxo de caixa mensal (honorários e despesas)
app.get('/api/relatorios/fluxo-caixa-mensal', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT 
                strftime('%Y-%m', f.data_registo) as mes,
                SUM(CASE WHEN f.tipo = 'Honorário' THEN f.valor ELSE 0 END) as total_honorarios,
                SUM(CASE WHEN f.tipo = 'Despesa' THEN f.valor ELSE 0 END) as total_despesas,
                SUM(CASE WHEN f.tipo = 'Pagamento' THEN f.valor ELSE 0 END) as total_pagamentos,
                SUM(CASE WHEN f.tipo = 'Honorário' THEN f.valor ELSE 0 END) - 
                SUM(CASE WHEN f.tipo = 'Despesa' THEN f.valor ELSE 0 END) as saldo_mensal
            FROM financeiro f
            GROUP BY strftime('%Y-%m', f.data_registo)
            ORDER BY mes DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Processos concluídos por mês
app.get('/api/relatorios/processos-concluidos-mes', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT 
                strftime('%Y-%m', p.data_conclusao) as mes,
                COUNT(*) as total_concluidos,
                GROUP_CONCAT(p.numero_processo, ', ') as processos
            FROM processos p
            WHERE p.estado = 'Concluído' AND p.data_conclusao IS NOT NULL
            GROUP BY strftime('%Y-%m', p.data_conclusao)
            ORDER BY mes DESC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alertas de prazos (eventos próximos)
app.get('/api/relatorios/alertas-prazos', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT a.titulo, a.data_evento, a.observacoes, 
                   p.numero_processo, c.nome as cliente,
                   julianday(a.data_evento) - julianday('now') as dias_restantes
            FROM agenda a
            LEFT JOIN processos p ON a.id_processo = p.id_processo
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE a.data_evento >= datetime('now') 
            AND a.data_evento <= datetime('now', '+30 days')
            ORDER BY a.data_evento ASC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pagamentos pendentes
app.get('/api/relatorios/pagamentos-pendentes', authenticateToken, async (req, res) => {
    try {
        db.all(`
            SELECT f.descricao, f.valor, f.data_registo, f.tipo,
                   p.numero_processo, c.nome as cliente,
                   julianday('now') - julianday(f.data_registo) as dias_pendente
            FROM financeiro f
            JOIN processos p ON f.id_processo = p.id_processo
            JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE f.status = 'Pendente'
            ORDER BY f.data_registo ASC
        `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar base de dados e iniciar servidor
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Sistema de Solicitadora rodando na porta ${PORT}`);
        console.log(`📱 Acesse: http://localhost:${PORT}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
        console.log(`💾 Base de dados: SQLite (${dbPath})`);
    });
}).catch((error) => {
    console.error('Erro ao inicializar base de dados:', error);
    process.exit(1);
});

module.exports = app;
