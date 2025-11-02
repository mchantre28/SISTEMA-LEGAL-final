require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const prisma = require('./prisma-client');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'solicitadora_jwt_secret_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// ========================================
// ROTAS PÚBLICAS
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index-completo.html'));
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Sistema de Gestão para Solicitadora - API com Prisma',
        version: '2.0.0',
            database: 'SQLite/Prisma',
        endpoints: {
            beneficiarios: '/api/beneficiarios',
            atendimentos: '/api/atendimentos',
            processos: '/api/processos',
            indicadores: '/api/indicadores',
            auth: '/api/auth',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1 as test`;
        res.json({
            status: 'OK',
            message: 'Sistema funcionando perfeitamente!',
            database: 'Prisma/SQLite Conectado',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Erro na conexão com o banco',
            error: error.message
        });
    }
});

// ========================================
// AUTENTICAÇÃO
// ========================================

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }

        // Usuários demo
        const users = {
            'admin': { id: 1, username: 'admin', perfil: 'admin' },
            'maria.santos': { id: 2, username: 'maria.santos', perfil: 'solicitadora' }
        };

        const user = users[username];
        if (!user || password !== 'password') {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, perfil: user.perfil },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                perfil: user.perfil
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// BENEFICIÁRIOS
// ========================================

// Listar todos os beneficiários
app.get('/api/beneficiarios', authenticateToken, async (req, res) => {
    try {
        const beneficiarios = await prisma.beneficiario.findMany({
            include: {
                atendimentos: {
                    take: 5,
                    orderBy: { dataAtendimento: 'desc' }
                },
                processos: {
                    take: 5,
                    orderBy: { dataInicio: 'desc' }
                }
            },
            orderBy: { dataRegisto: 'desc' }
        });

        res.json(beneficiarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar beneficiário por ID
app.get('/api/beneficiarios/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiario = await prisma.beneficiario.findUnique({
            where: { id },
            include: {
                atendimentos: {
                    orderBy: { dataAtendimento: 'desc' }
                },
                processos: {
                    orderBy: { dataInicio: 'desc' }
                }
            }
        });

        if (!beneficiario) {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }

        res.json(beneficiario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar beneficiário
app.post('/api/beneficiarios', authenticateToken, async (req, res) => {
    try {
        const { nome, nacionalidade, tipoDocumento, numeroDocumento, situacaoLegal, contacto } = req.body;

        if (!nome || !nacionalidade || !tipoDocumento || !numeroDocumento || !situacaoLegal || !contacto) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const beneficiario = await prisma.beneficiario.create({
            data: {
                nome,
                nacionalidade,
                tipoDocumento,
                numeroDocumento,
                situacaoLegal,
                contacto
            }
        });

        res.status(201).json(beneficiario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar beneficiário
app.put('/api/beneficiarios/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, nacionalidade, tipoDocumento, numeroDocumento, situacaoLegal, contacto } = req.body;

        const beneficiario = await prisma.beneficiario.update({
            where: { id },
            data: {
                nome,
                nacionalidade,
                tipoDocumento,
                numeroDocumento,
                situacaoLegal,
                contacto
            }
        });

        res.json(beneficiario);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Deletar beneficiário
app.delete('/api/beneficiarios/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.beneficiario.delete({
            where: { id }
        });

        res.json({ message: 'Beneficiário deletado com sucesso' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ATENDIMENTOS
// ========================================

// Listar todos os atendimentos
app.get('/api/atendimentos', authenticateToken, async (req, res) => {
    try {
        const atendimentos = await prisma.atendimento.findMany({
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true,
                        numeroDocumento: true,
                        contacto: true
                    }
                }
            },
            orderBy: { dataAtendimento: 'desc' }
        });

        res.json(atendimentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar atendimento por ID
app.get('/api/atendimentos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const atendimento = await prisma.atendimento.findUnique({
            where: { id },
            include: {
                beneficiario: true
            }
        });

        if (!atendimento) {
            return res.status(404).json({ error: 'Atendimento não encontrado' });
        }

        res.json(atendimento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar atendimento
app.post('/api/atendimentos', authenticateToken, async (req, res) => {
    try {
        const { beneficiarioId, tipoAssunto, descricao, dataAtendimento, responsavel, resultado } = req.body;

        if (!beneficiarioId || !tipoAssunto || !descricao || !dataAtendimento || !responsavel || !resultado) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const atendimento = await prisma.atendimento.create({
            data: {
                beneficiarioId,
                tipoAssunto,
                descricao,
                dataAtendimento: new Date(dataAtendimento),
                responsavel,
                resultado
            },
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true,
                        numeroDocumento: true
                    }
                }
            }
        });

        res.status(201).json(atendimento);
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Atualizar atendimento
app.put('/api/atendimentos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { beneficiarioId, tipoAssunto, descricao, dataAtendimento, responsavel, resultado } = req.body;

        const atendimento = await prisma.atendimento.update({
            where: { id },
            data: {
                beneficiarioId,
                tipoAssunto,
                descricao,
                dataAtendimento: dataAtendimento ? new Date(dataAtendimento) : undefined,
                responsavel,
                resultado
            },
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        res.json(atendimento);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Atendimento não encontrado' });
        }
        if (error.code === 'P2003') {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Deletar atendimento
app.delete('/api/atendimentos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.atendimento.delete({
            where: { id }
        });

        res.json({ message: 'Atendimento deletado com sucesso' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Atendimento não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Atendimentos por beneficiário
app.get('/api/beneficiarios/:id/atendimentos', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const atendimentos = await prisma.atendimento.findMany({
            where: { beneficiarioId: id },
            orderBy: { dataAtendimento: 'desc' }
        });

        res.json(atendimentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// PROCESSOS LEGAIS
// ========================================

// Listar todos os processos (compatível com frontend)
app.get('/api/processos', authenticateToken, async (req, res) => {
    try {
        const processos = await prisma.processoLegal.findMany({
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true,
                        numeroDocumento: true,
                        contacto: true,
                        situacaoLegal: true
                    }
                }
            },
            orderBy: { dataInicio: 'desc' }
        });

        // Converter para formato esperado pelo frontend
        const processosFormatados = processos.map(p => ({
            id_processo: p.id,
            id_cliente: p.beneficiarioId,
            numero_processo: `PROC-${p.id.substring(0, 8).toUpperCase()}`,
            tipo_processo: p.tipoProcesso,
            estado: p.estado,
            tribunal: p.tribunal,
            data_abertura: p.dataInicio.toISOString(),
            data_conclusao: p.dataConclusao ? p.dataConclusao.toISOString() : null,
            cliente_nome: p.beneficiario?.nome || '',
            cliente_email: p.beneficiario?.contacto?.includes('@') ? p.beneficiario.contacto : '',
            cliente_telefone: p.beneficiario?.contacto || ''
        }));

        res.json(processosFormatados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar processo por ID
app.get('/api/processos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const processo = await prisma.processoLegal.findUnique({
            where: { id },
            include: {
                beneficiario: true
            }
        });

        if (!processo) {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }

        res.json(processo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar processo (compatível com frontend)
app.post('/api/processos', authenticateToken, async (req, res) => {
    try {
        // Aceitar tanto formato novo (beneficiarioId) quanto formato antigo (id_cliente)
        const { beneficiarioId, id_cliente, tipoProcesso, tipo_processo, estado, tribunal, dataInicio, data_abertura, numero_processo } = req.body;

        const beneficiarioIdFinal = beneficiarioId || id_cliente;
        const tipoProcessoFinal = tipoProcesso || tipo_processo || 'Civil';
        const estadoFinal = estado || 'Em curso';
        const tribunalFinal = tribunal || 'Tribunal Judicial';
        const dataInicioFinal = dataInicio || data_abertura || new Date();

        if (!beneficiarioIdFinal) {
            return res.status(400).json({ error: 'ID do beneficiário/cliente é obrigatório' });
        }

        const processo = await prisma.processoLegal.create({
            data: {
                beneficiarioId: beneficiarioIdFinal,
                tipoProcesso: tipoProcessoFinal,
                estado: estadoFinal,
                tribunal: tribunalFinal,
                dataInicio: new Date(dataInicioFinal),
                dataConclusao: null
            },
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true,
                        numeroDocumento: true
                    }
                }
            }
        });

        // Retornar no formato esperado pelo frontend
        res.status(201).json({
            id: processo.id,
            id_processo: processo.id,
            id_cliente: processo.beneficiarioId,
            numero_processo: numero_processo || `PROC-${processo.id.substring(0, 8).toUpperCase()}`,
            tipo_processo: processo.tipoProcesso,
            estado: processo.estado,
            tribunal: processo.tribunal,
            data_abertura: processo.dataInicio.toISOString(),
            message: 'Processo criado com sucesso'
        });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(404).json({ error: 'Beneficiário/Cliente não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Atualizar processo
app.put('/api/processos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { beneficiarioId, tipoProcesso, estado, tribunal, dataInicio, dataConclusao } = req.body;

        const processo = await prisma.processoLegal.update({
            where: { id },
            data: {
                beneficiarioId,
                tipoProcesso,
                estado,
                tribunal,
                dataInicio: dataInicio ? new Date(dataInicio) : undefined,
                dataConclusao: dataConclusao ? new Date(dataConclusao) : null
            },
            include: {
                beneficiario: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        res.json(processo);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }
        if (error.code === 'P2003') {
            return res.status(404).json({ error: 'Beneficiário não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Deletar processo
app.delete('/api/processos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.processoLegal.delete({
            where: { id }
        });

        res.json({ message: 'Processo deletado com sucesso' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Processo não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Processos por beneficiário
app.get('/api/beneficiarios/:id/processos', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const processos = await prisma.processoLegal.findMany({
            where: { beneficiarioId: id },
            orderBy: { dataInicio: 'desc' }
        });

        res.json(processos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// INDICADORES DE IMPACTO
// ========================================

// Listar todos os indicadores
app.get('/api/indicadores', authenticateToken, async (req, res) => {
    try {
        const indicadores = await prisma.indicadorImpacto.findMany({
            orderBy: { mes: 'desc' }
        });

        res.json(indicadores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar indicador por ID
app.get('/api/indicadores/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const indicador = await prisma.indicadorImpacto.findUnique({
            where: { id }
        });

        if (!indicador) {
            return res.status(404).json({ error: 'Indicador não encontrado' });
        }

        res.json(indicador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar indicador
app.post('/api/indicadores', authenticateToken, async (req, res) => {
    try {
        const { mes, numeroAtendimentos, numeroProcessos, numeroRegularizacoes, satisfacaoMedia } = req.body;

        if (!mes || numeroAtendimentos === undefined || numeroProcessos === undefined || 
            numeroRegularizacoes === undefined || satisfacaoMedia === undefined) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const indicador = await prisma.indicadorImpacto.create({
            data: {
                mes: new Date(mes),
                numeroAtendimentos: parseInt(numeroAtendimentos),
                numeroProcessos: parseInt(numeroProcessos),
                numeroRegularizacoes: parseInt(numeroRegularizacoes),
                satisfacaoMedia: parseFloat(satisfacaoMedia)
            }
        });

        res.status(201).json(indicador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar indicador
app.put('/api/indicadores/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { mes, numeroAtendimentos, numeroProcessos, numeroRegularizacoes, satisfacaoMedia } = req.body;

        const indicador = await prisma.indicadorImpacto.update({
            where: { id },
            data: {
                mes: mes ? new Date(mes) : undefined,
                numeroAtendimentos: numeroAtendimentos !== undefined ? parseInt(numeroAtendimentos) : undefined,
                numeroProcessos: numeroProcessos !== undefined ? parseInt(numeroProcessos) : undefined,
                numeroRegularizacoes: numeroRegularizacoes !== undefined ? parseInt(numeroRegularizacoes) : undefined,
                satisfacaoMedia: satisfacaoMedia !== undefined ? parseFloat(satisfacaoMedia) : undefined
            }
        });

        res.json(indicador);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Indicador não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Deletar indicador
app.delete('/api/indicadores/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.indicadorImpacto.delete({
            where: { id }
        });

        res.json({ message: 'Indicador deletado com sucesso' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Indicador não encontrado' });
        }
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// DASHBOARD
// ========================================

app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const [totalBeneficiarios, totalAtendimentos, totalProcessos, processosPorEstado, indicadores] = await Promise.all([
            prisma.beneficiario.count(),
            prisma.atendimento.count(),
            prisma.processoLegal.count(),
            prisma.processoLegal.groupBy({
                by: ['estado'],
                _count: {
                    estado: true
                }
            }),
            prisma.indicadorImpacto.findMany({
                take: 12,
                orderBy: { mes: 'desc' }
            })
        ]);

        res.json({
            totalClientes: totalBeneficiarios,
            totalBeneficiarios,
            totalAtendimentos,
            totalProcessos,
            processosPorEstado: processosPorEstado.map(p => ({
                estado: p.estado,
                total: p._count.estado
            })),
            indicadores,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ROTAS DE COMPATIBILIDADE COM FRONTEND
// ========================================

// Mapear /api/clientes para /api/beneficiarios
app.get('/api/clientes', authenticateToken, async (req, res) => {
    try {
        const beneficiarios = await prisma.beneficiario.findMany({
            orderBy: { nome: 'asc' }
        });

        // Converter para formato esperado pelo frontend
        const clientes = beneficiarios.map(b => ({
            id_cliente: b.id,
            nome: b.nome,
            nif: b.numeroDocumento,
            morada: '',
            telefone: b.contacto,
            email: b.contacto.includes('@') ? b.contacto : '',
            nacionalidade: b.nacionalidade,
            tipo_documento: b.tipoDocumento,
            situacao_legal: b.situacaoLegal
        }));

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clientes', authenticateToken, async (req, res) => {
    try {
        const { nome, nif, morada, telefone, email, nacionalidade, tipo_documento, situacao_legal } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        // Determinar contacto (prioridade: email > telefone)
        const contacto = email || telefone || '';
        // Determinar tipo de documento
        const tipoDocumento = tipo_documento || (nif ? 'NIF' : 'BI');
        // Determinar número de documento
        const numeroDocumento = nif || '';

        const beneficiario = await prisma.beneficiario.create({
            data: {
                nome,
                nacionalidade: nacionalidade || 'Português',
                tipoDocumento,
                numeroDocumento,
                situacaoLegal: situacao_legal || 'Regular',
                contacto
            }
        });

        res.status(201).json({
            id: beneficiario.id,
            id_cliente: beneficiario.id,
            message: 'Cliente criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para documentos (mock/stub - não há modelo no Prisma ainda)
app.get('/api/documentos', authenticateToken, async (req, res) => {
    try {
        // Retornar array vazio por enquanto
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/documentos', authenticateToken, async (req, res) => {
    try {
        // Retornar resposta mock
        res.status(201).json({
            id_documento: Date.now(),
            message: 'Documento criado (stub - modelo não implementado ainda)'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para financeiro (mock/stub - não há modelo no Prisma ainda)
app.get('/api/financeiro', authenticateToken, async (req, res) => {
    try {
        // Retornar array vazio por enquanto
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/financeiro', authenticateToken, async (req, res) => {
    try {
        // Retornar resposta mock
        res.status(201).json({
            id_financeiro: Date.now(),
            message: 'Movimento financeiro criado (stub - modelo não implementado ainda)'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para agenda (mock/stub - não há modelo no Prisma ainda)
app.get('/api/agenda', authenticateToken, async (req, res) => {
    try {
        // Retornar array vazio por enquanto
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agenda', authenticateToken, async (req, res) => {
    try {
        // Retornar resposta mock
        res.status(201).json({
            id_evento: Date.now(),
            message: 'Evento criado (stub - modelo não implementado ainda)'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    console.log(`🗄️  Usando Prisma com SQLite`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

