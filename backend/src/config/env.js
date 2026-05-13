require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },
  cors: {
    origin: process.env.FRONTEND_URL || '*',
  }
};

// Validación de variables críticas
if (!config.aws.region || !config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.bucketName) {
  console.warn('⚠️ Faltan variables de entorno de AWS. La aplicación puede no funcionar correctamente.');
}

module.exports = config;
