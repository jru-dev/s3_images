/**
 * Interfaz para validar archivos.
 */
class ValidatorInterface {
  /**
   * Valida metadatos del archivo.
   * @param {Object} fileData 
   * @returns {boolean}
   * @throws {Error} si la validación falla.
   */
  validate(fileData) {
    throw new Error('Method not implemented');
  }
}

module.exports = ValidatorInterface;
