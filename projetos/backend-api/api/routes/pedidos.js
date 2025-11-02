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

// GET /api/pedidos - Listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        const { status, usuario_id } = req.query;
        let query = `
            SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
            FROM pedidos p 
            JOIN usuarios u ON p.usuario_id = u.id
        `;
        let params = [];
        
        if (status || usuario_id) {
            query += ' WHERE';
            const conditions = [];
            
            if (status) {
                conditions.push('p.status = ?');
                params.push(status);
            }
            
            if (usuario_id) {
                conditions.push('p.usuario_id = ?');
                params.push(usuario_id);
            }
            
            query += ' ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY p.data_criacao DESC';
        
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/pedidos/:id - Buscar pedido por ID
router.get('/:id', async (req, res) => {
    try {
        const [pedidoRows] = await pool.execute(`
            SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
            FROM pedidos p 
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (pedidoRows.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        const [itensRows] = await pool.execute(`
            SELECT ip.*, pr.nome as produto_nome, pr.descricao as produto_descricao
            FROM itens_pedido ip
            JOIN produtos pr ON ip.produto_id = pr.id
            WHERE ip.pedido_id = ?
        `, [req.params.id]);
        
        const pedido = pedidoRows[0];
        pedido.itens = itensRows;
        
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/pedidos - Criar novo pedido
router.post('/', async (req, res) => {
    try {
        const { usuario_id, itens } = req.body;
        
        if (!usuario_id || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ 
                error: 'Usuário ID e itens são obrigatórios' 
            });
        }
        
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Calcular total do pedido
            let total = 0;
            for (const item of itens) {
                const [produtoRows] = await connection.execute(
                    'SELECT preco FROM produtos WHERE id = ? AND ativo = true',
                    [item.produto_id]
                );
                
                if (produtoRows.length === 0) {
                    throw new Error(`Produto com ID ${item.produto_id} não encontrado ou inativo`);
                }
                
                const preco = produtoRows[0].preco;
                total += preco * item.quantidade;
                item.preco_unitario = preco;
            }
            
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
                
                // Atualizar estoque
                await connection.execute(
                    'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                    [item.quantidade, item.produto_id]
                );
            }
            
            await connection.commit();
            res.status(201).json({ 
                id: pedidoId, 
                total,
                message: 'Pedido criado com sucesso' 
            });
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

// PUT /api/pedidos/:id/status - Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const statusValidos = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'];
        
        if (!status || !statusValidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido. Use: ' + statusValidos.join(', ') 
            });
        }
        
        const [result] = await pool.execute(
            'UPDATE pedidos SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        
        res.json({ message: 'Status do pedido atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/pedidos/:id - Cancelar pedido
router.delete('/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Verificar se o pedido existe e pode ser cancelado
            const [pedidoRows] = await connection.execute(
                'SELECT status FROM pedidos WHERE id = ?',
                [req.params.id]
            );
            
            if (pedidoRows.length === 0) {
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }
            
            if (pedidoRows[0].status === 'entregue') {
                return res.status(400).json({ error: 'Não é possível cancelar um pedido já entregue' });
            }
            
            // Restaurar estoque dos produtos
            const [itensRows] = await connection.execute(
                'SELECT produto_id, quantidade FROM itens_pedido WHERE pedido_id = ?',
                [req.params.id]
            );
            
            for (const item of itensRows) {
                await connection.execute(
                    'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
                    [item.quantidade, item.produto_id]
                );
            }
            
            // Atualizar status do pedido para cancelado
            await connection.execute(
                'UPDATE pedidos SET status = "cancelado" WHERE id = ?',
                [req.params.id]
            );
            
            await connection.commit();
            res.json({ message: 'Pedido cancelado com sucesso' });
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

module.exports = router;
