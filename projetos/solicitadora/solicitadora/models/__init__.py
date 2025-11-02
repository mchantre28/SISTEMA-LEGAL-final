from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importar todos os modelos
from .cliente import Cliente
from .processo import Processo
from .financeiro import Financeiro
from .documento import Documento
from .agenda import Agenda
from .solicitadora import Solicitadora

__all__ = ['db', 'Cliente', 'Processo', 'Financeiro', 'Documento', 'Agenda', 'Solicitadora']
