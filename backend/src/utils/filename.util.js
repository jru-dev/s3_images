const crypto = require('crypto');
const path = require('path');

/**
 * Sanitiza y genera un nombre de archivo único
 * @param {string} originalName 
 * @returns {string}
 */
const generateUniqueFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  // Limpiar caracteres extraños del nombre base (opcional)
  const baseName = path.basename(originalName, ext)
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
    
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  
  return `${timestamp}-${randomBytes}-${baseName}${ext}`;
};

module.exports = {
  generateUniqueFilename
};
