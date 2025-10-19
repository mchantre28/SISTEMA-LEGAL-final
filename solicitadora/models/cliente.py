from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id_cliente = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    nif = db.Column(db.String(15), unique=True)
    morada = db.Column(db.Text)
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(255))
    data_registo = db.Column(db.Date, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Cliente {self.nome}>'
    
    def to_dict(self):
        return {
            'id_cliente': self.id_cliente,
            'nome': self.nome,
            'nif': self.nif,
            'morada': self.morada,
            'telefone': self.telefone,
            'email': self.email,
            'data_registo': self.data_registo.isoformat() if self.data_registo else None
        }