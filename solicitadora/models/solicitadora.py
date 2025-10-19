from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Solicitadora(db.Model):
    __tablename__ = 'solicitadora'
    
    id_solicitadora = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255))
    nif = db.Column(db.String(20))
    email = db.Column(db.String(255))
    telefone = db.Column(db.String(20))
    morada = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Solicitadora {self.nome}>'
    
    def to_dict(self):
        return {
            'id_solicitadora': self.id_solicitadora,
            'nome': self.nome,
            'nif': self.nif,
            'email': self.email,
            'telefone': self.telefone,
            'morada': self.morada
        }
