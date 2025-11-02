from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Agenda(db.Model):
    __tablename__ = 'agenda'
    
    id_evento = db.Column(db.Integer, primary_key=True)
    id_processo = db.Column(db.Integer, db.ForeignKey('processos.id_processo'))
    titulo = db.Column(db.String(255), nullable=False)
    data_evento = db.Column(db.DateTime)
    observacoes = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Agenda {self.titulo}>'
    
    def to_dict(self):
        return {
            'id_evento': self.id_evento,
            'id_processo': self.id_processo,
            'titulo': self.titulo,
            'data_evento': self.data_evento.isoformat() if self.data_evento else None,
            'observacoes': self.observacoes
        }