from flask import Blueprint, jsonify, request
from models import db, Agenda, Processo, Cliente
from functools import wraps
import jwt
import os
from datetime import datetime

agenda_bp = Blueprint('agenda', __name__)

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

@agenda_bp.route('/api/agenda', methods=['GET'])
@token_required
def listar_agenda():
    """Listar todos os eventos da agenda"""
    try:
        eventos = Agenda.query.order_by(Agenda.data_evento.asc()).all()
        return jsonify([evento.to_dict() for evento in eventos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda', methods=['POST'])
@token_required
def criar_evento():
    """Criar novo evento na agenda"""
    try:
        data = request.get_json()
        
        evento = Agenda(
            id_processo=data.get('id_processo'),
            titulo=data.get('titulo'),
            data_evento=datetime.fromisoformat(data.get('data_evento')) if data.get('data_evento') else None,
            observacoes=data.get('observacoes')
        )
        
        db.session.add(evento)
        db.session.commit()
        
        return jsonify(evento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda/<int:id_evento>', methods=['GET'])
@token_required
def obter_evento(id_evento):
    """Obter evento específico"""
    try:
        evento = Agenda.query.get_or_404(id_evento)
        return jsonify(evento.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda/<int:id_evento>', methods=['PUT'])
@token_required
def atualizar_evento(id_evento):
    """Atualizar evento"""
    try:
        evento = Agenda.query.get_or_404(id_evento)
        data = request.get_json()
        
        evento.id_processo = data.get('id_processo', evento.id_processo)
        evento.titulo = data.get('titulo', evento.titulo)
        evento.data_evento = datetime.fromisoformat(data.get('data_evento')) if data.get('data_evento') else evento.data_evento
        evento.observacoes = data.get('observacoes', evento.observacoes)
        
        db.session.commit()
        return jsonify(evento.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda/<int:id_evento>', methods=['DELETE'])
@token_required
def deletar_evento(id_evento):
    """Deletar evento"""
    try:
        evento = Agenda.query.get_or_404(id_evento)
        db.session.delete(evento)
        db.session.commit()
        return jsonify({'message': 'Evento deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda/hoje', methods=['GET'])
@token_required
def eventos_hoje():
    """Eventos de hoje"""
    try:
        hoje = datetime.now().date()
        eventos = Agenda.query.filter(
            db.func.date(Agenda.data_evento) == hoje
        ).order_by(Agenda.data_evento.asc()).all()
        
        return jsonify([evento.to_dict() for evento in eventos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@agenda_bp.route('/api/agenda/semana', methods=['GET'])
@token_required
def eventos_semana():
    """Eventos da semana"""
    try:
        from datetime import timedelta
        
        hoje = datetime.now().date()
        fim_semana = hoje + timedelta(days=7)
        
        eventos = Agenda.query.filter(
            db.func.date(Agenda.data_evento) >= hoje,
            db.func.date(Agenda.data_evento) <= fim_semana
        ).order_by(Agenda.data_evento.asc()).all()
        
        return jsonify([evento.to_dict() for evento in eventos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
