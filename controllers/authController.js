const { admin } = require('../config/config');

exports.login = (req, res) => {
  const { usuario, clave } = req.body || {};
  if (!usuario || !clave) {
    return res.status(400).json({ ok: false, mensaje: 'Ingrese usuario y contraseña.' });
  }
  if (usuario !== admin.usuario || clave !== admin.clave) {
    return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrectos.' });
  }
  req.session.admin = true;
  res.json({ ok: true, mensaje: 'Sesión iniciada.' });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true, mensaje: 'Sesión cerrada.' }));
};

exports.sesion = (req, res) => {
  res.json({ ok: true, autenticado: Boolean(req.session && req.session.admin) });
};
