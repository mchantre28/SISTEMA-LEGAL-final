# Beleza & Fragrâncias - Loja de Cosméticos e Perfumes

Um site moderno e elegante especializado em cosméticos e perfumes, desenvolvido com HTML, CSS e JavaScript puro.

## 🌸 Características

- **Design Elegante**: Interface feminina e sofisticada com tons rosa e roxo
- **Catálogo Especializado**: Produtos de beleza organizados por categoria
- **Sistema de Busca**: Busca em tempo real por nome e descrição
- **Carrinho de Compras**: Adicionar, remover e alterar quantidades
- **Modal de Detalhes**: Visualização detalhada dos produtos
- **Interface Intuitiva**: Navegação suave e experiência de usuário otimizada

## 📁 Estrutura do Projeto

```
beleza-fragrancias/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
└── README.md           # Este arquivo
```

## 💄 Funcionalidades

### Catálogo de Produtos
- 16 produtos pré-cadastrados em 3 categorias:
  - **Perfumes**: Fragrâncias femininas, masculinas e unissex
  - **Maquiagem**: Base, batom, sombras, rímel e kits completos
  - **Skincare**: Cremes, séruns, máscaras e produtos de cuidado
- Cards elegantes com informações detalhadas
- Preços em formato brasileiro (R$)

### Sistema de Filtros
- Filtro por categoria com botões interativos
- Busca em tempo real por nome ou descrição
- Combinação inteligente de filtros e busca

### Carrinho de Compras
- Adicionar produtos com um clique
- Alterar quantidades (+ e -)
- Remover itens individuais
- Limpar carrinho completo
- Cálculo automático do total
- Contador visual no ícone do carrinho

### Detalhes do Produto
- Modal com informações completas
- Seleção de quantidade
- Adicionar múltiplas unidades ao carrinho

### Seções Informativas
- **Sobre**: Informações sobre a empresa especializada em beleza
- **Contato**: Formulário funcional e dados de contato
- **Footer**: Links úteis e redes sociais

## 🎨 Design

- **Cores**: Gradientes suaves em tons de rosa e roxo
- **Tipografia**: Segoe UI para elegância e legibilidade
- **Ícones**: Font Awesome com tema de beleza (spa, cosméticos)
- **Animações**: Transições suaves e efeitos hover delicados
- **Layout**: Grid responsivo com visual feminino

## 📱 Responsividade

O site é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar e grid de produtos
- **Tablet**: Ajustes no grid e navegação
- **Mobile**: Layout em coluna única com navegação otimizada

## 🚀 Como Usar

1. **Abrir o Site**: Abra o arquivo `index.html` em qualquer navegador moderno
2. **Navegar**: Use o menu superior para navegar entre as seções
3. **Filtrar Produtos**: Use os botões de categoria ou a barra de busca
4. **Ver Detalhes**: Clique em qualquer produto para ver mais informações
5. **Comprar**: Adicione produtos ao carrinho e finalize a compra

## 🔧 Personalização

### Adicionar Novos Produtos
Edite o array `produtos` no arquivo `script.js`:

```javascript
{
    id: 17,
    nome: "Nome do Produto",
    categoria: "perfumes", // ou "maquiagem" ou "skincare"
    preco: 99.99,
    descricao: "Descrição do produto",
    imagem: "🌸"
}
```

### Modificar Categorias
As categorias são:
- **perfumes**: Fragrâncias e colônias
- **maquiagem**: Produtos de maquiagem
- **skincare**: Produtos de cuidados com a pele

### Personalizar Cores
Edite as variáveis CSS no arquivo `styles.css`:
- Gradientes principais em tons de rosa
- Cores dos botões e elementos interativos
- Cores de destaque e hover

## 📞 Informações de Contato

- **Telefone**: (11) 99999-9999
- **Email**: contato@belezaefragrancias.com
- **Endereço**: Rua das Flores, 123 - São Paulo - SP

## 🌟 Próximas Melhorias

- [ ] Integração com sistema de pagamento
- [ ] Cadastro de usuários
- [ ] Histórico de compras
- [ ] Sistema de avaliações de produtos
- [ ] Consultoria online de beleza
- [ ] Backend com banco de dados
- [ ] Painel administrativo

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins comerciais e educacionais.

---

**Desenvolvido com 💄 para facilitar a venda de cosméticos e perfumes**