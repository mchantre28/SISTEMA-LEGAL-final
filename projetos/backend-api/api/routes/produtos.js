const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'meu_projeto_base_dados',
    port: process.env.DB_PORT || 3306
};

const pool = mysql.createPool(dbConfig);

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const { ativo, busca } = req.query;
        let query = 'SELECT * FROM produtos';
        let params = [];
        
        if (ativo !== undefined) {
            query += ' WHERE ativo = ?';
            params.push(ativo === 'true');
        }
        
        if (busca) {
            query += ativo !== undefined ? ' AND' : ' WHERE';
            query += ' (nome LIKE ? OR descricao LIKE ?)';
            params.push(`%${busca}%`, `%${busca}%`);
        }
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, ativo = true } = req.body;
        
        if (!nome || !preco) {
            return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO produtos (nome, descricao, preco, estoque, ativo) VALUES (?, ?, ?, ?, ?)',
            [nome, descricao, preco, estoque || 0, ativo]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Produto criado com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, ativo } = req.body;
        const [result] = await pool.execute(
            'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, ativo = ? WHERE id = ?',
            [nome, descricao, preco, estoque, ativo, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/produtos/:id - Deletar produto (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'UPDATE produtos SET ativo = false WHERE id = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json({ message: 'Produto desativado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/produtos/:id/estoque - Atualizar estoque
router.patch('/:id/estoque', async (req, res) => {
    try {
        const { quantidade } = req.body;
        
        if (quantidade === undefined) {
            return res.status(400).json({ error: 'Quantidade é obrigatória' });
        }
        
        const [result] = await pool.execute(
            'UPDATE produtos SET estoque = ? WHERE id = ?',
            [quantidade, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json({ message: 'Estoque atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
