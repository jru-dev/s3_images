const ValidatorInterface = require('../interfaces/validator.interface');

class ImageValidator extends ValidatorInterface {
  constructor() {
    super();
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    this.maxSize = 5 * 1024 * 1024; // 5 MB
  }

  validate(fileData) {
    const { contentType, sizeBytes } = fileData;

    if (!this.allowedTypes.includes(contentType)) {
      throw new Error(`Tipo de archivo no permitido: ${contentType}. Permitidos: ${this.allowedTypes.join(', ')}`);
    }

    if (sizeBytes > this.maxSize) {
      throw new Error(`El archivo excede el tamaño máximo de 5MB. Tamaño recibido: ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB`);
    }

    return true;
  }
}

module.exports = ImageValidator;
