/**
 * Server Entry Point
 * Starts the Express server
 */

const app = require('./app');
const { PORT } = require('./config/constants');

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  
  // Log Swagger docs if available
  try {
    require('./config/swagger');
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  } catch (err) {
    // Swagger not available
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;

