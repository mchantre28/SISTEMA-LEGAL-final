from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Documento(db.Model):
    __tablename__ = 'documentos'
    
    id_documento = db.Column(db.Integer, primary_key=True)
    id_processo = db.Column(db.Integer, db.ForeignKey('processos.id_processo'), nullable=False)
    nome_documento = db.Column(db.String(255))
    tipo_documento = db.Column(db.String(100))
    caminho_arquivo = db.Column(db.String(500))
    data_upload = db.Column(db.Date, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Documento {self.nome_documento}>'
    
    def to_dict(self):
        return {
            'id_documento': self.id_documento,
            'id_processo': self.id_processo,
            'nome_documento': self.nome_documento,
            'tipo_documento': self.tipo_documento,
            'caminho_arquivo': self.caminho_arquivo,
            'data_upload': self.data_upload.isoformat() if self.data_upload else None
        }
