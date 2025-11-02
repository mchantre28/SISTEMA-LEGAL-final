# 📁 Guia de Organização de Projetos

## 🎯 Projetos Identificados

### 1. **Sistema Legal** (`projetos/sistema-legal/`)
Arquivos relacionados ao sistema jurídico com modais:
- `index_clean.html` ✅ (trabalho recente nos modais)
- `sistema-legal.html`
- `sistema-melhorado.html`
- `sistema-otimizado.html`
- Arquivos do `frontend/` relacionados ao sistema legal

### 2. **Loja Variada** (`projetos/loja-variada/`)
Loja online simples:
- `index.html`
- `script.js`
- `styles.css`

### 3. **Solicitadora** (`projetos/solicitadora/`)
Sistema jurídico Solicitadora:
- Arquivos com `*solicitadora*` no nome
- Pasta `solicitadora/` (Python)
- Arquivos do `frontend/` relacionados à Solicitadora

### 4. **Backend/API** (`projetos/backend-api/`)
Backend e APIs:
- `backend/`
- `api/`
- `database/`

## 🚀 Como Executar a Organização

### Opção 1: Script Automático
```powershell
.\organizar-projetos.ps1
```

### Opção 2: Manual (Recomendado para revisar)
1. Revise os arquivos antes de mover
2. Execute o script se estiver tudo certo

## ⚠️ Arquivos que NÃO serão movidos
- `package.json` (raiz do projeto)
- `.env` / `config.env`
- `node_modules/`
- `prisma/`
- `scripts/`
- `README.md`

## 📋 Após Organização

Cada projeto terá sua própria estrutura:
```
projetos/
├── sistema-legal/
│   ├── index_clean.html
│   ├── sistema-legal.html
│   └── frontend/
├── loja-variada/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── solicitadora/
│   ├── app-solicitadora.js
│   └── solicitadora/
└── backend-api/
    ├── backend/
    ├── api/
    └── database/
```

## ✅ Próximos Passos

1. **Executar script de organização**
2. **Verificar se tudo está correto**
3. **Fazer commit das alterações**
4. **Criar README.md em cada projeto**

