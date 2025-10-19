const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Dados em memória (simulando banco de dados)
let usuarios = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', data_criacao: new Date() },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', data_criacao: new Date() }
];

let produtos = [
    { id: 1, nome: 'Smartphone XYZ', descricao: 'Smartphone com tela de 6.1 polegadas', preco: 899.99, estoque: 50, ativo: true },
    { id: 2, nome: 'Notebook ABC', descricao: 'Notebook com processador Intel i7', preco: 2499.99, estoque: 25, ativo: true }
];

let pedidos = [
    { id: 1, usuario_id: 1, total: 899.99, status: 'entregue', data_criacao: new Date() },
    { id: 2, usuario_id: 2, total: 3099.98, status: 'processando', data_criacao: new Date() }
];

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API do Projeto Base de Dados funcionando!',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            produtos: '/api/produtos',
            pedidos: '/api/pedidos',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rotas de usuários
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});

app.post('/api/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        data_criacao: new Date()
    };
    usuarios.push(novoUsuario);
    res.status(201).json({ id: novoUsuario.id, message: 'Usuário criado com sucesso' });
});

// Rotas de produtos
app.get('/api/produtos', (req, res) => {
    res.json(produtos);
});

app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    const novoProduto = {
        id: produtos.length + 1,
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        ativo: true,
        data_criacao: new Date()
    };
    produtos.push(novoProduto);
    res.status(201).json({ id: novoProduto.id, message: 'Produto criado com sucesso' });
});

// Rotas de pedidos
app.get('/api/pedidos', (req, res) => {
    const pedidosComUsuarios = pedidos.map(pedido => ({
        ...pedido,
        usuario_nome: usuarios.find(u => u.id === pedido.usuario_id)?.nome || 'Usuário não encontrado'
    }));
    res.json(pedidosComUsuarios);
});

app.post('/api/pedidos', (req, res) => {
    const { usuario_id, total, itens } = req.body;
    const novoPedido = {
        id: pedidos.length + 1,
        usuario_id,
        total: parseFloat(total),
        status: 'pendente',
        data_criacao: new Date()
    };
    pedidos.push(novoPedido);
    res.status(201).json({ id: novoPedido.id, message: 'Pedido criado com sucesso' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💾 Dados em memória (sem banco de dados)`);
});

module.exports = app;
