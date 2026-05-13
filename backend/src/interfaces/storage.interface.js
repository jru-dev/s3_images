/**
 * Interfaz para el servicio de almacenamiento (Interface Segregation Principle).
 * En JS usamos Duck Typing, así que esto sirve como documentación del contrato.
 */
class StorageInterface {
  /**
   * Genera una URL prefirmada para subida.
   * @param {string} key 
   * @param {string} contentType 
   * @returns {Promise<string>}
   */
  async generateUploadUrl(key, contentType) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene la lista de archivos.
   * @param {string} prefix 
   * @returns {Promise<Array>}
   */
  async listFiles(prefix) {
    throw new Error('Method not implemented');
  }

  /**
   * Elimina un archivo.
   * @param {string} key 
   * @returns {Promise<void>}
   */
  async deleteFile(key) {
    throw new Error('Method not implemented');
  }
}

module.exports = StorageInterface;
