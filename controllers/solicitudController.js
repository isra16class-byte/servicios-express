const Solicitud = require('../models/solicitudModel');
const { servicios, estados } = require('../config/config');

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ERROR_GENERAL = 'No se pudo completar la operación. Inténtelo nuevamente.';

const texto = (v) => (typeof v === 'string' ? v.trim() : '');
const responderError = (res, estado, mensaje) => res.status(estado).json({ ok: false, mensaje });
const leerId = (req) => (/^\d+$/.test(req.params.id) ? Number(req.params.id) : null);

// Devuelve { error } o { datos } con los campos ya limpios.
function validar(body) {
  const d = {
    nombre: texto(body.nombre),
    correo: texto(body.correo),
    servicio: texto(body.servicio),
    descripcion: texto(body.descripcion)
  };
  const etiquetas = { nombre: 'nombre', correo: 'correo', servicio: 'tipo de servicio', descripcion: 'descripción' };
  const faltan = Object.keys(d).filter((k) => !d[k]).map((k) => etiquetas[k]);

  if (faltan.length) return { error: `Complete los campos obligatorios: ${faltan.join(', ')}.` };
  if (d.nombre.length < 2 || d.nombre.length > 100) return { error: 'El nombre debe tener entre 2 y 100 caracteres.' };
  if (!REGEX_CORREO.test(d.correo)) return { error: 'El correo electrónico no tiene un formato válido (ejemplo: nombre@dominio.com).' };
  if (!servicios.includes(d.servicio)) return { error: 'Seleccione un tipo de servicio de la lista.' };
  if (d.descripcion.length < 10 || d.descripcion.length > 500) return { error: 'La descripción debe tener entre 10 y 500 caracteres.' };
  return { datos: d };
}

exports.crear = (req, res) => {
  const { error, datos } = validar(req.body || {});
  if (error) return responderError(res, 400, error);
  try {
    const nueva = Solicitud.crear(datos);
    res.status(201).json({ ok: true, mensaje: 'Solicitud registrada correctamente.', data: nueva });
  } catch (e) {
    console.error(e);
    responderError(res, 500, ERROR_GENERAL);
  }
};

exports.listar = (req, res) => {
  try {
    res.json({ ok: true, data: Solicitud.listar() });
  } catch (e) {
    console.error(e);
    responderError(res, 500, 'No se pudieron cargar las solicitudes.');
  }
};

exports.obtener = (req, res) => {
  const id = leerId(req);
  const solicitud = id && Solicitud.buscarPorId(id);
  if (!solicitud) return responderError(res, 404, 'La solicitud indicada no existe.');
  res.json({ ok: true, data: solicitud });
};

exports.actualizarEstado = (req, res) => {
  const id = leerId(req);
  const estado = texto((req.body || {}).estado);
  if (!estados.includes(estado)) {
    return responderError(res, 400, `Estado no válido. Use: ${estados.join(', ')}.`);
  }
  try {
    const actualizada = id && Solicitud.actualizarEstado(id, estado);
    if (!actualizada) return responderError(res, 404, 'La solicitud indicada no existe.');
    res.json({ ok: true, mensaje: 'Estado actualizado.', data: actualizada });
  } catch (e) {
    console.error(e);
    responderError(res, 500, 'No se pudo actualizar la solicitud. Inténtelo nuevamente.');
  }
};

exports.eliminar = (req, res) => {
  const id = leerId(req);
  try {
    if (!id || !Solicitud.eliminar(id)) return responderError(res, 404, 'La solicitud indicada no existe.');
    res.json({ ok: true, mensaje: 'Solicitud eliminada.' });
  } catch (e) {
    console.error(e);
    responderError(res, 500, 'No se pudo eliminar la solicitud. Inténtelo nuevamente.');
  }
};
