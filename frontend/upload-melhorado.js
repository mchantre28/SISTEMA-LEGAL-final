// Sistema de Upload Melhorado para Documentos
class UploadMelhorado {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        this.createUploadArea();
        this.bindEvents();
    }

    createUploadArea() {
        this.container.innerHTML = `
            <div class="upload-area" id="uploadArea">
                <div class="upload-content">
                    <div class="upload-icon">📁</div>
                    <h3>Arraste e solte os ficheiros aqui</h3>
                    <p>ou <span class="upload-link">clique para selecionar</span></p>
                    <p class="upload-info">Tipos permitidos: PDF, DOC, DOCX, JPG, PNG, GIF, TXT</p>
                    <p class="upload-info">Tamanho máximo: 10MB por ficheiro</p>
                </div>
                <input type="file" id="fileInput" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt" style="display: none;">
            </div>
            <div class="upload-progress" id="uploadProgress" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">0%</div>
            </div>
            <div class="uploaded-files" id="uploadedFiles"></div>
        `;

        // Adicionar estilos CSS
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .upload-area {
                border: 3px dashed #667eea;
                border-radius: 15px;
                padding: 40px;
                text-align: center;
                background: #f8f9ff;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }
            
            .upload-area:hover {
                border-color: #764ba2;
                background: #f0f2ff;
                transform: translateY(-2px);
            }
            
            .upload-area.dragover {
                border-color: #28a745;
                background: #d4edda;
                transform: scale(1.02);
            }
            
            .upload-content {
                pointer-events: none;
            }
            
            .upload-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .upload-content h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.3rem;
            }
            
            .upload-content p {
                margin: 5px 0;
                color: #666;
            }
            
            .upload-link {
                color: #667eea;
                text-decoration: underline;
                cursor: pointer;
                pointer-events: auto;
            }
            
            .upload-info {
                font-size: 0.9rem;
                color: #999;
            }
            
            .upload-progress {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                text-align: center;
                font-weight: 600;
                color: #333;
            }
            
            .uploaded-files {
                margin-top: 20px;
            }
            
            .file-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 10px;
                margin: 10px 0;
                transition: all 0.3s ease;
            }
            
            .file-item:hover {
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transform: translateY(-1px);
            }
            
            .file-icon {
                font-size: 2rem;
                margin-right: 15px;
            }
            
            .file-info {
                flex: 1;
            }
            
            .file-name {
                font-weight: 600;
                color: #333;
                margin: 0 0 5px 0;
            }
            
            .file-size {
                color: #666;
                font-size: 0.9rem;
                margin: 0;
            }
            
            .file-status {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .status-uploading {
                background: #fff3cd;
                color: #856404;
            }
            
            .status-success {
                background: #d4edda;
                color: #155724;
            }
            
            .status-error {
                background: #f8d7da;
                color: #721c24;
            }
            
            .file-actions {
                margin-left: 15px;
            }
            
            .btn-remove {
                background: #dc3545;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }
            
            .btn-remove:hover {
                background: #c82333;
            }
            
            .error-message {
                background: #f8d7da;
                color: #721c24;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                border-left: 4px solid #dc3545;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadLink = document.querySelector('.upload-link');

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // Click to select files
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadLink.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    handleFiles(files) {
        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            // Validar tamanho
            if (file.size > this.maxFileSize) {
                errors.push(`${file.name}: Ficheiro muito grande (máximo 10MB)`);
                return;
            }

            // Validar tipo
            if (!this.allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Tipo de ficheiro não permitido`);
                return;
            }

            validFiles.push(file);
        });

        // Mostrar erros se houver
        if (errors.length > 0) {
            this.showErrors(errors);
        }

        // Processar ficheiros válidos
        if (validFiles.length > 0) {
            this.uploadFiles(validFiles);
        }
    }

    showErrors(errors) {
        const errorHtml = errors.map(error => 
            `<div class="error-message">${error}</div>`
        ).join('');
        
        this.container.insertAdjacentHTML('beforeend', errorHtml);
        
        // Remover erros após 5 segundos
        setTimeout(() => {
            const errorMessages = this.container.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
        }, 5000);
    }

    uploadFiles(files) {
        const progressContainer = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressContainer.style.display = 'block';
        
        let uploadedCount = 0;
        const totalFiles = files.length;

        files.forEach((file, index) => {
            this.uploadSingleFile(file, (progress) => {
                const overallProgress = ((uploadedCount + progress) / totalFiles) * 100;
                progressFill.style.width = overallProgress + '%';
                progressText.textContent = Math.round(overallProgress) + '%';
            }, (success, error) => {
                uploadedCount++;
                
                if (success) {
                    this.addFileToList(file, 'success');
                } else {
                    this.addFileToList(file, 'error', error);
                }
                
                if (uploadedCount === totalFiles) {
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        progressFill.style.width = '0%';
                        progressText.textContent = '0%';
                    }, 1000);
                }
            });
        });
    }

    uploadSingleFile(file, onProgress, onComplete) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipo_documento', this.getFileType(file));
        formData.append('id_processo', this.getSelectedProcessId());

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                onComplete(true);
            } else {
                onComplete(false, xhr.responseText);
            }
        });

        xhr.addEventListener('error', () => {
            onComplete(false, 'Erro de rede');
        });

        xhr.open('POST', '/api/documentos/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        xhr.send(formData);
    }

    addFileToList(file, status, error = null) {
        const filesContainer = document.getElementById('uploadedFiles');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const icon = this.getFileIcon(file.type);
        const size = this.formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${size}</div>
            </div>
            <div class="file-status status-${status}">
                ${status === 'success' ? 'Carregado' : 'Erro'}
            </div>
            <div class="file-actions">
                <button class="btn-remove" onclick="this.parentElement.parentElement.remove()">Remover</button>
            </div>
        `;
        
        if (error) {
            fileItem.innerHTML += `<div class="error-message">${error}</div>`;
        }
        
        filesContainer.appendChild(fileItem);
    }

    getFileIcon(mimeType) {
        const icons = {
            'application/pdf': '📄',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'text/plain': '📄'
        };
        return icons[mimeType] || '📄';
    }

    getFileType(file) {
        const typeMap = {
            'application/pdf': 'PDF',
            'image/jpeg': 'Imagem',
            'image/png': 'Imagem',
            'image/gif': 'Imagem',
            'application/msword': 'Documento',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Documento',
            'text/plain': 'Texto'
        };
        return typeMap[file.type] || 'Outro';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getSelectedProcessId() {
        // Implementar lógica para obter o ID do processo selecionado
        return 1; // Valor padrão para demonstração
    }
}

// Inicializar o sistema de upload quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('uploadContainer')) {
        new UploadMelhorado('uploadContainer');
    }
});
