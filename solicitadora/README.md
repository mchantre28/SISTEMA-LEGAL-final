# Sistema de Gestão de Solicitadora - Python/Flask

Sistema completo de gestão para solicitadoras independentes, desenvolvido em Python com Flask e SQLAlchemy.

## 📁 Estrutura do Projeto

```
solicitadora/
├── database.db              # Base de dados SQLite
├── main.py                  # Aplicação principal Flask
├── config.py                # Configurações
├── requirements.txt         # Dependências Python
├── models/                  # Modelos SQLAlchemy
│   ├── __init__.py
│   ├── cliente.py          # Modelo Cliente
│   ├── processo.py         # Modelo Processo
│   ├── financeiro.py       # Modelo Financeiro
│   ├── documento.py        # Modelo Documento
│   ├── agenda.py           # Modelo Agenda
│   └── solicitadora.py     # Modelo Solicitadora
└── views/                   # Views/Controllers
    ├── __init__.py
    ├── dashboard.py        # Relatórios e Dashboard
    └── agenda.py           # Gestão de Agenda
```

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Executar a Aplicação

```bash
python main.py
```

A aplicação estará disponível em: `http://localhost:5000`

## 📊 Funcionalidades

### 🔐 Autenticação
- **POST** `/api/auth/login` - Login do usuário

### 👥 Gestão de Clientes
- **GET** `/api/clientes` - Listar clientes
- **POST** `/api/clientes` - Criar cliente
- **GET** `/api/clientes/{id}` - Obter cliente
- **PUT** `/api/clientes/{id}` - Atualizar cliente
- **DELETE** `/api/clientes/{id}` - Deletar cliente

### 📋 Gestão de Processos
- **GET** `/api/processos` - Listar processos
- **POST** `/api/processos` - Criar processo

### 💰 Gestão Financeira
- **GET** `/api/financeiro` - Listar registros financeiros
- **POST** `/api/financeiro` - Criar registro financeiro

### 📅 Gestão de Agenda
- **GET** `/api/agenda` - Listar eventos
- **POST** `/api/agenda` - Criar evento
- **GET** `/api/agenda/{id}` - Obter evento
- **PUT** `/api/agenda/{id}` - Atualizar evento
- **DELETE** `/api/agenda/{id}` - Deletar evento
- **GET** `/api/agenda/hoje` - Eventos de hoje
- **GET** `/api/agenda/semana` - Eventos da semana

## 📈 Relatórios Disponíveis

### Dashboard e Relatórios
- **GET** `/api/relatorios/processos-ativos` - Processos em curso
- **GET** `/api/relatorios/total-financeiro` - Total financeiro por processo
- **GET** `/api/relatorios/proximos-compromissos` - Próximos compromissos
- **GET** `/api/relatorios/processos-completos` - Relatório completo de processos
- **GET** `/api/relatorios/financeiro-detalhado` - Relatório financeiro detalhado
- **GET** `/api/relatorios/clientes-ativos` - Clientes ativos e estatísticas
- **GET** `/api/relatorios/fluxo-caixa-mensal` - Fluxo de caixa mensal
- **GET** `/api/relatorios/processos-concluidos-mes` - Processos concluídos por mês
- **GET** `/api/relatorios/alertas-prazos` - Alertas de prazos
- **GET** `/api/relatorios/pagamentos-pendentes` - Pagamentos pendentes

## 🔧 Tecnologias Utilizadas

- **Python 3.8+**
- **Flask 2.3.3** - Framework web
- **Flask-SQLAlchemy 3.0.5** - ORM para banco de dados
- **Flask-Migrate 4.0.5** - Migrações de banco
- **Flask-CORS 4.0.0** - CORS para APIs
- **SQLite** - Base de dados
- **JWT** - Autenticação
- **python-dotenv** - Variáveis de ambiente

## 📝 Exemplo de Uso

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Listar Processos Ativos
```bash
curl -X GET http://localhost:5000/api/relatorios/processos-ativos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Cliente
```bash
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Silva",
    "nif": "123456789",
    "email": "joao@email.com",
    "telefone": "+351 911 222 333"
  }'
```

## 🗄️ Base de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- **clientes** - Dados dos clientes
- **processos** - Processos jurídicos
- **documentos** - Documentos dos processos
- **financeiro** - Registros financeiros
- **agenda** - Eventos e compromissos
- **solicitadora** - Dados da solicitadora

## 🔒 Segurança

- Autenticação JWT obrigatória para todas as rotas protegidas
- Validação de dados de entrada
- Tratamento de erros padronizado
- CORS configurado para desenvolvimento

## 📱 Interface

O sistema é uma API REST completa, podendo ser integrada com qualquer frontend (React, Vue, Angular, etc.) ou consumida diretamente via HTTP requests.

## 🚀 Deploy

Para produção, configure:
- Variáveis de ambiente adequadas
- Banco de dados PostgreSQL/MySQL
- Servidor WSGI (Gunicorn)
- Proxy reverso (Nginx)
- HTTPS/SSL
