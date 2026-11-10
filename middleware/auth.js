// Protección básica: revisa si la sesión pertenece al administrador.
function protegerApi(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({
    ok: false,
    mensaje: 'Debe iniciar sesión como administrador para ver esta información.'
  });
}

function protegerPagina(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect('/login.html');
}

module.exports = { protegerApi, protegerPagina };
