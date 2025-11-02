from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Processo(db.Model):
    __tablename__ = 'processos'
    
    id_processo = db.Column(db.Integer, primary_key=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey('clientes.id_cliente'), nullable=False)
    numero_processo = db.Column(db.String(50), unique=True, nullable=False)
    tipo_processo = db.Column(db.String(100))
    descricao = db.Column(db.Text)
    estado = db.Column(db.String(20), default='Em curso')
    data_abertura = db.Column(db.Date, default=datetime.utcnow)
    data_conclusao = db.Column(db.Date)
    
    def __repr__(self):
        return f'<Processo {self.numero_processo}>'
    
    def to_dict(self):
        return {
            'id_processo': self.id_processo,
            'id_cliente': self.id_cliente,
            'numero_processo': self.numero_processo,
            'tipo_processo': self.tipo_processo,
            'descricao': self.descricao,
            'estado': self.estado,
            'data_abertura': self.data_abertura.isoformat() if self.data_abertura else None,
            'data_conclusao': self.data_conclusao.isoformat() if self.data_conclusao else None
        }