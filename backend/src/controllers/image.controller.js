const { generateUniqueFilename } = require('../utils/filename.util');
const logger = require('../utils/logger');

class ImageController {
  constructor(storageService, validator) {
    this.storageService = storageService;
    this.validator = validator;
  }

  getUploadUrl = async (req, res, next) => {
    try {
      const { filename, contentType, sizeBytes } = req.body;

      // Validación
      this.validator.validate({ contentType, sizeBytes });

      // Generar key único dentro del prefijo originales/
      const uniqueName = generateUniqueFilename(filename);
      const key = `originales/${uniqueName}`;

      const uploadUrl = await this.storageService.generateUploadUrl(key, contentType);

      logger.info(`Generated upload URL for: ${key}`);
      res.json({ uploadUrl, key });
    } catch (error) {
      logger.error('Error in getUploadUrl', error);
      next(error);
    }
  };

  listImages = async (req, res, next) => {
    try {
      const prefix = 'originales/';
      const images = await this.storageService.listFiles(prefix);
      
      // Filtrar el prefijo mismo si aparece en la lista
      const filteredImages = images.filter(img => img.key !== prefix);

      res.json(filteredImages);
    } catch (error) {
      logger.error('Error in listImages', error);
      next(error);
    }
  };

  deleteImage = async (req, res, next) => {
    try {
      const { key } = req.params;
      
      if (!key) {
        return res.status(400).json({ error: 'La key de la imagen es requerida' });
      }

      await this.storageService.deleteFile(key);
      
      logger.info(`Deleted image: ${key}`);
      res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      logger.error('Error in deleteImage', error);
      next(error);
    }
  };
}

module.exports = ImageController;
