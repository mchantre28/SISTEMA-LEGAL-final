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
let localizacoes = [
    { id: 1, distrito: 'Lisboa', concelho: 'Lisboa', freguesia: 'Areeiro', codigo_postal: '1000-001', latitude: 38.7369, longitude: -9.1427 },
    { id: 2, distrito: 'Porto', concelho: 'Porto', freguesia: 'Cedofeita', codigo_postal: '4050-180', latitude: 41.1579, longitude: -8.6291 },
    { id: 3, distrito: 'Coimbra', concelho: 'Coimbra', freguesia: 'Sé Nova', codigo_postal: '3000-213', latitude: 40.2033, longitude: -8.4103 }
];

let especializacoes = [
    { id: 1, descricao: 'Direito Civil', ativo: true },
    { id: 2, descricao: 'Direito Penal', ativo: true },
    { id: 3, descricao: 'Direito Comercial', ativo: true },
    { id: 4, descricao: 'Direito do Trabalho', ativo: true },
    { id: 5, descricao: 'Direito Fiscal', ativo: true },
    { id: 6, descricao: 'Direito Administrativo', ativo: true },
    { id: 7, descricao: 'Direito da Família', ativo: true },
    { id: 8, descricao: 'Direito do Consumo', ativo: true },
    { id: 9, descricao: 'Direito Bancário', ativo: true },
    { id: 10, descricao: 'Direito Imobiliário', ativo: true }
];

let escritorios = [
    { id: 1, nome: 'Escritório Silva & Associados', contacto_email: 'geral@silvaassociados.pt', contacto_telefone: '213456789', localizacao_id: 1, ativo: true },
    { id: 2, nome: 'Advocacia Porto Legal', contacto_email: 'info@portolegal.pt', contacto_telefone: '225678901', localizacao_id: 2, ativo: true },
    { id: 3, nome: 'Sociedade de Advogados Coimbra', contacto_email: 'contacto@coimbraadv.pt', contacto_telefone: '239123456', localizacao_id: 3, ativo: true }
];

let profissionais = [
    { 
        id: 1, 
        nome: 'Dr. João Silva', 
        nif: '123456789', 
        cedula: 'CED001', 
        data_inscricao: '2020-01-15', 
        estado: 'ativo', 
        contacto_email: 'joao.silva@silvaassociados.pt', 
        contacto_tel: '213456789', 
        localizacao_id: 1, 
        escritorio_id: 1,
        especializacoes: ['Direito Civil', 'Direito Comercial', 'Direito da Família']
    },
    { 
        id: 2, 
        nome: 'Dra. Maria Santos', 
        nif: '987654321', 
        cedula: 'CED002', 
        data_inscricao: '2019-03-20', 
        estado: 'ativo', 
        contacto_email: 'maria.santos@silvaassociados.pt', 
        contacto_tel: '213456790', 
        localizacao_id: 1, 
        escritorio_id: 1,
        especializacoes: ['Direito Penal', 'Direito do Trabalho', 'Direito do Consumo']
    },
    { 
        id: 3, 
        nome: 'Dr. Pedro Oliveira', 
        nif: '456789123', 
        cedula: 'CED003', 
        data_inscricao: '2021-06-10', 
        estado: 'ativo', 
        contacto_email: 'pedro.oliveira@portolegal.pt', 
        contacto_tel: '225678902', 
        localizacao_id: 2, 
        escritorio_id: 2,
        especializacoes: ['Direito Civil', 'Direito Fiscal', 'Direito Administrativo']
    }
];

let utilizadores = [
    { id: 1, username: 'admin', perfil: 'admin', profissional_id: null, ativo: true },
    { id: 2, username: 'joao.silva', perfil: 'profissional', profissional_id: 1, ativo: true },
    { id: 3, username: 'maria.santos', perfil: 'profissional', profissional_id: 2, ativo: true },
    { id: 4, username: 'pedro.oliveira', perfil: 'profissional', profissional_id: 3, ativo: true }
];

let historicoRegistos = [
    { id: 1, profissional_id: 1, tipo_ato: 'Inscrição na Ordem', data: '2020-01-15', observacoes: 'Inscrição inicial como advogado' },
    { id: 2, profissional_id: 1, tipo_ato: 'Especialização em Direito Civil', data: '2020-06-15', observacoes: 'Conclusão de curso de especialização' },
    { id: 3, profissional_id: 2, tipo_ato: 'Inscrição na Ordem', data: '2019-03-20', observacoes: 'Inscrição inicial como advogada' },
    { id: 4, profissional_id: 3, tipo_ato: 'Inscrição na Ordem', data: '2021-06-10', observacoes: 'Inscrição inicial como advogado' }
];

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Sistema Jurídico - API funcionando!',
        version: '1.0.0',
        endpoints: {
            profissionais: '/api/profissionais',
            especializacoes: '/api/especializacoes',
            escritorios: '/api/escritorios',
            localizacoes: '/api/localizacoes',
            utilizadores: '/api/utilizadores',
            historico: '/api/historico',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sistema Jurídico funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rotas de profissionais
app.get('/api/profissionais', (req, res) => {
    const profissionaisCompleto = profissionais.map(prof => {
        const localizacao = localizacoes.find(l => l.id === prof.localizacao_id);
        const escritorio = escritorios.find(e => e.id === prof.escritorio_id);
        return {
            ...prof,
            localizacao,
            escritorio
        };
    });
    res.json(profissionaisCompleto);
});

app.post('/api/profissionais', (req, res) => {
    const { nome, nif, cedula, data_inscricao, contacto_email, contacto_tel, localizacao_id, escritorio_id } = req.body;
    const novoProfissional = {
        id: profissionais.length + 1,
        nome,
        nif,
        cedula,
        data_inscricao,
        estado: 'ativo',
        contacto_email,
        contacto_tel,
        localizacao_id,
        escritorio_id,
        especializacoes: []
    };
    profissionais.push(novoProfissional);
    res.status(201).json({ id: novoProfissional.id, message: 'Profissional criado com sucesso' });
});

// Rotas de especializações
app.get('/api/especializacoes', (req, res) => {
    res.json(especializacoes);
});

app.post('/api/especializacoes', (req, res) => {
    const { descricao } = req.body;
    const novaEspecializacao = {
        id: especializacoes.length + 1,
        descricao,
        ativo: true
    };
    especializacoes.push(novaEspecializacao);
    res.status(201).json({ id: novaEspecializacao.id, message: 'Especialização criada com sucesso' });
});

// Rotas de escritórios
app.get('/api/escritorios', (req, res) => {
    const escritoriosCompleto = escritorios.map(esc => {
        const localizacao = localizacoes.find(l => l.id === esc.localizacao_id);
        return {
            ...esc,
            localizacao
        };
    });
    res.json(escritoriosCompleto);
});

app.post('/api/escritorios', (req, res) => {
    const { nome, contacto_email, contacto_telefone, localizacao_id } = req.body;
    const novoEscritorio = {
        id: escritorios.length + 1,
        nome,
        contacto_email,
        contacto_telefone,
        localizacao_id,
        ativo: true
    };
    escritorios.push(novoEscritorio);
    res.status(201).json({ id: novoEscritorio.id, message: 'Escritório criado com sucesso' });
});

// Rotas de localizações
app.get('/api/localizacoes', (req, res) => {
    res.json(localizacoes);
});

app.post('/api/localizacoes', (req, res) => {
    const { distrito, concelho, freguesia, codigo_postal, latitude, longitude } = req.body;
    const novaLocalizacao = {
        id: localizacoes.length + 1,
        distrito,
        concelho,
        freguesia,
        codigo_postal,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    };
    localizacoes.push(novaLocalizacao);
    res.status(201).json({ id: novaLocalizacao.id, message: 'Localização criada com sucesso' });
});

// Rotas de utilizadores
app.get('/api/utilizadores', (req, res) => {
    res.json(utilizadores);
});

// Rotas de histórico
app.get('/api/historico', (req, res) => {
    const historicoCompleto = historicoRegistos.map(hist => {
        const profissional = profissionais.find(p => p.id === hist.profissional_id);
        return {
            ...hist,
            profissional_nome: profissional ? profissional.nome : 'Profissional não encontrado'
        };
    });
    res.json(historicoCompleto);
});

app.post('/api/historico', (req, res) => {
    const { profissional_id, tipo_ato, data, observacoes } = req.body;
    const novoRegisto = {
        id: historicoRegistos.length + 1,
        profissional_id,
        tipo_ato,
        data,
        observacoes
    };
    historicoRegistos.push(novoRegisto);
    res.status(201).json({ id: novoRegisto.id, message: 'Registo histórico criado com sucesso' });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🏛️ Sistema Jurídico rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💾 Dados em memória (sistema jurídico)`);
});

module.exports = app;
