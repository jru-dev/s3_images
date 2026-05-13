# S3 Image Manager - Clean Architecture (SOLID)

Aplicación Web Full Stack para la gestión de imágenes en Amazon S3, desarrollada bajo principios de Arquitectura Limpia y SOLID.

## 🚀 Características
- **Subida Segura:** Uso de Presigned URLs para evitar exponer credenciales en el cliente.
- **Arquitectura SOLID:** Separación estricta de responsabilidades (Controllers, Services, Validators, Interfaces).
- **Diseño Premium:** Interfaz moderna con Glassmorphism y CSS puro.
- **Validación Robusta:** Control de tipos (JPG, PNG, WEBP) y tamaño (5MB) tanto en Frontend como en Backend.
- **AWS SDK v3:** Implementación moderna del SDK de Amazon.

## 🛠️ Tecnologías
- **Backend:** Node.js, Express, AWS SDK v3.
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla).
- **Almacenamiento:** Amazon S3.

## 📐 Principios SOLID Aplicados
- **Single Responsibility (SRP):** Cada clase/módulo tiene una única razón para cambiar.
- **Open/Closed (OCP):** Validaciones y servicios de almacenamiento extensibles sin modificar el núcleo.
- **Liskov Substitution (LSP):** Servicios de almacenamiento intercambiables mediante interfaces.
- **Interface Segregation (ISP):** Interfaces delgadas para contratos de almacenamiento y validación.
- **Dependency Inversion (DIP):** Los controladores dependen de abstracciones, no de implementaciones concretas.

## ⚙️ Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/jru-dev/s3_images.git
cd s3_images/backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `backend/` basado en `.env.example`:
```env
PORT=3000
AWS_REGION=tu_region
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=tu-bucket
FRONTEND_URL=*
```

### 4. Configurar CORS en S3
En la consola de AWS S3, añade la siguiente configuración CORS a tu bucket:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### 5. Ejecutar
```bash
# Iniciar Backend
npm start

# Abrir Frontend
# Abre index.html en el navegador o usa Live Server.
```

## 📄 Licencia
Este proyecto es de uso académico y profesional.
