const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/image.routes');
const logger = require('./utils/logger');
const config = require('./config/env');

const app = express();

// Middlewares
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', imageRoutes);

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message
  });
});

module.exports = app;
