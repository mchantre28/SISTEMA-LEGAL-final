const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'meu_projeto_base_dados',
    port: process.env.DB_PORT || 3306
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Rotas básicas
app.get('/', (req, res) => {
    res.json({ 
        message: 'API do Projeto Base de Dados funcionando!',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            produtos: '/api/produtos',
            pedidos: '/api/pedidos'
        }
    });
});

// Rota de teste de conexão com o banco
app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ status: 'OK', database: 'Conectado' });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// Rotas de usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        res.json({ id: result.insertId, message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas de produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM produtos WHERE ativo = true');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
            [nome, descricao, preco, estoque]
        );
        res.json({ id: result.insertId, message: 'Produto criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas de pedidos
app.get('/api/pedidos', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT p.*, u.nome as usuario_nome 
            FROM pedidos p 
            JOIN usuarios u ON p.usuario_id = u.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pedidos', async (req, res) => {
    try {
        const { usuario_id, total, itens } = req.body;
        const connection = await pool.getConnection();
        
        await connection.beginTransaction();
        
        try {
            // Criar pedido
            const [pedidoResult] = await connection.execute(
                'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
                [usuario_id, total]
            );
            
            const pedidoId = pedidoResult.insertId;
            
            // Inserir itens do pedido
            for (const item of itens) {
                await connection.execute(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
                );
            }
            
            await connection.commit();
            res.json({ id: pedidoId, message: 'Pedido criado com sucesso' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;
