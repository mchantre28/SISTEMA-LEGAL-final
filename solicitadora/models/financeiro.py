from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Financeiro(db.Model):
    __tablename__ = 'financeiro'
    
    id_financeiro = db.Column(db.Integer, primary_key=True)
    id_processo = db.Column(db.Integer, db.ForeignKey('processos.id_processo'), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # Honorário, Despesa, Pagamento
    descricao = db.Column(db.Text)
    valor = db.Column(db.Float, nullable=False)
    data_registo = db.Column(db.Date, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Pendente')  # Pendente, Pago
    
    def __repr__(self):
        return f'<Financeiro {self.tipo}: {self.valor}>'
    
    def to_dict(self):
        return {
            'id_financeiro': self.id_financeiro,
            'id_processo': self.id_processo,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'valor': self.valor,
            'data_registo': self.data_registo.isoformat() if self.data_registo else None,
            'status': self.status
        }