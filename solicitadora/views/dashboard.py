from flask import Blueprint, jsonify, request
from models import db, Cliente, Processo, Financeiro, Agenda
from functools import wraps
import jwt
import os

dashboard_bp = Blueprint('dashboard', __name__)

# Configuração JWT
JWT_SECRET = os.getenv('JWT_SECRET', 'sua_chave_secreta_aqui')

def token_required(f):
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

@dashboard_bp.route('/api/relatorios/processos-ativos', methods=['GET'])
@token_required
def processos_ativos():
    """Listar todos os processos ativos"""
    try:
        processos = Processo.query.filter_by(estado='Em curso').all()
        return jsonify([p.to_dict() for p in processos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/total-financeiro', methods=['GET'])
@token_required
def total_financeiro():
    """Mostrar total financeiro por processo"""
    try:
        # Query simples para evitar problemas de importação
        resultados = db.session.execute("""
            SELECT p.numero_processo, 
                   SUM(f.valor) as total, 
                   SUM(CASE WHEN f.status='Pago' THEN f.valor ELSE 0 END) as total_pago,
                   SUM(CASE WHEN f.status='Pendente' THEN f.valor ELSE 0 END) as total_pendente
            FROM financeiro f
            JOIN processos p ON f.id_processo = p.id_processo
            GROUP BY p.numero_processo
            ORDER BY total DESC
        """).fetchall()
        
        return jsonify([{
            'numero_processo': r[0],
            'total': float(r[1] or 0),
            'total_pago': float(r[2] or 0),
            'total_pendente': float(r[3] or 0)
        } for r in resultados])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/proximos-compromissos', methods=['GET'])
@token_required
def proximos_compromissos():
    """Próximos compromissos"""
    try:
        compromissos = Agenda.query.filter(Agenda.data_evento >= datetime.now()).order_by(Agenda.data_evento.asc()).all()
        return jsonify([c.to_dict() for c in compromissos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/processos-completos', methods=['GET'])
@token_required
def processos_completos():
    """Relatório completo de processos"""
    try:
        processos = Processo.query.all()
        return jsonify([p.to_dict() for p in processos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/financeiro-detalhado', methods=['GET'])
@token_required
def financeiro_detalhado():
    """Relatório financeiro detalhado"""
    try:
        financeiro = Financeiro.query.all()
        return jsonify([f.to_dict() for f in financeiro])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/clientes-ativos', methods=['GET'])
@token_required
def clientes_ativos():
    """Clientes ativos e número de processos"""
    try:
        clientes = Cliente.query.all()
        return jsonify([c.to_dict() for c in clientes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/fluxo-caixa-mensal', methods=['GET'])
@token_required
def fluxo_caixa_mensal():
    """Fluxo de caixa mensal (honorários e despesas)"""
    try:
        # Query SQL direta para evitar problemas
        resultados = db.session.execute("""
            SELECT 
                strftime('%Y-%m', f.data_registo) as mes,
                SUM(CASE WHEN f.tipo = 'Honorário' THEN f.valor ELSE 0 END) as total_honorarios,
                SUM(CASE WHEN f.tipo = 'Despesa' THEN f.valor ELSE 0 END) as total_despesas,
                SUM(CASE WHEN f.tipo = 'Pagamento' THEN f.valor ELSE 0 END) as total_pagamentos
            FROM financeiro f
            GROUP BY strftime('%Y-%m', f.data_registo)
            ORDER BY mes DESC
        """).fetchall()
        
        return jsonify([{
            'mes': r[0],
            'total_honorarios': float(r[1] or 0),
            'total_despesas': float(r[2] or 0),
            'total_pagamentos': float(r[3] or 0),
            'saldo_mensal': float((r[1] or 0) - (r[2] or 0))
        } for r in resultados])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/processos-concluidos-mes', methods=['GET'])
@token_required
def processos_concluidos_mes():
    """Processos concluídos por mês"""
    try:
        processos = Processo.query.filter_by(estado='Concluído').all()
        return jsonify([p.to_dict() for p in processos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/alertas-prazos', methods=['GET'])
@token_required
def alertas_prazos():
    """Alertas de prazos (eventos próximos)"""
    try:
        from datetime import timedelta
        data_limite = datetime.now() + timedelta(days=30)
        alertas = Agenda.query.filter(
            Agenda.data_evento >= datetime.now(),
            Agenda.data_evento <= data_limite
        ).order_by(Agenda.data_evento.asc()).all()
        return jsonify([a.to_dict() for a in alertas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/relatorios/pagamentos-pendentes', methods=['GET'])
@token_required
def pagamentos_pendentes():
    """Pagamentos pendentes"""
    try:
        pagamentos = Financeiro.query.filter_by(status='Pendente').all()
        return jsonify([p.to_dict() for p in pagamentos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500