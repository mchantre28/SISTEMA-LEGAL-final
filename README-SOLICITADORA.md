# ⚖️ Sistema de Gestão para Solicitadora Independente

Sistema completo de gestão para solicitadora independente, desenvolvido em Node.js, Express, MySQL e frontend HTML/CSS/JavaScript.

## 🎯 Funcionalidades Principais

### 👥 Gestão de Clientes
- Dados pessoais e de contacto completos
- Tipos: Pessoa Singular e Pessoa Coletiva
- Estados: Ativo, Inativo, Potencial
- Histórico completo de interações

### 📋 Processos Jurídicos
- Numeração única de processos
- Categorização por tipo (Civil, Penal, Comercial, etc.)
- Estados: Aberto, Em Andamento, Suspenso, Concluído, Arquivado
- Prioridades: Baixa, Média, Alta, Urgente
- Valores de causa e observações

### 📄 Sistema de Documentos
- Upload de ficheiros (PDF, DOC, DOCX, TXT, imagens)
- Categorização por tipo (Contrato, Petição, Sentença, etc.)
- Versionamento de documentos
- Estados: Rascunho, Final, Aprovado, Rejeitado

### 💰 Gestão Financeira
- **Honorários**: Fixos, por hora, percentagem, por ato
- **Despesas**: Deslocação, documentos, comunicações, pesquisas
- **Pagamentos**: Múltiplos métodos de pagamento
- **Faturas**: Geração e controlo de faturas
- Relatórios financeiros completos

### 📅 Agenda e Compromissos
- Agendamento de reuniões, audiências, prazos
- Lembretes automáticos
- Localização e participantes
- Estados: Agendado, Realizado, Cancelado, Adiado

### ✅ Gestão de Tarefas
- Tarefas com prioridades (Baixa, Média, Alta, Urgente)
- Prazos e datas de vencimento
- Estados: Pendente, Em Andamento, Concluída, Cancelada
- Associação a processos e clientes

### 👤 Perfil da Solicitadora
- Dados pessoais e profissionais
- Especializações e competências
- Cédula e dados de inscrição
- Configurações do sistema

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL (versão 5.7 ou superior)
- Git

### 2. Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd experiencia

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp config-example.env .env
# Editar o arquivo .env com suas configurações
```

### 3. Configuração da Base de Dados
```bash
# Criar a base de dados
mysql -u root -p
CREATE DATABASE solicitadora_db;

# Importar o schema
mysql -u root -p solicitadora_db < database/schema-solicitadora.sql

# Importar dados iniciais
mysql -u root -p solicitadora_db < database/seed-solicitadora.sql
```

### 4. Configuração do .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=solicitadora_db
DB_PORT=3306
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
PORT=3000
```

### 5. Iniciar o Sistema
```bash
# Windows
iniciar-solicitadora.bat

# Linux/Mac
node backend/app-solicitadora.js
```

## 📱 Acesso ao Sistema

- **URL**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Login padrão**: 
  - Username: `admin` ou `maria.santos`
  - Password: `password`

## 🔧 Estrutura do Projeto

```
experiencia/
├── backend/
│   └── app-solicitadora.js      # Servidor principal
├── frontend/
│   └── index-solicitadora.html  # Interface web
├── database/
│   ├── schema-solicitadora.sql  # Estrutura da BD
│   └── seed-solicitadora.sql    # Dados iniciais
├── uploads/
│   └── documents/               # Ficheiros carregados
├── package.json                 # Dependências
├── iniciar-solicitadora.bat     # Script de inicialização
└── README-SOLICITADORA.md       # Este arquivo
```

## 📊 Módulos do Sistema

### 1. Dashboard
- Estatísticas em tempo real
- Resumo de atividades
- Indicadores de performance

### 2. Clientes
- CRUD completo de clientes
- Gestão de contactos
- Histórico de interações

### 3. Processos
- Criação e gestão de processos
- Acompanhamento de estados
- Associação a clientes

### 4. Documentos
- Upload e gestão de ficheiros
- Categorização e versionamento
- Controlo de acesso

### 5. Financeiro
- Honorários e despesas
- Pagamentos e faturas
- Relatórios financeiros

### 6. Agenda
- Compromissos e reuniões
- Lembretes automáticos
- Gestão de tempo

### 7. Tarefas
- Lista de tarefas
- Prioridades e prazos
- Acompanhamento de progresso

### 8. Perfil
- Dados da solicitadora
- Configurações pessoais
- Especializações

## 🔒 Segurança

- Autenticação JWT
- Criptografia de passwords
- Auditoria de operações
- Controlo de acesso por perfil
- Upload seguro de ficheiros

## 📈 Funcionalidades Avançadas

- **Auditoria**: Registo completo de todas as operações
- **Backup**: Sistema de backup automático
- **Relatórios**: Geração de relatórios em PDF
- **Notificações**: Sistema de alertas e lembretes
- **Mobile**: Interface responsiva para dispositivos móveis

## 🛠️ Manutenção

### Backup da Base de Dados
```bash
mysqldump -u root -p solicitadora_db > backup_solicitadora.sql
```

### Restaurar Backup
```bash
mysql -u root -p solicitadora_db < backup_solicitadora.sql
```

### Logs do Sistema
Os logs são guardados automaticamente na tabela `Auditoria_Log` da base de dados.

## 📞 Suporte

Para questões técnicas ou suporte:
- Verificar logs na tabela `Auditoria_Log`
- Consultar documentação da API em `/api`
- Verificar configurações no arquivo `.env`

## 🔄 Atualizações

Para atualizar o sistema:
1. Fazer backup da base de dados
2. Atualizar código
3. Executar migrações se necessário
4. Reiniciar o servidor

---

**Sistema de Gestão para Solicitadora Independente**  
Desenvolvido com ❤️ para profissionais jurídicos
