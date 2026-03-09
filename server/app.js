/**
 * Express Application Setup
 * Configures middleware, routes, and static file serving
 */

const path = require('path');
const express = require('express');
const securityMiddleware = require('./middleware/security');
const apiRoutes = require('./routes/api');

const app = express();

// Security headers middleware
app.use(securityMiddleware);

// JSON parsing middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// API Documentation (optional - only if swagger.yaml exists)
try {
  const { swaggerUi, swaggerDocument, swaggerOptions } = require('./config/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
} catch (err) {
  // Swagger not available - continue without it
}

// Serve static frontend (for production builds)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback to index.html for SPA routing (production only)
app.get('*', (req, res) => {
  // Only serve index.html if not an API route
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicDir, 'index.html'));
  }
});

module.exports = app;

