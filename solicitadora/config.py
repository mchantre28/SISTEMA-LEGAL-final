import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class Config:
    """Configurações da aplicação"""
    
    # Configurações do Flask
    SECRET_KEY = os.getenv('JWT_SECRET', 'sua_chave_secreta_aqui')
    
    # Configurações do banco de dados
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'sua_chave_secreta_aqui')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 horas
    
    # Configurações de desenvolvimento
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    ENV = os.getenv('FLASK_ENV', 'development')
