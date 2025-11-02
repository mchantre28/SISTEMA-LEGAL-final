from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Cliente, Processo, Financeiro, Agenda, Documento, Solicitadora
from views import dashboard_bp, agenda_bp
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Carregar variáveis de ambiente
# load_dotenv()  # Comentado temporariamente

app = Flask(__name__)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'sua_chave_secreta_aqui')

# Inicializar extensões
db.init_app(app)
CORS(app)

# Registrar blueprints
app.register_blueprint(dashboard_bp)
app.register_blueprint(agenda_bp)

# Configuração JWT
JWT_SECRET = os.getenv('JWT_SECRET', 'sua_chave_secreta_aqui')

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token de acesso requerido'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(*args, **kwargs)
    return decorated

# ========================================
# ROTAS DE AUTENTICAÇÃO
# ========================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login do usuário"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Verificação simples (em produção, usar hash de senha)
        if username == 'admin' and password == 'password':
            token = jwt.encode({
                'user': username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                'token': token,
                'user': username,
                'message': 'Login realizado com sucesso'
            })
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# ROTAS CRUD - CLIENTES
# ========================================

@app.route('/api/clientes', methods=['GET'])
@token_required
def listar_clientes():
    """Listar todos os clientes"""
    try:
        clientes = Cliente.query.all()
        return jsonify([cliente.to_dict() for cliente in clientes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes', methods=['POST'])
@token_required
def criar_cliente():
    """Criar novo cliente"""
    try:
        data = request.get_json()
        
        cliente = Cliente(
            nome=data.get('nome'),
            nif=data.get('nif'),
            morada=data.get('morada'),
            telefone=data.get('telefone'),
            email=data.get('email')
        )
        
        db.session.add(cliente)
        db.session.commit()
        
        return jsonify(cliente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/<int:id_cliente>', methods=['GET'])
@token_required
def obter_cliente(id_cliente):
    """Obter cliente específico"""
    try:
        cliente = Cliente.query.get_or_404(id_cliente)
        return jsonify(cliente.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/<int:id_cliente>', methods=['PUT'])
@token_required
def atualizar_cliente(id_cliente):
    """Atualizar cliente"""
    try:
        cliente = Cliente.query.get_or_404(id_cliente)
        data = request.get_json()
        
        cliente.nome = data.get('nome', cliente.nome)
        cliente.nif = data.get('nif', cliente.nif)
        cliente.morada = data.get('morada', cliente.morada)
        cliente.telefone = data.get('telefone', cliente.telefone)
        cliente.email = data.get('email', cliente.email)
        
        db.session.commit()
        return jsonify(cliente.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes/<int:id_cliente>', methods=['DELETE'])
@token_required
def deletar_cliente(id_cliente):
    """Deletar cliente"""
    try:
        cliente = Cliente.query.get_or_404(id_cliente)
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'message': 'Cliente deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ========================================
# ROTAS CRUD - PROCESSOS
# ========================================

@app.route('/api/processos', methods=['GET'])
@token_required
def listar_processos():
    """Listar todos os processos"""
    try:
        processos = Processo.query.all()
        return jsonify([processo.to_dict() for processo in processos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/processos', methods=['POST'])
@token_required
def criar_processo():
    """Criar novo processo"""
    try:
        data = request.get_json()
        
        processo = Processo(
            id_cliente=data.get('id_cliente'),
            numero_processo=data.get('numero_processo'),
            tipo_processo=data.get('tipo_processo'),
            descricao=data.get('descricao'),
            estado=data.get('estado', 'Em curso')
        )
        
        db.session.add(processo)
        db.session.commit()
        
        return jsonify(processo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ========================================
# ROTAS CRUD - FINANCEIRO
# ========================================

@app.route('/api/financeiro', methods=['GET'])
@token_required
def listar_financeiro():
    """Listar todos os registros financeiros"""
    try:
        financeiro = Financeiro.query.all()
        return jsonify([f.to_dict() for f in financeiro])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/financeiro', methods=['POST'])
@token_required
def criar_financeiro():
    """Criar novo registro financeiro"""
    try:
        data = request.get_json()
        
        financeiro = Financeiro(
            id_processo=data.get('id_processo'),
            tipo=data.get('tipo'),
            descricao=data.get('descricao'),
            valor=data.get('valor'),
            status=data.get('status', 'Pendente')
        )
        
        db.session.add(financeiro)
        db.session.commit()
        
        return jsonify(financeiro.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ========================================
# ROTA PRINCIPAL
# ========================================

@app.route('/')
def index():
    """Página principal"""
    return jsonify({
        'message': 'Sistema de Gestão de Solicitadora',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/login',
            'clientes': '/api/clientes',
            'processos': '/api/processos',
            'financeiro': '/api/financeiro',
            'agenda': '/api/agenda',
            'relatorios': '/api/relatorios/*'
        }
    })

# ========================================
# INICIALIZAÇÃO DO BANCO DE DADOS
# ========================================

def init_database():
    """Inicializar banco de dados com dados de exemplo"""
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        
        # Verificar se já existem dados
        if Cliente.query.count() == 0:
            # Inserir dados de exemplo
            clientes_exemplo = [
                Cliente(nome='João Manuel Ferreira', nif='123456789', 
                       email='joao.ferreira@email.com', telefone='+351 911 222 333',
                       morada='Rua das Flores, 123, Lisboa'),
                Cliente(nome='Ana Cristina Oliveira', nif='987654321',
                       email='ana.oliveira@email.com', telefone='+351 922 333 444',
                       morada='Avenida da Liberdade, 456, Porto'),
                Cliente(nome='Empresa ABC, Lda', nif='123456780',
                       email='geral@empresaabc.pt', telefone='+351 213 456 789',
                       morada='Praça do Comércio, 789, Lisboa')
            ]
            
            for cliente in clientes_exemplo:
                db.session.add(cliente)
            
            db.session.commit()
            
            # Inserir processos de exemplo
            processos_exemplo = [
                Processo(id_cliente=1, numero_processo='PROC-2024-001', 
                        tipo_processo='Civil', descricao='Ação de Divórcio', estado='Em curso'),
                Processo(id_cliente=2, numero_processo='PROC-2024-002',
                        tipo_processo='Trabalho', descricao='Contrato de Trabalho', estado='Em curso'),
                Processo(id_cliente=3, numero_processo='PROC-2024-003',
                        tipo_processo='Comercial', descricao='Contrato Comercial', estado='Concluído',
                        data_conclusao=datetime.now().date())
            ]
            
            for processo in processos_exemplo:
                db.session.add(processo)
            
            db.session.commit()
            
            # Inserir dados financeiros de exemplo
            financeiro_exemplo = [
                Financeiro(id_processo=1, tipo='Honorário', descricao='Honorários iniciais - Divórcio',
                          valor=1000, status='Pago'),
                Financeiro(id_processo=1, tipo='Despesa', descricao='Deslocação ao Tribunal',
                          valor=25.50, status='Pago'),
                Financeiro(id_processo=1, tipo='Honorário', descricao='Honorários por hora - Consultas',
                          valor=375, status='Pendente'),
                Financeiro(id_processo=2, tipo='Honorário', descricao='Honorários - Revisão Contrato',
                          valor=500, status='Pendente')
            ]
            
            for f in financeiro_exemplo:
                db.session.add(f)
            
            db.session.commit()
            
            print("✅ Base de dados inicializada com dados de exemplo!")

if __name__ == '__main__':
    init_database()
    print("🚀 Sistema de Solicitadora rodando na porta 5000")
    print("📱 Acesse: http://localhost:5000")
    print("🔗 API: http://localhost:5000/api")
    print("💾 Base de dados: SQLite (database.db)")
    app.run(debug=True, host='0.0.0.0', port=5000)
