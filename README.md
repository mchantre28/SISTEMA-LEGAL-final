# 🚀 Novo Projeto Local

## 📋 Descrição
Sistema completo de gestão empresarial com banco de dados MySQL, API RESTful em Node.js e interface web moderna. Inclui gestão de profissionais, escritórios, especializações, localizações e histórico com funcionalidades CRUD completas e sistema de autenticação.

## 🏗️ Estrutura do Projeto

```
/novo-projeto-local/
├── database/
│   ├── schema.sql          # Estrutura completa do banco
│   └── seed.sql           # Dados iniciais
├── backend/
│   └── app.js             # Servidor principal
├── frontend/
│   └── index.html         # Interface web moderna
├── config/                # Arquivos de configuração
├── .env                   # Variáveis de ambiente
├── docker-compose.yml     # Configuração Docker
├── Dockerfile            # Imagem Docker
├── package.json          # Dependências Node.js
└── README.md             # Documentação
```

## ✨ Funcionalidades

### 🔐 **Sistema de Autenticação**
- Login seguro com JWT
- Diferentes perfis de utilizador
- Sessões persistentes
- Logout automático

### 👨‍💼 **Gestão de Profissionais**
- Cadastro completo (nome, NIF, cédula, especializações)
- Gestão de estado (ativo, inativo, suspenso, aposentado)
- Associação com escritórios e localizações
- Histórico de registos

### 🏢 **Gestão de Escritórios**
- Cadastro de escritórios de advocacia
- Contatos e websites
- Localizações geográficas
- Status ativo/inativo

### 📚 **Especializações**
- Categorias de especialização
- Gestão de áreas de atuação
- Associação com profissionais
- Níveis de especialização

### 📍 **Localizações**
- Distrito, concelho, freguesia
- Códigos postais e coordenadas GPS
- Gestão geográfica completa

### 📋 **Histórico e Auditoria**
- Registos de atos profissionais
- Sistema de auditoria completo
- Logs de operações
- Rastreabilidade total

### 📊 **Dashboard e Estatísticas**
- Estatísticas em tempo real
- Gráficos de performance
- Relatórios detalhados
- Métricas de utilização

## 🚀 **Tecnologias Utilizadas**

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver do banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de passwords
- **CORS** - Controle de acesso

### **Frontend**
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna
- **JavaScript** - Funcionalidades interativas
- **Fetch API** - Comunicação com backend

### **Banco de Dados**
- **MySQL 8.0** - Sistema de gerenciamento
- **Schema SQL** - Estrutura das tabelas
- **Seed SQL** - Dados iniciais
- **Triggers** - Auditoria automática
- **Views** - Consultas otimizadas
- **Procedures** - Lógica de negócio

### **DevOps**
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **phpMyAdmin** - Interface de administração

## 📱 **Recursos**

- ✅ Sistema de autenticação completo
- ✅ API RESTful com autenticação JWT
- ✅ Interface web moderna e responsiva
- ✅ Banco de dados relacional otimizado
- ✅ Sistema de auditoria automática
- ✅ Validação de dados robusta
- ✅ Tratamento de erros avançado
- ✅ Containerização Docker
- ✅ Documentação completa
- ✅ Dados de exemplo realistas

## 🎯 **Como Usar**

### **Instalação Local**

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd novo-projeto-local
   ```

2. **Configure o banco de dados**
   - Instale MySQL 8.0
   - Crie o banco: `novo_projeto_local`
   - Execute os scripts SQL:
     ```bash
     mysql -u root -p < database/schema.sql
     mysql -u root -p < database/seed.sql
     ```

3. **Configure as variáveis de ambiente**
   - Edite o arquivo `.env` com suas configurações

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Inicie o servidor**
   ```bash
   npm start
   ```

6. **Acesse a aplicação**
   - Sistema: `http://localhost:3000`
   - API: `http://localhost:3000/api`

### **Instalação com Docker**

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd novo-projeto-local
   ```

2. **Inicie com Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - Sistema: `http://localhost:3000`
   - phpMyAdmin: `http://localhost:8080`

## 📊 **Endpoints da API**

### **Autenticação**
- `POST /api/auth/login` - Login de utilizador

### **Profissionais**
- `GET /api/profissionais` - Listar profissionais
- `POST /api/profissionais` - Criar profissional
- `GET /api/profissionais/:id` - Buscar profissional

### **Escritórios**
- `GET /api/escritorios` - Listar escritórios
- `POST /api/escritorios` - Criar escritório

### **Especializações**
- `GET /api/especializacoes` - Listar especializações
- `POST /api/especializacoes` - Criar especialização

### **Localizações**
- `GET /api/localizacoes` - Listar localizações
- `POST /api/localizacoes` - Criar localização

### **Histórico**
- `GET /api/historico` - Listar registos
- `POST /api/historico` - Criar registo

### **Estatísticas**
- `GET /api/estatisticas` - Obter estatísticas

## 🗄️ **Estrutura do Banco**

### **Tabelas Principais**
- `Profissional` - Dados dos profissionais
- `Escritorio` - Escritórios de advocacia
- `Especializacao` - Especializações disponíveis
- `Localizacao` - Localizações geográficas
- `Historico_Registo` - Registos históricos
- `Utilizador` - Utilizadores do sistema
- `Auditoria_Log` - Logs de auditoria

### **Relacionamentos**
- Profissional → Escritório (N:1)
- Profissional → Localização (N:1)
- Profissional → Especializações (N:N)
- Profissional → Histórico (1:N)
- Utilizador → Profissional (1:1)

### **Recursos Avançados**
- Triggers de auditoria automática
- Views otimizadas para consultas
- Procedures para lógica de negócio
- Índices para performance
- Constraints de integridade

## 🔧 **Configuração**

### **Variáveis de Ambiente (.env)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=novo_projeto_local
DB_PORT=3306
PORT=3000
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_2024
```

### **Docker Compose**
- MySQL 8.0 com dados persistentes
- Aplicação Node.js
- phpMyAdmin para administração
- Rede isolada e segura

## 📈 **Funcionalidades Avançadas**

### **Sistema de Auditoria**
- Log automático de todas as operações
- Rastreabilidade completa
- Dados anteriores e novos
- IP e user agent

### **Autenticação e Segurança**
- JWT com expiração
- Hash de passwords com bcrypt
- Middleware de autenticação
- Controle de acesso por perfil

### **Performance**
- Pool de conexões MySQL
- Índices otimizados
- Views para consultas complexas
- Procedures para lógica de negócio

### **Interface Moderna**
- Design responsivo
- Autenticação integrada
- Formulários intuitivos
- Dashboard em tempo real

## 🧪 **Testes**

```bash
# Executar testes
npm test

# Modo desenvolvimento
npm run dev

# Reset do banco de dados
npm run reset-db
```

## 📝 **Credenciais de Teste**

### **Utilizadores Disponíveis**
- **admin** / **password** - Administrador
- **joao.silva** / **password** - Profissional
- **maria.santos** / **password** - Profissional
- **publico1** / **password** - Utilizador público

## 📝 **Versão**
**v2.0.0** - Novo Projeto Local Completo

## 👨‍💻 **Desenvolvido por**
Sistema de Gestão Empresarial

---
*Projeto completo com backend, frontend, banco de dados e sistema de autenticação*