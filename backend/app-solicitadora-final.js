const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

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

// Rota principal - SEMPRE serve o arquivo correto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index-solicitadora-fixed.html'));
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
    res.json({ 
        status: 'OK', 
        message: 'Sistema funcionando perfeitamente!',
        database: 'Modo Demo',
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
// ROTAS DEMO (SEM BASE DE DADOS)
// ========================================

app.get('/api/clientes', authenticateToken, async (req, res) => {
    const clientes = [
        {
            id: 1,
            nome: 'João Manuel Ferreira',
            nif: '987654321',
            contacto_email: 'joao.ferreira@email.com',
            contacto_telefone: '+351 911 222 333',
            tipo_cliente: 'pessoa_singular',
            estado: 'ativo'
        },
        {
            id: 2,
            nome: 'Ana Cristina Oliveira',
            nif: '456789123',
            contacto_email: 'ana.oliveira@email.com',
            contacto_telefone: '+351 922 333 444',
            tipo_cliente: 'pessoa_singular',
            estado: 'ativo'
        },
        {
            id: 3,
            nome: 'Empresa ABC, Lda',
            nif: '123456789',
            contacto_email: 'geral@empresaabc.pt',
            contacto_telefone: '+351 213 456 789',
            tipo_cliente: 'pessoa_coletiva',
            estado: 'ativo'
        }
    ];
    res.json(clientes);
});

app.get('/api/processos', authenticateToken, async (req, res) => {
    const processos = [
        {
            id: 1,
            numero_processo: 'PROC-2024-001',
            titulo: 'Ação de Divórcio',
            cliente_nome: 'João Manuel Ferreira',
            tipo_processo: 'civil',
            estado: 'em_andamento',
            data_abertura: '2024-01-15',
            valor_causa: 5000.00
        },
        {
            id: 2,
            numero_processo: 'PROC-2024-002',
            titulo: 'Contrato de Trabalho',
            cliente_nome: 'Ana Cristina Oliveira',
            tipo_processo: 'trabalho',
            estado: 'aberto',
            data_abertura: '2024-02-01',
            valor_causa: 2000.00
        }
    ];
    res.json(processos);
});

app.get('/api/documentos', authenticateToken, async (req, res) => {
    const documentos = [
        {
            id: 1,
            titulo: 'Petição Inicial',
            tipo_documento: 'peticao',
            ficheiro_nome: 'peticao_divorcio_001.pdf',
            data_upload: '2024-01-15',
            estado: 'final'
        },
        {
            id: 2,
            titulo: 'Certidão de Casamento',
            tipo_documento: 'certidao',
            ficheiro_nome: 'certidao_casamento.pdf',
            data_upload: '2024-01-10',
            estado: 'aprovado'
        }
    ];
    res.json(documentos);
});

app.get('/api/honorarios', authenticateToken, async (req, res) => {
    const honorarios = [
        {
            id: 1,
            descricao: 'Honorários iniciais - Divórcio',
            tipo_honorario: 'fixo',
            valor: 1000.00,
            total: 1000.00,
            data_honorario: '2024-01-15',
            estado: 'pago'
        },
        {
            id: 2,
            descricao: 'Honorários por hora - Consultas',
            tipo_honorario: 'por_hora',
            valor: 75.00,
            total: 375.00,
            data_honorario: '2024-02-01',
            estado: 'pendente'
        }
    ];
    res.json(honorarios);
});

app.get('/api/agenda', authenticateToken, async (req, res) => {
    const agenda = [
        {
            id: 1,
            titulo: 'Reunião com Cliente - Divórcio',
            tipo_compromisso: 'reuniao',
            data_inicio: '2024-03-15T14:00:00',
            local: 'Escritório',
            estado: 'agendado'
        },
        {
            id: 2,
            titulo: 'Audiência no Tribunal',
            tipo_compromisso: 'audiencia',
            data_inicio: '2024-03-20T10:00:00',
            local: 'Tribunal do Trabalho de Coimbra',
            estado: 'agendado'
        }
    ];
    res.json(agenda);
});

app.get('/api/tarefas', authenticateToken, async (req, res) => {
    const tarefas = [
        {
            id: 1,
            titulo: 'Preparar Documentos para Audiência',
            prioridade: 'alta',
            data_vencimento: '2024-03-18',
            estado: 'pendente'
        },
        {
            id: 2,
            titulo: 'Contactar Entidade Patronal',
            prioridade: 'media',
            data_vencimento: '2024-03-15',
            estado: 'em_andamento'
        }
    ];
    res.json(tarefas);
});

app.get('/api/solicitadora', authenticateToken, async (req, res) => {
    const solicitadora = {
        id: 1,
        nome: 'Maria Silva Santos',
        nif: '123456789',
        cedula: 'SOL-001',
        contacto_email: 'maria.santos@solicitadora.pt',
        contacto_telefone: '+351 912 345 678',
        especializacoes: 'Direito Civil, Direito Comercial, Direito do Trabalho'
    };
    res.json(solicitadora);
});

app.get('/api/estatisticas', authenticateToken, async (req, res) => {
    const stats = {
        clientes_ativos: 3,
        processos_ativos: 2,
        processos_concluidos: 1,
        receitas_totais: 1800.00,
        honorarios_pagos: 1000.00,
        compromissos_hoje: 1,
        tarefas_vencendo: 2
    };
    res.json(stats);
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
    console.log(`💾 Modo: Demo (sem base de dados)`);
    console.log(`📄 Arquivo: index-solicitadora-fixed.html`);
});

module.exports = app;
