CREATE TABLE IF NOT EXISTS solicitudes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL,
  correo      TEXT NOT NULL,
  servicio    TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado      TEXT NOT NULL DEFAULT 'Pendiente'
              CHECK (estado IN ('Pendiente', 'En proceso', 'Resuelto')),
  fecha       TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
