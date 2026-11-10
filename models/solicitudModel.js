// Acceso a datos: único lugar donde se escribe SQL.
const db = require('../database/db');

module.exports = {
  crear({ nombre, correo, servicio, descripcion }) {
    const r = db.prepare(
      'INSERT INTO solicitudes (nombre, correo, servicio, descripcion) VALUES (?, ?, ?, ?)'
    ).run(nombre, correo, servicio, descripcion);
    return this.buscarPorId(r.lastInsertRowid);
  },
  listar() {
    return db.prepare('SELECT * FROM solicitudes ORDER BY id DESC').all();
  },
  buscarPorId(id) {
    return db.prepare('SELECT * FROM solicitudes WHERE id = ?').get(id);
  },
  actualizarEstado(id, estado) {
    const r = db.prepare('UPDATE solicitudes SET estado = ? WHERE id = ?').run(estado, id);
    return r.changes > 0 ? this.buscarPorId(id) : null;
  },
  eliminar(id) {
    return db.prepare('DELETE FROM solicitudes WHERE id = ?').run(id).changes > 0;
  }
};
