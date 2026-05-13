const API_BASE_URL = 'http://localhost:3000/api';

// Selectores
const fileInput = document.getElementById('file-input');
const fileLabel = document.querySelector('.file-label');
const fileInfo = document.getElementById('file-info');
const selectedFilename = document.getElementById('selected-filename');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const statusMessage = document.getElementById('status-message');
const imageGallery = document.getElementById('image-gallery');
const refreshBtn = document.getElementById('refresh-btn');

// Estado
let selectedFile = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});

// Eventos de selección de archivo
fileLabel.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
});

// Drag and Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileLabel.parentElement.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileLabel.parentElement.addEventListener(eventName, () => {
        fileLabel.parentElement.classList.add('highlight');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileLabel.parentElement.addEventListener(eventName, () => {
        fileLabel.parentElement.classList.remove('highlight');
    }, false);
});

fileLabel.parentElement.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) {
        handleFileSelection(file);
    }
});

function handleFileSelection(file) {
    // Validaciones frontend
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        showStatus('Tipo de archivo no permitido. Solo JPG, PNG y WEBP.', 'error');
        return;
    }

    if (file.size > maxSize) {
        showStatus('El archivo es demasiado grande (Máx 5MB).', 'error');
        return;
    }

    selectedFile = file;
    selectedFilename.textContent = file.name;
    fileInfo.classList.remove('hidden');
    statusMessage.classList.remove('success', 'error');
    statusMessage.textContent = '';
}

// Subida a S3
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    try {
        setLoading(true);
        showStatus('Obteniendo autorización de subida...', '');

        // 1. Obtener Presigned URL del Backend
        const response = await fetch(`${API_BASE_URL}/upload-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: selectedFile.name,
                contentType: selectedFile.type,
                sizeBytes: selectedFile.size
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Error al obtener URL de subida');
        }

        const { uploadUrl, key } = await response.json();

        // 2. Subir directamente a S3
        showStatus('Subiendo imagen a Amazon S3...', '');
        progressContainer.classList.remove('hidden');

        await uploadToS3(uploadUrl, selectedFile);

        showStatus('¡Imagen subida con éxito!', 'success');
        resetUpload();
        loadGallery();

    } catch (error) {
        console.error(error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
});

function uploadToS3(url, file) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', file.type);
        // El cifrado AES256 se solicitó en el backend, el SDK v3 lo incluye en el comando
        // pero si el bucket lo requiere, se puede añadir el header aquí:
        // xhr.setRequestHeader('x-amz-server-side-encryption', 'AES256');

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressFill.style.width = `${percent}%`;
                progressText.textContent = `${percent}%`;
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) resolve();
            else reject(new Error('Error al subir archivo a S3'));
        };

        xhr.onerror = () => reject(new Error('Error de red al subir a S3'));
        xhr.send(file);
    });
}

// Galería
async function loadGallery() {
    try {
        const response = await fetch(`${API_BASE_URL}/images`);
        if (!response.ok) throw new Error('Error al cargar la galería');
        
        const images = await response.json();
        renderGallery(images);
    } catch (error) {
        imageGallery.innerHTML = `<p class="error-text">No se pudo cargar la galería: ${error.message}</p>`;
    }
}

function renderGallery(images) {
    if (images.length === 0) {
        imageGallery.innerHTML = '<p class="empty-text">No hay imágenes en el bucket.</p>';
        return;
    }

    imageGallery.innerHTML = images.map(img => `
        <div class="image-card glass">
            <img src="${img.url}" alt="${img.key}" loading="lazy">
            <div class="image-overlay">
                <div class="image-info">
                    <p title="${img.key}">${img.key.split('/').pop()}</p>
                    <span>${(img.size / 1024).toFixed(1)} KB</span>
                </div>
                <button class="delete-btn" onclick="deleteImage('${img.key}')" title="Eliminar">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

window.deleteImage = async (key) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/images/${encodeURIComponent(key)}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('No se pudo eliminar la imagen');

        showStatus('Imagen eliminada correctamente', 'success');
        loadGallery();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

refreshBtn.addEventListener('click', loadGallery);

// Helpers
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
}

function setLoading(isLoading) {
    uploadBtn.disabled = isLoading;
    if (isLoading) {
        uploadBtn.textContent = 'Procesando...';
    } else {
        uploadBtn.textContent = 'Subir a S3';
    }
}

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    setTimeout(() => {
        progressContainer.classList.add('hidden');
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
    }, 3000);
}
