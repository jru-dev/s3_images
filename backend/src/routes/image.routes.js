const express = require('express');
const ImageController = require('../controllers/image.controller');
const S3StorageService = require('../services/s3.storage.service');
const ImageValidator = require('../validators/image.validator');

const router = express.Router();

// Inyección de dependencias (Composition Root parcial)
const storageService = new S3StorageService();
const imageValidator = new ImageValidator();
const imageController = new ImageController(storageService, imageValidator);

// Definición de rutas
router.post('/upload-url', imageController.getUploadUrl);
router.get('/images', imageController.listImages);
router.delete('/images/:key(*)', imageController.deleteImage); // El (*) permite keys con slashes

module.exports = router;
