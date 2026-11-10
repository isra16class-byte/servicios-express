const path = require('path');
const express = require('express');
const session = require('express-session');
const config = require('./config/config');
const { protegerPagina } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(session({
  secret: config.claveSesion,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

// Recursos estáticos públicos (formulario, login, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api', require('./routes/authRoutes'));
app.use('/api/solicitudes', require('./routes/solicitudRoutes'));
app.use('/api', (req, res) => res.status(404).json({ ok: false, mensaje: 'La ruta solicitada no existe.' }));

// Panel administrativo: la vista NO está en /public, solo se entrega con sesión activa
app.get('/admin', protegerPagina, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Errores no controlados (por ejemplo, JSON mal formado)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, mensaje: 'Los datos enviados no son válidos.' });
  }
  console.error(err);
  res.status(500).json({ ok: false, mensaje: 'Ocurrió un problema. Inténtelo nuevamente.' });
});

app.listen(config.puerto, () => {
  console.log(`Servidor listo en http://localhost:${config.puerto}`);
});
