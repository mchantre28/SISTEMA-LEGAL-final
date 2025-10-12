#!/usr/bin/env python3
"""
Servidor HTTP simples para servir o sistema legal
Acesso via rede local em qualquer dispositivo
"""

import http.server
import socketserver
import webbrowser
import socket
import os

# Configurações
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Adicionar headers para CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def get_local_ip():
    """Obter IP local da máquina"""
    try:
        # Conectar a um endereço externo para descobrir IP local
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def main():
    print("🚀 Iniciando servidor do Sistema Legal...")
    print(f"📁 Diretório: {DIRECTORY}")
    
    # Obter IP local
    local_ip = get_local_ip()
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"\n✅ Servidor iniciado com sucesso!")
            print(f"🌐 Acesso local: http://localhost:{PORT}")
            print(f"📱 Acesso na rede: http://{local_ip}:{PORT}")
            print(f"\n📋 Para acessar de outros dispositivos:")
            print(f"   1. Conecte-se à mesma rede WiFi")
            print(f"   2. Abra o navegador no dispositivo")
            print(f"   3. Digite: http://{local_ip}:{PORT}")
            print(f"\n⏹️  Pressione Ctrl+C para parar o servidor")
            
            # Abrir automaticamente no navegador
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n⏹️  Servidor parado pelo usuário")
    except OSError as e:
        if e.errno == 10048:  # Porta já em uso
            print(f"❌ Erro: Porta {PORT} já está em uso")
            print(f"💡 Tente fechar outros programas ou usar uma porta diferente")
        else:
            print(f"❌ Erro: {e}")

if __name__ == "__main__":
    main()
