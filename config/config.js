const path = require('path');

module.exports = {
  puerto: process.env.PORT || 3000,
  archivoBD: process.env.DB_FILE || path.join(__dirname, '..', 'database', 'solicitudes.db'),
  claveSesion: process.env.SESSION_SECRET || 'clave-academica-de-prueba',
  // Credenciales EXCLUSIVAMENTE de prueba (uso académico)
  admin: {
    usuario: process.env.ADMIN_USER || 'admin',
    clave: process.env.ADMIN_PASS || 'admin123'
  },
  // Los tres servicios definidos en el caso práctico 1
  servicios: [
    'Mantenimiento de computadoras',
    'Instalación de redes domésticas',
    'Soporte tecnológico remoto'
  ],
  estados: ['Pendiente', 'En proceso', 'Resuelto']
};
