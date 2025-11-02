// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Perfume Chanel N°5",
        categoria: "perfumes",
        preco: 24.99,
        descricao: "Perfume feminino icônico com notas florais e almiscaradas. Duração de até 8 horas.",
        imagem: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 2,
        nome: "Base Líquida Matte",
        categoria: "maquiagem",
        preco: 24.99,
        descricao: "Base líquida com acabamento mate e cobertura média-alta. Resistente à água.",
        imagem: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 3,
        nome: "Batom Vermelho Clássico",
        categoria: "maquiagem",
        preco: 12.99,
        descricao: "Batom vermelho de longa duração com fórmula hidratante e brilho intenso.",
        imagem: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 4,
        nome: "Sérum Anti-idade",
        categoria: "skincare",
        preco: 45.99,
        descricao: "Sérum com ácido hialurônico e vitamina C para reduzir linhas de expressão.",
        imagem: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 5,
        nome: "Perfume Masculino Sauvage",
        categoria: "perfumes",
        preco: 74.99,
        descricao: "Perfume masculino com notas de pimenta rosa e ambroxan. Fragrância marcante.",
        imagem: "https://images.unsplash.com/photo-1594736797933-d0c29c8b0f0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 6,
        nome: "Creme Hidratante Facial",
        categoria: "skincare",
        preco: 22.99,
        descricao: "Creme hidratante para todos os tipos de pele com proteção solar FPS 30.",
        imagem: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 7,
        nome: "Paleta de Sombras",
        categoria: "maquiagem",
        preco: 35.99,
        descricao: "Paleta com 12 cores de sombras matte e brilhantes para looks diversos.",
        imagem: "https://images.unsplash.com/photo-1512496015851-a90fb38cd796?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 8,
        nome: "Máscara de Argila",
        categoria: "skincare",
        preco: 18.99,
        descricao: "Máscara facial de argila verde para purificar e desintoxicar a pele.",
        imagem: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 9,
        nome: "Perfume Doce Vanilla",
        categoria: "perfumes",
        preco: 59.99,
        descricao: "Perfume feminino com notas de baunilha e flor de laranjeira. Fragrância doce e envolvente.",
        imagem: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 10,
        nome: "Rímel à Prova d'Água",
        categoria: "maquiagem",
        preco: 15.99,
        descricao: "Rímel volumoso e alongador com fórmula à prova d'água e resistente.",
        imagem: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 11,
        nome: "Óleo Corporal Hidratante",
        categoria: "skincare",
        preco: 27.99,
        descricao: "Óleo corporal com óleo de coco e vitamina E para hidratação profunda.",
        imagem: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 12,
        nome: "Perfume Unissex Fresh",
        categoria: "perfumes",
        preco: 69.99,
        descricao: "Perfume unissex com notas cítricas e aquáticas. Ideal para o dia a dia.",
        imagem: "https://images.unsplash.com/photo-1594736797933-d0c29c8b0f0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 13,
        nome: "Corretivo Multi-uso",
        categoria: "maquiagem",
        preco: 11.99,
        descricao: "Corretivo cremoso para olheiras, manchas e imperfeições. Cobertura alta.",
        imagem: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 14,
        nome: "Esfoliante Facial Suave",
        categoria: "skincare",
        preco: 20.99,
        descricao: "Esfoliante com microesferas de jojoba para renovação celular suave.",
        imagem: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 15,
        nome: "Perfume Oriental Luxo",
        categoria: "perfumes",
        preco: 99.99,
        descricao: "Perfume feminino com notas orientais de âmbar e sândalo. Fragrância sofisticada.",
        imagem: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"
    },
    {
        id: 16,
        nome: "Kit Maquiagem Completo",
        categoria: "maquiagem",
        preco: 59.99,
        descricao: "Kit com base, batom, sombra, rímel e pincéis. Ideal para iniciantes.",
        imagem: "https://images.unsplash.com/photo-1512496015851-a90fb38cd796?w=400&h=400&fit=crop&crop=center"
    }
];

// Estado do carrinho
let produtoAtual = null;

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const productModal = document.getElementById('product-modal');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que o header sempre seja visível
    garantirHeaderVisivel();
    
    renderizarProdutos(produtos);
    configurarEventListeners();
    configurarFechamentoModais();
});

// Função para garantir que o header sempre seja visível
function garantirHeaderVisivel() {
    const header = document.querySelector('.header');
    if (header) {
        header.style.display = 'block';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
    }
}

// Executar a cada segundo para garantir que o header permaneça visível
setInterval(garantirHeaderVisivel, 1000);

// Configurar event listeners
function configurarEventListeners() {
    // Filtros de categoria
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const categoria = this.dataset.category;
            filtrarProdutos(categoria);
        });
    });

    // Busca
    searchInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        buscarProdutos(termo);
    });

    // WhatsApp - já configurado via href no HTML
    
    // Event listeners do carrinho serão configurados quando o modal abrir

    // Modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', fecharModais);
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            fecharModais();
        }
    });

    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formulário de contato
    document.querySelector('.contact-form form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
}

// Renderizar produtos
function renderizarProdutos(produtosParaRenderizar) {
    productsGrid.innerHTML = '';
    
    produtosParaRenderizar.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
                <div class="product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyNS4xIDE1MCAyNDUgMTY5LjkgMjQ1IDE5NUMyNDUgMjIwLjEgMjI1LjEgMjQwIDIwMCAyNDBDMTc0LjkgMjQwIDE1NSAyMjAuMSAxNTUgMTk1QzE1NSAxNjkuOSAxNzQuOSAxNTAgMjAwIDE1MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTE4NSAxODVMMjAwIDE3MEwyMTUgMTg1TDIwMCAyMDBMMTg1IDE4NVoiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+'; this.onerror=null;">
                </div>
            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="product-price">€${produto.preco.toFixed(2)}</div>
                <button class="btn-whatsapp" onclick="comprarViaWhatsApp(${produto.id})">
                    <i class="fab fa-whatsapp"></i> Comprar via WhatsApp
                </button>
            </div>
        `;
        
        // Adicionar evento de clique para abrir detalhes
        productCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-whatsapp')) {
                abrirDetalhesProduto(produto.id);
            }
        });
        
        productsGrid.appendChild(productCard);
    });
    
    // Verificar carregamento das imagens após renderizar
    setTimeout(verificarImagens, 100);
}

// Filtrar produtos por categoria
function filtrarProdutos(categoria) {
    let produtosFiltrados = produtos;
    
    if (categoria !== 'todos') {
        produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    }
    
    // Aplicar filtro de busca também
    const termoBusca = searchInput.value.toLowerCase();
    if (termoBusca) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.nome.toLowerCase().includes(termoBusca) ||
            produto.descricao.toLowerCase().includes(termoBusca)
        );
    }
    
    renderizarProdutos(produtosFiltrados);
}

// Buscar produtos
function buscarProdutos(termo) {
    const categoriaAtiva = document.querySelector('.filter-btn.active').dataset.category;
    let produtosFiltrados = produtos;
    
    if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtos.filter(produto => produto.categoria === categoriaAtiva);
    }
    
    if (termo) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.nome.toLowerCase().includes(termo) ||
            produto.descricao.toLowerCase().includes(termo)
        );
    }
    
    renderizarProdutos(produtosFiltrados);
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    atualizarContadorCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
}

// Abrir carrinho
function abrirCarrinho() {
    console.log('Tentando abrir carrinho...');
    const modal = document.getElementById('cart-modal');
    if (modal) {
        renderizarCarrinho();
        
        // Forçar exibição do modal
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = '9999';
        modal.classList.add('show');
        
        // Garantir que o modal-content também seja visível
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.display = 'block';
            modalContent.style.visibility = 'visible';
            modalContent.style.opacity = '1';
        }
        
        // Event listeners já configurados via onclick direto no HTML
        
        console.log('Carrinho aberto com sucesso!');
        console.log('Modal display:', modal.style.display);
        console.log('Modal visibility:', modal.style.visibility);
    } else {
        console.error('Modal do carrinho não encontrado!');
    }
}

// Renderizar itens do carrinho
function renderizarCarrinho() {
    cartItems.innerHTML = '';
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6c757d;">Carrinho vazio</p>';
        cartTotal.textContent = '0,00';
        return;
    }
    
    carrinho.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <p>€${item.preco.toFixed(2)} cada</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease-btn" onclick="diminuirQuantidade(${index})">-</button>
                <span class="quantity-display">${item.quantidade}</span>
                <button class="quantity-btn increase-btn" onclick="aumentarQuantidade(${index})">+</button>
                <button class="remove-item" onclick="removerItemPorIndex(${index})">Remover</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Calcular total
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Adicionar event listeners do carrinho usando event delegation
function adicionarEventListenersCarrinho() {
    // Usar event delegation no container cartItems
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            const btn = e.target;
            
            // Botão de aumentar
            if (btn.classList.contains('increase-btn')) {
                const index = parseInt(btn.dataset.index);
                if (carrinho[index]) {
                    carrinho[index].quantidade += 1;
                    atualizarContadorCarrinho();
                    renderizarCarrinho();
                }
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Botão de diminuir
            if (btn.classList.contains('decrease-btn')) {
                const index = parseInt(btn.dataset.index);
                if (carrinho[index]) {
                    carrinho[index].quantidade -= 1;
                    if (carrinho[index].quantidade <= 0) {
                        carrinho.splice(index, 1);
                    }
                    atualizarContadorCarrinho();
                    renderizarCarrinho();
                }
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Botão de remover
            if (btn.classList.contains('remove-item')) {
                const index = parseInt(btn.dataset.index);
                if (carrinho[index]) {
                    carrinho.splice(index, 1);
                    atualizarContadorCarrinho();
                    renderizarCarrinho();
                }
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
}

// Alterar quantidade de item (função antiga - mantida para compatibilidade)
function alterarQuantidade(produtoId, mudanca) {
    const item = carrinho.find(item => item.id === produtoId);
    
    if (item) {
        item.quantidade += mudanca;
        
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.id !== produtoId);
        }
        
        atualizarContadorCarrinho();
        renderizarCarrinho();
    }
}

// Remover item do carrinho
function removerItem(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarContadorCarrinho();
    renderizarCarrinho();
}


// Teste simples para finalizar compra
function testeFinalizarCompra() {
    alert('TESTE: Botão clicado!');
    console.log('TESTE: Função chamada!');
}

// Função de teste para adicionar produto ao carrinho
function testarCarrinho() {
    // Adicionar um produto de teste
    const produtoTeste = {
        id: 999,
        nome: "Produto Teste",
        preco: 14.99,
        quantidade: 1
    };
    
    carrinho.push(produtoTeste);
    atualizarContadorCarrinho();
    alert(`Produto teste adicionado! Carrinho tem ${carrinho.length} itens.`);
}

// Funções de teste ultra simples
function testarRemover() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio! Adicione produtos primeiro.');
        return;
    }
    
    console.log('Testando remoção do primeiro item...');
    removerItemPorIndex(0);
    alert(`Item removido! Carrinho tem ${carrinho.length} itens.`);
}

function testarLimpar() {
    console.log('Testando limpar carrinho...');
    limparCarrinho();
}

function testarFinalizar() {
    console.log('Testando finalizar compra...');
    finalizarCompra();
}

// Funções ultra simples para os botões do carrinho
function aumentarQuantidade(index) {
    if (carrinho[index]) {
        carrinho[index].quantidade += 1;
        atualizarContadorCarrinho();
        renderizarCarrinho();
    }
}

function diminuirQuantidade(index) {
    if (carrinho[index]) {
        carrinho[index].quantidade -= 1;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        atualizarContadorCarrinho();
        renderizarCarrinho();
    }
}

function removerItemPorIndex(index) {
    if (carrinho[index]) {
        carrinho.splice(index, 1);
        atualizarContadorCarrinho();
        renderizarCarrinho();
    }
}

// Limpar carrinho - versão ultra simples
function limparCarrinho() {
    if (carrinho.length === 0) {
        alert('Carrinho já está vazio!');
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        carrinho = [];
        atualizarContadorCarrinho();
        renderizarCarrinho();
        alert('Carrinho limpo com sucesso!');
    }
}

// Finalizar compra - versão ultra simples
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio! Adicione produtos antes de finalizar.');
        return;
    }
    
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    let resumo = "🛍️ PEDIDO - Beleza & Fragrâncias\n\n";
    carrinho.forEach(item => {
        resumo += `• ${item.nome} (${item.quantidade}x) - €${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    resumo += `\n💰 TOTAL: €${total.toFixed(2)}\n\n`;
    resumo += "📱 Entre em contato via WhatsApp para finalizar seu pedido!";
    
    const confirmacao = `PEDIDO FINALIZADO!\n\n${resumo}\n\nDeseja abrir o WhatsApp para enviar este pedido?`;
    
    if (confirm(confirmacao)) {
        const numeroWhatsApp = "5511999999999";
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(resumo)}`;
        window.open(url, '_blank');
        
        carrinho = [];
        atualizarContadorCarrinho();
        fecharModais();
        
        alert('✅ Pedido enviado para WhatsApp! Obrigado pela compra!');
    }
}


// Mostrar checkout de forma simples
function mostrarCheckout(resumoPedido, total) {
    console.log('Mostrando checkout...');
    
    // Fechar modal do carrinho
    fecharModais();
    
    // Criar HTML do checkout
    const checkoutHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            ">
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: #333;">💳 Finalizar Pedido</h2>
                    <button onclick="fecharCheckout()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                    ">&times;</button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #333;">📋 Resumo do Pedido</h3>
                        ${carrinho.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                                <span>${item.nome} (${item.quantidade}x)</span>
                                <span style="font-weight: bold; color: #28a745;">€${(item.preco * item.quantidade).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div style="text-align: center; padding: 10px; background: #e9ecef; border-radius: 8px; margin-top: 10px;">
                            <strong style="font-size: 18px;">Total: €${total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #333; margin-bottom: 15px;">💳 Formas de Pagamento</h3>
                        
                        <div style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">📱 WhatsApp</h4>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Entre em contato conosco via WhatsApp para finalizar seu pedido:</p>
                            <button onclick="abrirWhatsApp()" style="
                                background: #25d366;
                                color: white;
                                border: none;
                                padding: 12px 20px;
                                border-radius: 25px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 8px;
                            ">
                                📱 Enviar Pedido via WhatsApp
                            </button>
                        </div>
                        
                        <div style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">📱 PIX / MBWay</h4>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Escaneie o QR Code abaixo para pagamento instantâneo:</p>
                            <div style="text-align: center; padding: 20px; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 10px;">
                                <div style="font-size: 48px; color: #6c757d; margin-bottom: 10px;">📱</div>
                                <p style="margin: 0; font-weight: 600; color: #333;">QR Code PIX/MBWay</p>
                                <small style="color: #28a745; font-weight: 600;">Valor: €${total.toFixed(2)}</small>
                            </div>
                        </div>
                        
                        <div style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">🏦 Transferência Bancária</h4>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px;">
                                <p style="margin: 5px 0;"><strong>Banco:</strong> [Seu Banco]</p>
                                <p style="margin: 5px 0;"><strong>IBAN:</strong> [Seu IBAN]</p>
                                <p style="margin: 5px 0;"><strong>Referência:</strong> Pedido #${Date.now()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                    <button onclick="fecharCheckout()" style="
                        flex: 1;
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Continuar Comprando</button>
                    <button onclick="confirmarPedido()" style="
                        flex: 1;
                        background: #ff6b9d;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Confirmar Pedido</button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar ao body
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    
    // Armazenar dados do pedido
    window.pedidoAtual = {
        resumo: resumoPedido,
        total: total,
        itens: [...carrinho]
    };
    
    console.log('Checkout exibido com sucesso!');
}

// Abrir WhatsApp com pedido
function abrirWhatsApp() {
    console.log('Abrindo WhatsApp...');
    const numeroWhatsApp = "5511999999999"; // Substitua pelo seu número
    const mensagem = window.pedidoAtual.resumo;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    console.log('URL WhatsApp:', url);
    window.open(url, '_blank');
}

// Fechar checkout
function fecharCheckout() {
    console.log('Fechando checkout...');
    const checkoutModal = document.querySelector('[style*="position: fixed"][style*="z-index: 10000"]');
    if (checkoutModal) {
        checkoutModal.remove();
        console.log('Checkout fechado!');
    }
}

// Confirmar pedido
function confirmarPedido() {
    console.log('Confirmando pedido...');
    alert('Pedido confirmado! Entre em contato via WhatsApp para finalizar o pagamento.');
    carrinho = [];
    atualizarContadorCarrinho();
    fecharCheckout();
}

// Abrir página de checkout com WhatsApp e QR Code

// Abrir detalhes do produto
function abrirDetalhesProduto(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    produtoAtual = produto;
    
    document.getElementById('product-modal-title').textContent = produto.nome;
    document.getElementById('product-modal-image').src = '';
    document.getElementById('product-modal-image').alt = produto.nome;
    document.getElementById('product-modal-description').textContent = produto.descricao;
    document.getElementById('product-modal-price').textContent = `€${produto.preco.toFixed(2)}`;
    document.getElementById('product-quantity').value = 1;
    
    // Configurar evento do botão adicionar ao carrinho
    document.getElementById('add-to-cart-modal').onclick = function() {
        const quantidade = parseInt(document.getElementById('product-quantity').value);
        for (let i = 0; i < quantidade; i++) {
            adicionarAoCarrinho(produto.id);
        }
        fecharModais();
    };
    
    productModal.style.display = 'block';
}

// Fechar modais
function fecharModais() {
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    const quantityModal = document.getElementById('quantity-modal');
    
    if (cartModal) {
        cartModal.style.display = 'none';
        cartModal.classList.remove('show');
    }
    if (productModal) {
        productModal.style.display = 'none';
        productModal.classList.remove('show');
    }
    if (quantityModal) {
        quantityModal.style.display = 'none';
        quantityModal.classList.remove('show');
    }
}

// Fechar modal (função para o X)
function fecharModal() {
    console.log('fecharModal chamado - fechando modais');
    fecharModais();
}

// Configurar fechamento de modais ao clicar fora
function configurarFechamentoModais() {
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    
    // Fechar modal do carrinho ao clicar fora
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                console.log('Clicou fora do modal do carrinho - fechando');
                fecharModais();
            }
        });
    }
    
    // Fechar modal do produto ao clicar fora
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                console.log('Clicou fora do modal do produto - fechando');
                fecharModais();
            }
        });
    }
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Variáveis para o modal de quantidade
let produtoSelecionado = null;

// Comprar via WhatsApp - agora abre modal de quantidade
function comprarViaWhatsApp(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    produtoSelecionado = produto;
    
    // Preencher informações do produto no modal
    document.getElementById('quantity-product-name').textContent = produto.nome;
    document.getElementById('quantity-product-price').textContent = `€${produto.preco.toFixed(2)}`;
    document.getElementById('quantity-input').value = 1;
    atualizarTotal();
    
    // Abrir modal de quantidade
    const modal = document.getElementById('quantity-modal');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '9999';
    modal.classList.add('show');
}

// Aumentar quantidade
function increaseQuantity() {
    const input = document.getElementById('quantity-input');
    const valorAtual = parseInt(input.value);
    input.value = valorAtual + 1;
    atualizarTotal();
}

// Diminuir quantidade
function decreaseQuantity() {
    const input = document.getElementById('quantity-input');
    const valorAtual = parseInt(input.value);
    if (valorAtual > 1) {
        input.value = valorAtual - 1;
        atualizarTotal();
    }
}

// Atualizar total
function atualizarTotal() {
    if (!produtoSelecionado) return;
    
    const quantidade = parseInt(document.getElementById('quantity-input').value);
    const total = produtoSelecionado.preco * quantidade;
    document.getElementById('total-price-display').textContent = `€${total.toFixed(2)}`;
}

// Enviar para WhatsApp
function enviarParaWhatsApp() {
    if (!produtoSelecionado) {
        alert('Erro: Produto não selecionado');
        return;
    }
    
    const quantidadeInput = document.getElementById('quantity-input');
    if (!quantidadeInput) {
        alert('Erro: Campo de quantidade não encontrado');
        return;
    }
    
    const quantidade = parseInt(quantidadeInput.value);
    if (isNaN(quantidade) || quantidade < 1) {
        alert('Por favor, insira uma quantidade válida');
        return;
    }
    
    const total = produtoSelecionado.preco * quantidade;
    
    // Criar mensagem para WhatsApp
    const mensagem = `Olá! Gostaria de comprar:

${produtoSelecionado.nome}
Preço unitário: €${produtoSelecionado.preco.toFixed(2)}
Quantidade: ${quantidade}
Total: €${total.toFixed(2)}

Podem me ajudar?`;
    
    // Abrir WhatsApp
    const numeroWhatsApp = "447456777339";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
    
    // Fechar modal
    fecharModais();
}


// Verificar carregamento das imagens
function verificarImagens() {
    const imagens = document.querySelectorAll('.product-image img');
    imagens.forEach((img, index) => {
        img.addEventListener('load', function() {
            console.log(`Imagem ${index + 1} carregada com sucesso:`, this.src);
            this.style.animation = 'none';
            this.style.background = 'none';
        });
        
        img.addEventListener('error', function() {
            console.log(`Erro ao carregar imagem ${index + 1}:`, this.src);
            // O fallback já está configurado no HTML
        });
    });
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
